/** @format */

import InputText from "@/components/input/InputText";
import InputTextarea from "@/components/input/InputTextarea";
import { LokasiPenjualanType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import useKecamatanApi from "@/stores/api/Kecamatan";
import LocationPickerModal from "@/components/map/LocationPickerModal";
import { BiMapPin } from "react-icons/bi";
import SelectFromDb from "@/components/select/SelectFromDB";
import SelectDef from "@/components/select/SelectDef";
import MapboxMap from "@/components/map/MapboxMap";

type Props = {
  register: any;
  errors: FieldErrors<LokasiPenjualanType>;
  dtEdit: LokasiPenjualanType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({
  register,
  errors,
  control,
  watch,
  setValue,
}) => {
  const { dtKecamatan, setKecamatan } = useKecamatanApi();
  const [IsLoading, setIsLoading] = useState(false);
  // effect provinsi
  useEffect(() => {
    setIsLoading(true);
    setKecamatan();
    setIsLoading(false);
  }, [setKecamatan]);

  const [showMapPicker, setShowMapPicker] = useState(false);

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const optionsTipeLokasi = [
    { value: "kios", label: "Kios/Toko" },
    { value: "pasar", label: "Pasar Tradisional" },
    { value: "supermarket", label: "Supermarket" },
    { value: "online", label: "Marketplace Online" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const handleLocationSelect = (lat: number, lng: number) => {
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  return (
    <>
      <InputText
        label="Nama Lokasi"
        name="nm_lokasi"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_lokasi}
      />

      <SelectDef
        label="Tipe Lokasi"
        name="tipe_lokasi"
        control={control}
        options={optionsTipeLokasi}
        addClass="col-span-4"
        required
        errors={errors.tipe_lokasi}
        menuPosition="absolute"
      />

      <InputText
        label="Telepon Pengelola"
        name="tlp_pengelola"
        register={register}
        addClass="col-span-4"
        errors={errors.tlp_pengelola}
      />

      <InputTextarea
        label="Alamat"
        name="alamat"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.alamat}
      />

      {!IsLoading && dtKecamatan?.length > 0 && (
        <SelectFromDb
          name="kecamatan"
          addClass={"col-span-8"}
          control={control}
          required
          errors={errors.kecamatan}
          body={["id", "nm_kecamatan"]}
          dataDb={dtKecamatan}
          label={`Kecamatan`}
          menuPosition="absolute"
          placeholder="Pilih Kecamatan"
        />
      )}

      <div className="col-span-8">
        <label className="label">
          <span className="label-text">Koordinat Lokasi</span>
        </label>
        <div className="flex gap-2">
          <InputText
            label="Latitude"
            name="latitude"
            register={register}
            addClass="w-1/2"
            type="number"
            errors={errors.latitude}
            readOnly
          />

          <InputText
            label="Longitude"
            name="longitude"
            register={register}
            addClass="w-1/2"
            type="number"
            errors={errors.longitude}
            readOnly
          />

          <button
            type="button"
            className="btn btn-primary mt-7"
            onClick={() => setShowMapPicker(true)}
          >
            <BiMapPin className="h-5 w-5 mr-2" />
            Pilih di Peta
          </button>
        </div>
      </div>

      {/* Map Preview */}
      {latitude && longitude && (
        <div className="col-span-8">
          <label className="label">
            <span className="label-text">Preview Lokasi</span>
          </label>
          <div className="h-[200px] w-full">
            <MapboxMap
              center={[longitude, latitude]}
              zoom={15}
              markers={[
                {
                  id: "preview",
                  latitude,
                  longitude,
                  title: watch("nm_lokasi") || "Lokasi",
                },
              ]}
            />
          </div>
        </div>
      )}

      <LocationPickerModal
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={
          latitude && longitude ? { lat: latitude, lng: longitude } : undefined
        }
      />
    </>
  );
};

export default BodyForm;
