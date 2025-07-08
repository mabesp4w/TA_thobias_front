/** @format */

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { token_mapbox } from "@/services/baseURL";
import { KategoriLokasiPenjualanType, LokasiPenjualanType } from "@/types";
import SelectFromDb from "../select/SelectFromDB";

export interface MapProps {
  initialLng?: number;
  initialLat?: number;
  initialZoom?: number;
  width?: string;
  height?: string;
  lokasiPenjualan?: LokasiPenjualanType[];
  handleLocationSelect?: (lng: number, lat: number) => void;
  addMarker?: boolean;
  dtKategoriLokasiPenjualan?: KategoriLokasiPenjualanType[];
  control?: any;
  isLoadingLocations?: boolean;
  onClearFilter?: () => void;
}

mapboxgl.accessToken = token_mapbox;

const MAP_STYLES = [
  { id: "streets-v12", name: "Streets" },
  { id: "outdoors-v12", name: "Outdoors" },
  { id: "light-v11", name: "Light" },
  { id: "dark-v11", name: "Dark" },
  { id: "satellite-v9", name: "Satellite" },
  { id: "satellite-streets-v12", name: "Satellite Streets" },
];

const SaleLocation: React.FC<MapProps> = ({
  initialLng = 140.6697,
  initialLat = -2.5919,
  initialZoom = 10,
  width = "100%",
  height = "500px",
  lokasiPenjualan = [],
  handleLocationSelect,
  addMarker = false,
  dtKategoriLokasiPenjualan = [],
  control,
  isLoadingLocations = false,
  onClearFilter,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const dragMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("streets-v12");
  const [dragMarkerCoords, setDragMarkerCoords] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [hasZoomedToUserLocation, setHasZoomedToUserLocation] = useState(false);

  // Convert lokasi penjualan to GeoJSON format
  const convertToGeoJSON = useCallback((locations: LokasiPenjualanType[]) => {
    const hasValidCoordinates = (
      lokasi: LokasiPenjualanType
    ): lokasi is LokasiPenjualanType & {
      latitude: number;
      longitude: number;
    } => {
      return (
        lokasi.latitude !== undefined &&
        lokasi.longitude !== undefined &&
        lokasi.latitude >= -90 &&
        lokasi.latitude <= 90 &&
        lokasi.longitude >= -180 &&
        lokasi.longitude <= 180
      );
    };

    const features = locations.filter(hasValidCoordinates).map((lokasi) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [lokasi.longitude, lokasi.latitude],
      },
      properties: {
        id: lokasi.id,
        nm_lokasi: lokasi.nm_lokasi,
        kategori:
          lokasi.kategori_lokasi_detail?.nm_kategori_lokasi ||
          lokasi.kategori_lokasi_nama ||
          "Tanpa Kategori",
        alamat: lokasi.alamat,
        umkm_nama: lokasi.umkm_nama || "",
        tlp_pengelola: lokasi.tlp_pengelola || "",
      },
    }));

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, []);

  // Create popup content
  const createPopupContent = (properties: any) => {
    return `
      <div style="padding: 10px; max-width: 250px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${
          properties.nm_lokasi
        }</h3>
        <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Kategori:</strong> ${
          properties.kategori
        }</p>
        <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Alamat:</strong> ${
          properties.alamat
        }</p>
        ${
          properties.umkm_nama
            ? `<p style="margin: 0 0 4px 0; font-size: 12px;"><strong>UMKM:</strong> ${properties.umkm_nama}</p>`
            : ""
        }
        ${
          properties.tlp_pengelola
            ? `<p style="margin: 0; font-size: 12px;"><strong>Telepon:</strong> ${properties.tlp_pengelola}</p>`
            : ""
        }
      </div>
    `;
  };

  // Create drag marker
  const createDragMarker = useCallback(() => {
    if (!map.current || !mapLoaded || !addMarker) return;

    if (dragMarkerRef.current) {
      dragMarkerRef.current.remove();
    }

    const dragMarker = new mapboxgl.Marker({
      draggable: true,
      color: "#3498db",
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current!);

    const toFourDecimalPlaces = (num: number): number => {
      return parseFloat(num.toFixed(4));
    };

    dragMarker.on("drag", () => {
      const lngLat = dragMarker.getLngLat();
      setDragMarkerCoords({
        lng: toFourDecimalPlaces(lngLat.lng),
        lat: toFourDecimalPlaces(lngLat.lat),
      });
    });

    const onDragEnd = () => {
      const lngLat = dragMarker.getLngLat();
      handleLocationSelect?.(lngLat.lng, lngLat.lat);
      setDragMarkerCoords({
        lng: toFourDecimalPlaces(lngLat.lng),
        lat: toFourDecimalPlaces(lngLat.lat),
      });
    };

    dragMarker.on("dragend", onDragEnd);

    const dragPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="padding: 10px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #3498db;">📍 Drag Marker</h3>
        <p style="margin: 0; font-size: 12px;">Drag me to any location!</p>
      </div>
    `);

    dragMarker.setPopup(dragPopup);
    dragMarkerRef.current = dragMarker;

    setDragMarkerCoords({
      lng: toFourDecimalPlaces(initialLng),
      lat: toFourDecimalPlaces(initialLat),
    });

    // Zoom to marker location when created
    map.current.flyTo({
      center: [initialLng, initialLat],
      zoom: 15,
      essential: true,
    });
  }, [mapLoaded, addMarker, initialLng, initialLat, handleLocationSelect]);

  // Setup clustering layers
  const setupClusteringLayers = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    const geoJSON = convertToGeoJSON(lokasiPenjualan);

    // Remove existing layers and source
    const layersToRemove = ["clusters", "cluster-count", "unclustered-point"];
    layersToRemove.forEach((layerId) => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    });

    if (map.current?.getSource("sale-locations")) {
      map.current.removeSource("sale-locations");
    }

    // Only add source and layers if there are features
    if (geoJSON.features.length === 0) {
      console.log("No locations to display");
      return;
    }

    // Add source with clustering enabled
    map.current?.addSource("sale-locations", {
      type: "geojson",
      data: geoJSON as any,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Add cluster layer
    map.current?.addLayer({
      id: "clusters",
      type: "circle",
      source: "sale-locations",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          10,
          "#f1f075",
          30,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Add cluster count layer
    map.current?.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "sale-locations",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    // Add unclustered point layer
    map.current?.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "sale-locations",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#e74c3c",
        "circle-radius": 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Inspect cluster on click
    map.current?.on("click", "clusters", (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0]?.properties?.cluster_id;
      const source = map.current!.getSource(
        "sale-locations"
      ) as mapboxgl.GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.current!.easeTo({
          center: (features[0].geometry as any).coordinates,
          zoom: zoom || 12,
        });
      });
    });

    // Show popup on unclustered point click
    map.current?.on("click", "unclustered-point", (e) => {
      const coordinates = (e.features![0].geometry as any).coordinates.slice();
      const properties = e.features![0].properties;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(createPopupContent(properties))
        .addTo(map.current!);
    });

    // Change cursor on hover
    ["clusters", "unclustered-point"].forEach((layer) => {
      map.current?.on("mouseenter", layer, () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      map.current?.on("mouseleave", layer, () => {
        map.current!.getCanvas().style.cursor = "";
      });
    });

    // Fit bounds to data only if addMarker is false
    if (geoJSON.features.length > 0 && !addMarker) {
      const bounds = new mapboxgl.LngLatBounds();
      geoJSON.features.forEach((feature) => {
        bounds.extend(feature.geometry.coordinates as [number, number]);
      });
      map.current?.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
      });
    }
  }, [
    mapLoaded,
    lokasiPenjualan,
    convertToGeoJSON,
    addMarker,
    createPopupContent,
  ]);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${selectedStyle}`,
        center: [initialLng, initialLat],
        zoom: initialZoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add geocoder control
      geocoderRef.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken as string,
        mapboxgl: mapboxgl as any,
        placeholder: "Cari lokasi...",
        language: "id",
      });

      map.current.addControl(geocoderRef.current, "top-left");

      // Handle geocoder result
      geocoderRef.current.on("result", (e) => {
        const { lng, lat } = e.result.center;

        if (dragMarkerRef.current && addMarker) {
          dragMarkerRef.current.setLngLat([lng, lat]);
          setDragMarkerCoords({
            lng: parseFloat(lng.toFixed(4)),
            lat: parseFloat(lat.toFixed(4)),
          });
          handleLocationSelect?.(lng, lat);
        }
      });

      map.current.on("load", () => {
        setMapLoaded(true);
      });

      // Clean up event listeners properly
      const styleDataHandler = () => {
        if (map.current?.isStyleLoaded()) {
          setMapLoaded(true);
        }
      };

      map.current.on("styledata", styleDataHandler);

      return () => {
        map.current?.off("styledata", styleDataHandler);
      };
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle style changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(`mapbox://styles/mapbox/${selectedStyle}`);

      const styleLoadHandler = () => {
        setTimeout(() => {
          setupClusteringLayers();
          if (addMarker) {
            createDragMarker();
          }
        }, 100);
      };

      map.current.once("style.load", styleLoadHandler);

      return () => {
        map.current?.off("style.load", styleLoadHandler);
      };
    }
  }, [
    selectedStyle,
    mapLoaded,
    setupClusteringLayers,
    addMarker,
    createDragMarker,
  ]);

  // Setup clustering when map is loaded and data changes
  useEffect(() => {
    if (mapLoaded && !isLoadingLocations) {
      const timer = setTimeout(() => {
        setupClusteringLayers();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [mapLoaded, lokasiPenjualan, isLoadingLocations, setupClusteringLayers]);

  // Create drag marker when map is loaded and addMarker is true
  useEffect(() => {
    if (mapLoaded && addMarker) {
      const timer = setTimeout(() => {
        createDragMarker();
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [mapLoaded, addMarker, createDragMarker]);

  // Auto-detect location
  useEffect(() => {
    if (mapLoaded && !hasZoomedToUserLocation && !addMarker) {
      const timer = setTimeout(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("📍 User location detected:", {
                lng: longitude,
                lat: latitude,
              });

              if (map.current) {
                map.current.flyTo({
                  center: [longitude, latitude],
                  zoom: 15,
                  essential: true,
                });
              }
              setHasZoomedToUserLocation(true);
            },
            (error) => {
              console.warn("Could not get user location:", error);
              setHasZoomedToUserLocation(true);
            },
            {
              timeout: 5000,
              enableHighAccuracy: false,
            }
          );
        } else {
          setHasZoomedToUserLocation(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mapLoaded, hasZoomedToUserLocation, addMarker]);

  const goMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 Current location:", {
            lng: longitude,
            lat: latitude,
          });

          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true,
            });

            if (dragMarkerRef.current && addMarker) {
              dragMarkerRef.current.setLngLat([longitude, latitude]);
              setDragMarkerCoords({
                lng: parseFloat(longitude.toFixed(4)),
                lat: parseFloat(latitude.toFixed(4)),
              });
              handleLocationSelect?.(longitude, latitude);
            }
          }
        },
        (error) => {
          console.error("❌ Error getting location:", error);
          alert(
            "Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan."
          );
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser ini.");
    }
  };

  const toggleDragMarker = () => {
    if (!addMarker) return;

    if (dragMarkerRef.current) {
      dragMarkerRef.current.remove();
      dragMarkerRef.current = null;
      setDragMarkerCoords(null);
    } else {
      createDragMarker();
    }
  };

  const moveDragMarkerToLocation = (lng: number, lat: number) => {
    if (dragMarkerRef.current && addMarker) {
      dragMarkerRef.current.setLngLat([lng, lat]);
      setDragMarkerCoords({
        lng: parseFloat(lng.toFixed(4)),
        lat: parseFloat(lat.toFixed(4)),
      });
      handleLocationSelect?.(lng, lat);
    }
  };

  // Count valid locations
  const validLocationCount = lokasiPenjualan.filter(
    (l) =>
      l.latitude &&
      l.longitude &&
      l.latitude >= -90 &&
      l.latitude <= 90 &&
      l.longitude >= -180 &&
      l.longitude <= 180
  ).length;

  return (
    <div>
      {/* Status markers */}
      {isLoadingLocations ? (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
          <span className="text-blue-700">⏳ Memuat lokasi penjualan...</span>
        </div>
      ) : validLocationCount > 0 ? (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
          <span className="text-green-700">
            ✅ {validLocationCount} lokasi penjualan dimuat
          </span>
        </div>
      ) : (
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <span className="text-yellow-700">
            ⚠️ Tidak ada lokasi penjualan yang dapat ditampilkan
          </span>
        </div>
      )}

      {/* Koordinat drag marker - only show if addMarker is true */}
      {addMarker && dragMarkerCoords && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
          <span className="text-blue-700 font-medium">
            📍 Drag Marker: Longitude: {dragMarkerCoords.lng} | Latitude:{" "}
            {dragMarkerCoords.lat}
          </span>
        </div>
      )}

      <div className="flex gap-2 w-full">
        {/* Style selector */}
        <div className="mb-2 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Style Map:
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {MAP_STYLES.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
        </div>
        {/* Filter kategori lokasi */}
        {dtKategoriLokasiPenjualan.length > 0 && (
          <div className="mb-2 w-full z-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Kategori Lokasi:
            </label>
            <div className="flex gap-2">
              <SelectFromDb
                dataDb={dtKategoriLokasiPenjualan}
                body={["id", "nm_kategori_lokasi"]}
                control={control}
                name="kategori_lokasi"
                addClass="w-full"
                menuPosition="absolute"
                placeholder="Pilih Kategori Lokasi"
              />
              {onClearFilter && (
                <button
                  onClick={onClearFilter}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 shrink-0"
                  title="Clear filter"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <div
          ref={mapContainer}
          style={{ width, height }}
          className="rounded shadow border"
        />

        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded">
            <div className="text-gray-600 font-medium">Loading map...</div>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={setupClusteringLayers}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🔄 Reload Markers
        </button>

        <button
          onClick={goMyLocation}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🎯 Go to MyLocation
        </button>

        {/* Button drag marker - only show if addMarker is true */}
        {addMarker && (
          <>
            <button
              onClick={toggleDragMarker}
              className={`px-4 py-2 text-white rounded ${
                dragMarkerRef.current
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {dragMarkerRef.current
                ? "🗑️ Remove Drag Marker"
                : "📍 Add Drag Marker"}
            </button>

            <button
              onClick={() => moveDragMarkerToLocation(initialLng, initialLat)}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              disabled={!dragMarkerRef.current}
            >
              🏠 Reset Drag Marker
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SaleLocation;
