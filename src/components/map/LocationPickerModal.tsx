/** @format */

"use client";
import { useEffect, useState } from "react";
import MapboxMap from "./MapboxMap";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation || null);

  // Reset selectedLocation ketika modal dibuka dengan lokasi awal baru
  useEffect(() => {
    if (isOpen && initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [isOpen, initialLocation]);

  const handleMapClick = (lat: number, lng: number) => {
    console.log("Map click handler called with:", lat, lng);
    setSelectedLocation({ lat, lng });
  };

  const handleDragEnd = (lat: number, lng: number) => {
    console.log("Drag end handler called with:", lat, lng);
    setSelectedLocation({ lat, lng });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng);
      onClose();
    }
  };

  // Pastikan bahwa modal hanya ditampilkan ketika isOpen true
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg">Pilih Lokasi</h3>

        <div className="space-y-4 mt-4">
          <div className="bg-base-200 p-4 rounded-lg">
            <p className="text-sm">
              Klik pada peta untuk memilih lokasi atau tarik marker (pin) merah
              muda untuk menyesuaikan posisi dengan tepat.
            </p>
          </div>

          <div className="h-[500px] w-full">
            <MapboxMap
              center={
                initialLocation
                  ? [initialLocation.lng, initialLocation.lat]
                  : undefined
              }
              onMapClick={handleMapClick}
              onDragEnd={handleDragEnd}
              initialMarkerPosition={initialLocation}
            />
          </div>

          {selectedLocation && (
            <div className="bg-base-200 p-4 rounded-lg">
              <p className="text-sm">
                Lokasi terpilih: {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={!selectedLocation}
            >
              Pilih Lokasi
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default LocationPickerModal;
