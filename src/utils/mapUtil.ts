/** @format */

import mapboxgl from "mapbox-gl";
import { LokasiPenjualanType, LokasiUMKMType } from "@/types";
import { getMarkerColor } from "@/constants/mapConstant";

/**
 * Membuat popup untuk lokasi penjualan
 */
export const createPenjualanPopup = (
  lokasi: LokasiPenjualanType
): mapboxgl.Popup => {
  return new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div style="padding: 10px;">
      <h3 style="margin: 0 0 5px 0;">${lokasi.nm_lokasi}</h3>
      <p style="margin: 0;"><strong>Kategori:</strong> ${
        lokasi.kategori_lokasi_detail?.nm_kategori_lokasi || "Tanpa Kategori"
      }</p>
      <p style="margin: 5px 0 0 0;"><strong>Alamat:</strong> ${
        lokasi.alamat
      }</p>
      ${
        lokasi.kecamatan_detail
          ? `
        <p style="margin: 5px 0 0 0;"><strong>Kecamatan:</strong> ${lokasi.kecamatan_detail.nm_kecamatan}</p>
        <p style="margin: 5px 0 0 0;"><strong>Kabupaten:</strong> ${lokasi.kabupaten_detail?.nm_kabupaten}</p>
        <p style="margin: 5px 0 0 0;"><strong>Provinsi:</strong> ${lokasi.provinsi_detail?.nm_provinsi}</p>
      `
          : ""
      }
      ${
        lokasi.tlp_pengelola
          ? `<p style="margin: 5px 0 0 0;"><strong>Telepon:</strong> ${lokasi.tlp_pengelola}</p>`
          : ""
      }
    </div>
  `);
};

/**
 * Membuat popup untuk lokasi UMKM
 */
export const createUMKMPopup = (lokasi: LokasiUMKMType): mapboxgl.Popup => {
  // Ambil nama bisnis atau username jika tersedia
  const namaBisnis = "Lokasi UMKM"; // Default fallback

  return new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div style="padding: 10px;">
      <h3 style="margin: 0 0 5px 0;">${namaBisnis}</h3>
      <p style="margin: 0;"><strong>Tipe:</strong> UMKM</p>
      <p style="margin: 5px 0 0 0;"><strong>Alamat:</strong> ${
        lokasi.alamat_lengkap
      }</p>
      ${
        lokasi.kecamatan_detail
          ? `
        <p style="margin: 5px 0 0 0;"><strong>Kecamatan:</strong> ${lokasi.kecamatan_detail.nm_kecamatan}</p>
        <p style="margin: 5px 0 0 0;"><strong>Kabupaten:</strong> ${lokasi.kabupaten_detail?.nm_kabupaten}</p>
        <p style="margin: 5px 0 0 0;"><strong>Provinsi:</strong> ${lokasi.provinsi_detail?.nm_provinsi}</p>
      `
          : ""
      }
      ${
        lokasi.kode_pos
          ? `<p style="margin: 5px 0 0 0;"><strong>Kode Pos:</strong> ${lokasi.kode_pos}</p>`
          : ""
      }
    </div>
  `);
};

/**
 * Mencari lokasi berdasarkan nama/alamat
 */
export const searchLocationByQuery = async (
  searchQuery: string,
  map: mapboxgl.Map | null,
  draggableMarker: mapboxgl.Marker | null,
  setValue: any | undefined,
  onLocationSelect: ((lng: number, lat: number) => void) | undefined,
  setLng: React.Dispatch<React.SetStateAction<number>>,
  setLat: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  if (!searchQuery || searchQuery.trim() === "") return;

  try {
    // Gunakan Mapbox Geocoding API
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchQuery
      )}.json?access_token=${mapboxgl.accessToken}&country=id&limit=1`
    );

    if (!response.ok) throw new Error("Gagal mendapatkan data lokasi");

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;

      setLng(longitude);
      setLat(latitude);

      // Perbarui lokasi peta
      if (map) {
        map.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true,
        });

        // Perbarui posisi marker jika ada
        if (draggableMarker) {
          draggableMarker.setLngLat([longitude, latitude]);
        }

        // Update form values if setValue function is provided
        if (setValue) {
          setValue("longitude", longitude);
          setValue("latitude", latitude);
        }

        // Call external handler if provided
        if (onLocationSelect) {
          onLocationSelect(longitude, latitude);
        }
      }
    } else {
      alert("Lokasi tidak ditemukan. Coba kata kunci lain.");
    }
  } catch (error) {
    console.error("Error searching location:", error);
    alert("Gagal melakukan pencarian lokasi.");
  }
};

/**
 * Mendeteksi lokasi pengguna saat ini
 */
export const detectUserLocation = (
  map: mapboxgl.Map | null,
  draggableMarker: mapboxgl.Marker | null,
  setValue: any | undefined,
  onLocationSelect: ((lng: number, lat: number) => void) | undefined,
  setLng: React.Dispatch<React.SetStateAction<number>>,
  setLat: React.Dispatch<React.SetStateAction<number>>,
  setIsLocating: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setIsLocating(true);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        setLng(longitude);
        setLat(latitude);

        // Perbarui lokasi peta
        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true,
          });

          // Perbarui posisi marker jika ada
          if (draggableMarker) {
            draggableMarker.setLngLat([longitude, latitude]);
          }

          // Update form values if setValue function is provided
          if (setValue) {
            setValue("longitude", longitude);
            setValue("latitude", latitude);
          }

          // Call external handler if provided
          if (onLocationSelect) {
            onLocationSelect(longitude, latitude);
          }
        }

        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert(
          "Gagal mendapatkan lokasi Anda. Pastikan GPS dan izin lokasi diaktifkan."
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("Browser Anda tidak mendukung geolocation.");
    setIsLocating(false);
  }
};

/**
 * Menambahkan marker lokasi penjualan dan UMKM ke peta
 */
export const addLocationMarkers = (
  map: mapboxgl.Map | null,
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>,
  lokasiPenjualan: LokasiPenjualanType[],
  lokasiUMKM: LokasiUMKMType[],
  activeFilters: string[],
  kategoriLokasi?: any[]
): void => {
  console.log("=== DEBUG addLocationMarkers ===");
  console.log("Map instance:", map);
  console.log("Map loaded status:", map?.loaded());
  console.log("Map style loaded:", map?.isStyleLoaded());
  console.log("Active filters:", activeFilters);
  console.log("Lokasi Penjualan:", lokasiPenjualan);
  console.log("Kategori Lokasi:", kategoriLokasi);

  if (!map) {
    console.error("Map instance is null!");
    return;
  }

  // Check if map is ready
  if (!map.loaded() || !map.isStyleLoaded()) {
    console.warn("Map is not fully loaded yet, retrying in 500ms...");
    setTimeout(() => {
      addLocationMarkers(
        map,
        markersRef,
        lokasiPenjualan,
        lokasiUMKM,
        activeFilters,
        kategoriLokasi
      );
    }, 500);
    return;
  }

  // Hapus marker yang ada
  console.log(`Removing ${markersRef.current.length} existing markers`);
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  // Tambahkan marker untuk lokasi penjualan
  if (lokasiPenjualan && lokasiPenjualan.length > 0) {
    console.log(`Processing ${lokasiPenjualan.length} lokasi penjualan`);

    lokasiPenjualan.forEach((lokasi, index) => {
      console.log(`\nProcessing lokasi ${index}:`, {
        id: lokasi.id,
        nama: lokasi.nm_lokasi,
        kategori_id: lokasi.kategori_lokasi,
        lat: lokasi.latitude,
        lng: lokasi.longitude,
        kategori_nama: lokasi.kategori_lokasi_nama,
      });

      // Validasi koordinat
      if (!lokasi.latitude || !lokasi.longitude) {
        console.warn(
          `Lokasi ${lokasi.nm_lokasi} tidak memiliki koordinat valid`
        );
        return;
      }

      // Validasi koordinat range
      if (
        lokasi.latitude < -90 ||
        lokasi.latitude > 90 ||
        lokasi.longitude < -180 ||
        lokasi.longitude > 180
      ) {
        console.warn(
          `Lokasi ${lokasi.nm_lokasi} memiliki koordinat tidak valid: ${lokasi.latitude}, ${lokasi.longitude}`
        );
        return;
      }

      // Cek filter - pastikan kategori_lokasi ada dalam activeFilters
      const kategoriId = lokasi.kategori_lokasi || "";
      const isFilterActive = activeFilters.includes(kategoriId);

      console.log(`Filter check untuk ${lokasi.nm_lokasi}:`, {
        kategoriId,
        activeFilters,
        isFilterActive,
      });

      if (!isFilterActive) {
        console.log(
          `Lokasi ${lokasi.nm_lokasi} tidak ditampilkan karena filter tidak aktif`
        );
        return;
      }

      try {
        // Buat popup
        const popup = createPenjualanPopup(lokasi);

        // Get marker color
        const markerColor = getMarkerColor(kategoriId, kategoriLokasi);
        console.log(
          `Marker color untuk kategori ${kategoriId}: ${markerColor}`
        );

        // Buat marker dengan opsi yang lebih eksplisit
        const markerElement = document.createElement("div");
        markerElement.style.backgroundColor = markerColor;
        markerElement.style.width = "20px";
        markerElement.style.height = "20px";
        markerElement.style.borderRadius = "50%";
        markerElement.style.border = "2px solid white";
        markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat([lokasi.longitude, lokasi.latitude])
          .setPopup(popup);

        // Add to map
        marker.addTo(map);
        markersRef.current.push(marker);

        console.log(
          `✓ Marker berhasil ditambahkan untuk ${lokasi.nm_lokasi} di koordinat [${lokasi.longitude}, ${lokasi.latitude}]`
        );

        // Test marker visibility
        const markerDOM = marker.getElement();
        console.log("Marker DOM element:", markerDOM);
        console.log(
          "Marker DOM computed style:",
          window.getComputedStyle(markerDOM)
        );
      } catch (error) {
        console.error(
          `Error creating marker untuk ${lokasi.nm_lokasi}:`,
          error
        );
      }
    });

    console.log(`Total markers ditambahkan: ${markersRef.current.length}`);
  }

  // Tambahkan marker untuk lokasi UMKM
  if (lokasiUMKM && lokasiUMKM.length > 0 && activeFilters.includes("umkm")) {
    console.log(`\nProcessing ${lokasiUMKM.length} lokasi UMKM`);

    lokasiUMKM.forEach((lokasi) => {
      if (lokasi.latitude && lokasi.longitude) {
        try {
          const popup = createUMKMPopup(lokasi);

          const markerElement = document.createElement("div");
          markerElement.style.backgroundColor = "#00B894";
          markerElement.style.width = "20px";
          markerElement.style.height = "20px";
          markerElement.style.borderRadius = "50%";
          markerElement.style.border = "2px solid white";
          markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

          const marker = new mapboxgl.Marker({
            element: markerElement,
            anchor: "center",
          })
            .setLngLat([lokasi.longitude, lokasi.latitude])
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);
          console.log(
            `✓ UMKM marker added at [${lokasi.longitude}, ${lokasi.latitude}]`
          );
        } catch (error) {
          console.error("Error creating UMKM marker:", error);
        }
      }
    });
  }

  // Check current map bounds
  const bounds = map.getBounds();
  console.log("Current map bounds:", bounds.toArray());
  console.log("Current map center:", map.getCenter());
  console.log("Current map zoom:", map.getZoom());

  console.log("=== END DEBUG ===");
};
