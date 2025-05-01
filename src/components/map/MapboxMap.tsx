/** @format */

"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Ganti dengan token Mapbox Anda
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string | number;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    type?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  style?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  center = [106.816666, -6.2], // Default ke Jakarta
  zoom = 11,
  markers = [],
  onMapClick,
  className = "",
  style = "mapbox://styles/mapbox/streets-v11",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: center,
        zoom: zoom,
      });

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "top-right"
      );

      // Map click handler
      if (onMapClick) {
        map.current.on("click", (e) => {
          onMapClick(e.lngLat.lat, e.lngLat.lng);
        });
      }

      map.current.on("load", () => {
        setMapLoaded(true);
      });
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.backgroundImage = `url(/marker-${
        markerData.type || "default"
      }.png)`;
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.backgroundSize = "100%";
      el.style.cursor = "pointer";

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div>
          <h3 class="font-bold">${markerData.title || ""}</h3>
          <p>${markerData.description || ""}</p>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.longitude, markerData.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded]);

  return (
    <div
      ref={mapContainer}
      className={`w-full h-full rounded-lg ${className}`}
      style={{ minHeight: "400px" }}
    />
  );
};

export default MapboxMap;
