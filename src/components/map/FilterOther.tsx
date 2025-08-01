/** @format */

import React from "react";
import { getMarkerColor } from "@/constants/mapConstant";
import { closeModal } from "@/utils/modalHelper";
import { KategoriLokasiPenjualanType } from "@/types";

interface FilterLokasiProps {
  activeFilters: string[];
  toggleFilter: (value: string) => void;
  kategoriLokasi?: KategoriLokasiPenjualanType[];
}

/**
 * Komponen untuk filter lokasi berdasarkan kategori
 */
export const FilterLokasi: React.FC<FilterLokasiProps> = ({
  activeFilters,
  toggleFilter,
  kategoriLokasi = [],
}) => {
  // Tambahkan filter untuk UMKM
  const allFilters = [
    ...kategoriLokasi.map((k) => ({
      id: k.id,
      label: k.nm_kategori_lokasi,
      color: getMarkerColor(k.id, kategoriLokasi),
    })),
    {
      id: "umkm",
      label: "UMKM",
      color: "#00B894",
    },
  ];

  return (
    <div className="filter-section">
      <span className="font-medium mr-2">Filter Lokasi:</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {allFilters.map((filter) => (
          <label key={filter.id} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={activeFilters.includes(filter.id)}
              onChange={() => toggleFilter(filter.id)}
              className="mr-1"
            />
            <span
              className="px-2 py-1 rounded text-white text-sm"
              style={{
                backgroundColor: filter.color,
              }}
            >
              {filter.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

/**
 * Komponen untuk legenda warna marker
 */
export const MapLegend: React.FC<{
  kategoriLokasi?: KategoriLokasiPenjualanType[];
}> = ({ kategoriLokasi = [] }) => {
  // Gabungkan kategori dengan UMKM
  const allLegends = [
    ...kategoriLokasi.map((k) => ({
      id: k.id,
      label: k.nm_kategori_lokasi,
      color: getMarkerColor(k.id, kategoriLokasi),
    })),
    {
      id: "umkm",
      label: "UMKM",
      color: "#00B894",
    },
  ];

  return (
    <div className="legend mt-2 p-2 bg-gray-100 rounded">
      <div className="font-medium mb-1">Legenda:</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {allLegends.map((legend) => (
          <div key={legend.id} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{
                backgroundColor: legend.color,
              }}
            ></div>
            <span>{legend.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen SearchBar dan lainnya tetap sama...
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchLocation: () => Promise<void>;
}

/**
 * Komponen untuk pencarian lokasi
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchLocation,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <div className="flex-grow">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari lokasi berdasarkan nama/alamat"
          className="w-full p-2 border rounded"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              searchLocation();
            }
          }}
        />
      </div>
      <button
        onClick={searchLocation}
        className="btn btn-primary"
        disabled={!searchQuery}
      >
        Cari
      </button>
    </div>
  );
};

interface CoordinateInputsProps {
  lng: number;
  lat: number;
  setLng: React.Dispatch<React.SetStateAction<number>>;
  setLat: React.Dispatch<React.SetStateAction<number>>;
  map: mapboxgl.Map | null;
  draggableMarker: mapboxgl.Marker | null;
  setValue?: any;
  onLocationSelect?: (lng: number, lat: number) => void;
}

/**
 * Komponen untuk input koordinat (latitude/longitude)
 */
export const CoordinateInputs: React.FC<CoordinateInputsProps> = ({
  lng,
  lat,
  setLng,
  setLat,
  map,
  draggableMarker,
  setValue,
  onLocationSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center">
        <label className="mr-2 font-medium">Longitude:</label>
        <input
          type="number"
          value={lng}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              setLng(value);
              if (map && draggableMarker) {
                const currentLat = draggableMarker.getLngLat().lat;
                draggableMarker.setLngLat([value, currentLat]);
                map.setCenter([value, currentLat]);

                if (setValue) {
                  setValue("longitude", value);
                }

                if (onLocationSelect) {
                  onLocationSelect(value, currentLat);
                }
              }
            }
          }}
          className="border rounded p-2 w-full"
          step="0.0001"
        />
      </div>
      <div className="flex items-center">
        <label className="mr-2 font-medium">Latitude:</label>
        <input
          type="number"
          value={lat}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              setLat(value);
              if (map && draggableMarker) {
                const currentLng = draggableMarker.getLngLat().lng;
                draggableMarker.setLngLat([currentLng, value]);
                map.setCenter([currentLng, value]);

                if (setValue) {
                  setValue("latitude", value);
                }

                if (onLocationSelect) {
                  onLocationSelect(currentLng, value);
                }
              }
            }
          }}
          className="border rounded p-2 w-full"
          step="0.0001"
        />
      </div>
    </div>
  );
};

interface MapControlsProps {
  lng: number;
  lat: number;
  mapStyle: string;
  handleMapStyleChange: (newStyle: string) => void;
  setValue?: any;
  onLocationSelect?: (lng: number, lat: number) => void;
  detectUserLocation: () => void;
  isLocating: boolean;
}

/**
 * Komponen untuk kontrol peta (zoom, style, dll)
 */
export const MapControls: React.FC<MapControlsProps> = ({
  lng,
  lat,
  setValue,
  onLocationSelect,
  detectUserLocation,
  isLocating,
}) => {
  return (
    <div className="map-info p-2 bg-gray-100 mb-2 rounded flex flex-wrap justify-between items-center">
      <div>
        <strong>Koordinat Peta:</strong> Longitude: {lng} | Latitude: {lat}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (setValue) {
              setValue("longitude", lng);
              setValue("latitude", lat);
            }
            if (onLocationSelect) {
              onLocationSelect(lng, lat);
            }
            closeModal("showMapUMKMLocation");
          }}
          className="btn btn-sm btn-primary"
          title="Ambil koordinat saat ini"
          type="button"
        >
          Ambil Koordinat
        </button>

        <button
          onClick={detectUserLocation}
          disabled={isLocating}
          className={`btn btn-sm ${
            isLocating ? "btn-disabled" : "btn-success"
          }`}
          title="Gunakan lokasi saya saat ini"
        >
          {isLocating ? "Mencari Lokasi..." : "Lokasi Saya"}
        </button>
      </div>
    </div>
  );
};
