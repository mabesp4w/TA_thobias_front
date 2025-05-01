/** @format */

"use client";
import { useState } from "react";
import MapboxMap from "./MapboxMap";
import ModalDef from "@/components/modal/ModalDef";

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

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng);
      onClose();
    }
  };

  return (
    <ModalDef id="location_picker" title="Pilih Lokasi">
      <div className="space-y-4">
        <div className="bg-base-200 p-4 rounded-lg">
          <p className="text-sm">
            Klik pada peta untuk memilih lokasi. Anda dapat menggunakan kontrol
            zoom dan drag untuk navigasi.
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
            markers={
              selectedLocation
                ? [
                    {
                      id: "selected",
                      latitude: selectedLocation.lat,
                      longitude: selectedLocation.lng,
                      title: "Lokasi Terpilih",
                    },
                  ]
                : []
            }
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
          <button className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!selectedLocation}
          >
            Pilih Lokasi
          </button>
        </div>
      </div>
    </ModalDef>
  );
};

export default LocationPickerModal;
