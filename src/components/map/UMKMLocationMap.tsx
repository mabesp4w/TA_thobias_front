/** @format */

"use client"; // Tandai sebagai komponen client

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { token_mapbox } from "@/services/baseURL";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// Import konstanta
import { MAP_STYLES } from "@/constants/mapConstant";
// tipe data
export interface MapProps {
  initialLng?: number;
  initialLat?: number;
  initialZoom?: number;
  mapStyle?: string;
  width?: string;
  height?: string;
  setValue?: any;
  initialMapStyle?: string;
  lokasiPenjualan?: LokasiPenjualanType[];
  lokasiUMKM?: LokasiUMKMType[];
  kategoriLokasi?: KategoriLokasiPenjualanType[];
  enableDraggableMarker?: boolean;
  onLocationSelect?: (lng: number, lat: number) => void;
  showControl?: boolean;
}

// Import utilitas
import {
  addLocationMarkers,
  detectUserLocation,
  searchLocationByQuery,
} from "@/utils/mapUtil";

// Import komponen
import {
  FilterLokasi,
  MapLegend,
  SearchBar,
  CoordinateInputs,
  MapControls,
} from "@/components/map/FilterOther";
import {
  LokasiPenjualanType,
  LokasiUMKMType,
  KategoriLokasiPenjualanType,
} from "@/types";
import useKategoriLokasiPenjualanApi from "@/stores/api/KategoriLokasiPenjualan";

mapboxgl.accessToken = token_mapbox;

const UMKMLocationMap: React.FC<MapProps> = ({
  initialLng = 140.6697, // Default ke jayapura
  initialLat = -2.5919,
  initialZoom = 10,
  initialMapStyle = "mapbox://styles/mapbox/streets-v11",
  width = "100%",
  height = "500px",
  setValue,
  lokasiPenjualan = [],
  lokasiUMKM = [],
  kategoriLokasi: propKategoriLokasi,
  enableDraggableMarker = false,
  onLocationSelect,
  showControl = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(initialLng);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(initialZoom);
  const [mapStyle, setMapStyle] = useState(initialMapStyle);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const draggableMarker = useRef<mapboxgl.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false); // Track map loaded state

  // Get kategori lokasi from store if not provided via props
  const { setKategoriLokasiPenjualan, dtKategoriLokasiPenjualan } =
    useKategoriLokasiPenjualanApi();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Use prop kategoriLokasi if provided, otherwise use from store
  const kategoriLokasi = propKategoriLokasi || dtKategoriLokasiPenjualan || [];

  // Fetch kategori lokasi if not provided via props
  useEffect(() => {
    if (
      !propKategoriLokasi &&
      (!dtKategoriLokasiPenjualan || dtKategoriLokasiPenjualan.length === 0)
    ) {
      setKategoriLokasiPenjualan();
    }
  }, [propKategoriLokasi]);

  // Initialize active filters based on available categories
  useEffect(() => {
    if (kategoriLokasi.length > 0 && activeFilters.length === 0) {
      // Set all kategori IDs as active by default
      const allKategoriIds = kategoriLokasi.map((k) => k.id);
      setActiveFilters([...allKategoriIds, "umkm"]);
    }
  }, [kategoriLokasi]);

  // Fungsi untuk mencari lokasi berbasis pencarian
  const handleSearchLocation = async (): Promise<void> => {
    await searchLocationByQuery(
      searchQuery,
      map.current,
      draggableMarker.current,
      setValue,
      onLocationSelect,
      setLng,
      setLat
    );
  };

  // Fungsi untuk mendeteksi lokasi pengguna
  const handleDetectUserLocation = (): void => {
    detectUserLocation(
      map.current,
      draggableMarker.current,
      setValue,
      onLocationSelect,
      setLng,
      setLat,
      setIsLocating
    );
  };

  // Fungsi untuk mengupdate marker lokasi
  const handleAddMarkers = (): void => {
    // Only add markers if map is loaded
    if (!mapLoaded || !map.current) {
      console.log("Map not ready for markers yet");
      return;
    }

    addLocationMarkers(
      map.current,
      markersRef,
      lokasiPenjualan,
      lokasiUMKM,
      activeFilters,
      kategoriLokasi
    );
  };

  // Handler untuk mengubah style peta
  const handleMapStyleChange = (newStyle: string): void => {
    setMapStyle(newStyle);
    if (map.current) {
      map.current.setStyle(newStyle);
      // Reset map loaded state when style changes
      setMapLoaded(false);
    }
  };

  // Toggle filter lokasi
  const toggleFilter = (value: string): void => {
    setActiveFilters((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  useEffect(() => {
    // Inisialisasi peta hanya jika belum ada
    if (map.current) return;

    // Buat peta baru
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [lng, lat],
        zoom: zoom,
      });

      // Tambahkan kontrol navigasi
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Event listener untuk map load
      map.current.on("load", () => {
        console.log("Map loaded!");
        setMapLoaded(true);
      });

      // Event listener untuk style load (ketika style berubah)
      map.current.on("styledata", () => {
        if (map.current?.isStyleLoaded()) {
          console.log("Map style loaded!");
          setMapLoaded(true);
        }
      });

      // Buat marker yang dapat digerakkan (draggable) jika diaktifkan
      if (enableDraggableMarker) {
        draggableMarker.current = new mapboxgl.Marker({
          draggable: true,
          color: "#FF0000",
        })
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Event listener untuk koordinat ketika marker dipindahkan
        draggableMarker.current.on("dragend", () => {
          if (!draggableMarker.current) return;

          const lngLat = draggableMarker.current.getLngLat();
          const { lng: newLng, lat: newLat } = lngLat;
          setLng(newLng);
          setLat(newLat);

          if (setValue) {
            setValue("longitude", newLng);
            setValue("latitude", newLat);
          }

          if (onLocationSelect) {
            onLocationSelect(newLng, newLat);
          }

          console.log(`Koordinat baru: ${newLng}, ${newLat}`);
        });
      }

      // Event listener untuk perubahan peta
      map.current.on("move", () => {
        if (map.current) {
          const center = map.current.getCenter();
          setLng(parseFloat(center.lng.toFixed(4)));
          setLat(parseFloat(center.lat.toFixed(4)));
          setZoom(parseFloat(map.current.getZoom().toFixed(2)));
        }
      });

      // Tambahkan event listener untuk klik pada peta jika marker draggable diaktifkan
      if (enableDraggableMarker) {
        map.current.on("click", (e) => {
          const { lng, lat } = e.lngLat;

          if (draggableMarker.current) {
            draggableMarker.current.setLngLat([lng, lat]);
          }

          setLng(lng);
          setLat(lat);

          if (setValue) {
            setValue("longitude", lng);
            setValue("latitude", lat);
          }

          if (onLocationSelect) {
            onLocationSelect(lng, lat);
          }

          console.log(`Koordinat yang dipilih: ${lng}, ${lat}`);
        });
      }
    }

    // Cleanup pada unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapStyle, initialLng, initialLat, initialZoom]);

  // Tambah atau perbarui marker ketika data lokasi berubah atau filter aktif
  // AND when map is loaded
  useEffect(() => {
    if (mapLoaded) {
      // Add small delay to ensure map is fully ready
      const timer = setTimeout(() => {
        handleAddMarkers();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [lokasiPenjualan, lokasiUMKM, activeFilters, kategoriLokasi, mapLoaded]);

  return (
    <div>
      {/* Controls untuk peta */}
      {showControl && (
        <MapControls
          lng={lng}
          lat={lat}
          mapStyle={mapStyle}
          handleMapStyleChange={handleMapStyleChange}
          setValue={setValue}
          onLocationSelect={onLocationSelect}
          detectUserLocation={handleDetectUserLocation}
          isLocating={isLocating}
        />
      )}

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-grow">
          <div className="flex gap-2 flex-wrap">
            {/* Pencarian lokasi */}
            <div className="flex-grow">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchLocation={handleSearchLocation}
              />
            </div>

            {/* Dropdown untuk memilih style peta */}
            <div>
              <label className="mr-2 font-medium">Jenis Peta:</label>
              <select
                value={mapStyle}
                onChange={(e) => handleMapStyleChange(e.target.value)}
                className="border rounded p-2"
              >
                {MAP_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter lokasi */}
        <FilterLokasi
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          kategoriLokasi={kategoriLokasi}
        />
      </div>

      {/* Container peta */}
      <div className="relative">
        <div
          ref={mapContainer}
          style={{ width, height }}
          className="rounded shadow"
        />

        {/* Show loading indicator when map is not ready */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="text-gray-600">Loading map...</div>
          </div>
        )}

        {/* Petunjuk interaksi peta jika marker dapat digeser */}
        {enableDraggableMarker && mapLoaded && (
          <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-white p-2 rounded shadow pointer-events-auto">
              {draggableMarker.current ? (
                <div className="text-sm text-center">
                  Geser marker merah untuk memilih lokasi, atau klik langsung
                  pada peta
                </div>
              ) : (
                <div className="text-sm text-center">
                  Klik pada peta untuk menetapkan lokasi
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legenda marker */}
      <MapLegend kategoriLokasi={kategoriLokasi} />

      {/* Input koordinat jika marker dapat digeser */}
      {enableDraggableMarker && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <div className="font-medium mb-2">Koordinat yang Dipilih:</div>
          <CoordinateInputs
            lng={lng}
            lat={lat}
            setLng={setLng}
            setLat={setLat}
            map={map.current}
            draggableMarker={draggableMarker.current}
            setValue={setValue}
            onLocationSelect={onLocationSelect}
          />
        </div>
      )}
    </div>
  );
};

export default UMKMLocationMap;
