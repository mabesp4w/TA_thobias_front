/** @format */

"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Ganti dengan token Mapbox Anda
// PENTING: Pastikan token didefinisikan dengan benar di file .env.local
// dan diawali dengan NEXT_PUBLIC_
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  style?: string;
  onDragEnd?: (lat: number, lng: number) => void;
  initialMarkerPosition?: { lat: number; lng: number };
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  center = [106.816666, -6.2], // Default ke Jakarta
  zoom = 15,
  onMapClick,
  className = "",
  style = "mapbox://styles/mapbox/streets-v11",
  onDragEnd,
  initialMarkerPosition,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [locationStatus, setLocationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  console.log("Mapbox token:", mapLoaded);

  // Debugging token
  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setMapError(
        "Mapbox token tidak tersedia. Harap periksa konfigurasi Anda."
      );
      setLocationStatus("error");
      setIsLocating(false);
      return;
    }

    // Langsung mencoba mendapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus("success");
          setIsLocating(false);

          // Inisialisasi peta dengan lokasi pengguna
          initializeMap([position.coords.longitude, position.coords.latitude]);

          // Jika ada callback onMapClick dan tidak ada posisi awal, panggil dengan lokasi pengguna
          if (onMapClick && !initialMarkerPosition) {
            onMapClick(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          let errorMessage =
            "Anda menolak akses lokasi. Untuk menggunakan fitur ini, izinkan akses lokasi di browser Anda.";

          if (error.code === 2) {
            errorMessage =
              "Tidak dapat memperoleh lokasi Anda. Periksa GPS atau koneksi internet Anda.";
          } else if (error.code === 3) {
            errorMessage = "Waktu mencari lokasi telah habis. Coba lagi nanti.";
          }

          setMapError(errorMessage);
          setLocationStatus("error");
          setIsLocating(false);

          // Fallback ke lokasi default jika tidak bisa mendapatkan lokasi pengguna
          initializeMap(center);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setMapError(
        "Browser Anda tidak mendukung geolocation. Fitur ini tidak dapat digunakan."
      );
      setLocationStatus("error");
      setIsLocating(false);

      // Fallback ke lokasi default jika tidak mendukung geolocation
      initializeMap(center);
    }
  }, [onMapClick, center, initialMarkerPosition]);

  // Fungsi untuk membuat marker yang bisa dipindahkan
  const addDraggableMarker = (
    mapInstance: mapboxgl.Map,
    lngLat: [number, number]
  ) => {
    // Hapus marker yang ada jika sudah ada
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Buat elemen marker
    const el = document.createElement("div");

    // Styling marker
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "#E91E63"; // pink untuk marker
    el.style.border = "2px solid white";
    el.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)";
    el.style.cursor = "grab";

    // Tambahkan efek pulse di sekitar marker
    el.innerHTML = `
      <div style="
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border-radius: 50%;
        background: rgba(233, 30, 99, 0.3);
        animation: pulse 1.5s infinite;
        z-index: -1;
      "></div>
    `;

    // Tambahkan animasi pulse ke style document jika belum ada
    if (!document.getElementById("pulse-animation")) {
      const style = document.createElement("style");
      style.id = "pulse-animation";
      style.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Buat popup untuk marker
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div>
        <h3 class="font-bold">Lokasi Terpilih</h3>
        <p>Tarik marker untuk menyesuaikan lokasi</p>
      </div>
    `);

    // Buat dan tambahkan marker yang bisa dipindahkan
    const marker = new mapboxgl.Marker({
      element: el,
      draggable: true,
    })
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(mapInstance);

    // Log saat marker dibuat
    console.log("Marker dibuat pada:", lngLat);

    // Tambahkan event listener untuk dragend
    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      console.log("Marker dipindahkan ke:", lngLat);
      if (onDragEnd) {
        onDragEnd(lngLat.lat, lngLat.lng);
      }
    });

    // Pastikan marker menangani event dragend dengan benar
    // dengan menambahkan event listener ke elemen DOM
    const markerElement = marker.getElement();
    markerElement.addEventListener("mousedown", () => {
      markerElement.style.cursor = "grabbing";
    });

    markerElement.addEventListener("mouseup", () => {
      markerElement.style.cursor = "grab";
    });

    markerRef.current = marker;
    return marker;
  };

  const initializeMap = (mapCenter: [number, number]) => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: mapCenter,
        zoom: zoom,
        attributionControl: false,
      });

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add attribution control
      map.current.addControl(new mapboxgl.AttributionControl(), "bottom-right");

      // Map click handler
      map.current.on("click", (e) => {
        // Tambahkan marker yang bisa dipindahkan di lokasi klik
        if (map.current) {
          const marker = addDraggableMarker(map.current, [
            e.lngLat.lng,
            e.lngLat.lat,
          ]);
          console.log("Marker dibuat melalui klik pada:", [
            e.lngLat.lng,
            e.lngLat.lat,
            marker.getLngLat(),
          ]);
        }

        // Panggil onMapClick callback jika ada
        if (onMapClick) {
          onMapClick(e.lngLat.lat, e.lngLat.lng);
        }
      });

      map.current.on("load", () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);

        // Jika ada posisi awal untuk marker, tambahkan marker tersebut
        if (map.current && initialMarkerPosition) {
          addDraggableMarker(map.current, [
            initialMarkerPosition.lng,
            initialMarkerPosition.lat,
          ]);
          console.log("Marker dibuat dengan posisi awal:", [
            initialMarkerPosition.lng,
            initialMarkerPosition.lat,
          ]);
        } else if (map.current) {
          // Tambahkan marker di tengah peta jika tidak ada posisi awal
          const center = map.current.getCenter();
          addDraggableMarker(map.current, [center.lng, center.lat]);
          console.log("Marker dibuat di tengah peta:", [
            center.lng,
            center.lat,
          ]);

          if (onMapClick) {
            onMapClick(center.lat, center.lng);
          }
        }
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
        setMapError(
          "Error loading map: " + e.error?.message || "Unknown error"
        );
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(
        "Gagal menginisialisasi peta: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  if (isLocating) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="font-medium">Mendapatkan lokasi Anda...</p>
          <p className="text-xs text-gray-500 mt-2">
            Harap izinkan akses lokasi pada browser Anda
          </p>
        </div>
      </div>
    );
  }

  if (locationStatus === "error" && mapError) {
    return (
      <div
        className={`w-full h-full bg-base-200 rounded-lg flex items-center justify-center p-6 ${className}`}
        style={{ minHeight: "400px" }}
      >
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="font-bold text-lg mb-2">Error Lokasi</h3>
            <p>{mapError}</p>
          </div>
          <p className="text-sm">
            Untuk menggunakan fitur ini, harap izinkan akses lokasi di browser
            Anda:
          </p>
          <ol className="text-left mt-3 space-y-2 text-sm">
            <li>1. Klik ikon kunci/info di address bar browser</li>
            <li>2. Ubah pengaturan lokasi menjadi Izinkan</li>
            <li>3. Muat ulang halaman ini</li>
          </ol>
          <button
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full relative ${className}`}
      style={{ minHeight: "400px" }}
    >
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg"
        style={{ minHeight: "400px" }}
      />
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-sm">
        <p>Klik pada peta atau tarik marker untuk memilih lokasi</p>
      </div>
    </div>
  );
};

export default MapboxMap;
