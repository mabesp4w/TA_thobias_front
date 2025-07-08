/** @format */

import InputText from "@/components/input/InputText";
import InputTextarea from "@/components/input/InputTextarea";
import SelectFromDb from "@/components/select/SelectFromDB";
import { LokasiPenjualanType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { showModal } from "@/utils/modalHelper";

import { MapPinIcon } from "lucide-react";
import useKategoriLokasiPenjualanApi from "@/stores/api/KategoriLokasiPenjualan";
import useKecamatanApi from "@/stores/api/Kecamatan";

type Props = {
  register: any;
  errors: FieldErrors<LokasiPenjualanType>;
  dtEdit: LokasiPenjualanType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors, control, watch }) => {
  const { setKecamatan, dtKecamatan } = useKecamatanApi();
  const { setKategoriLokasiPenjualan, dtKategoriLokasiPenjualan } =
    useKategoriLokasiPenjualanApi();
  const [isLoading, setIsLoading] = useState(false);

  // Watch coordinates
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  // Fetch data kecamatan dan kategori
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await setKecamatan();
      await setKategoriLokasiPenjualan();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleShowMap = () => {
    showModal("modal_select_map_location");
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
        placeholder="Contoh: Pasar Sentral Hamadi"
      />

      {!isLoading && dtKategoriLokasiPenjualan?.length > 0 && (
        <SelectFromDb
          name="kategori_lokasi"
          addClass="col-span-8"
          control={control}
          required
          errors={errors.kategori_lokasi}
          body={["id", "nm_kategori_lokasi"]}
          dataDb={dtKategoriLokasiPenjualan}
          label="Kategori Lokasi"
          menuPosition="absolute"
          placeholder="Pilih Kategori Lokasi"
        />
      )}

      <InputTextarea
        label="Alamat"
        name="alamat"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.alamat}
        placeholder="Masukkan alamat lengkap lokasi penjualan"
      />

      {!isLoading && dtKecamatan?.length > 0 && (
        <SelectFromDb
          name="kecamatan"
          addClass="col-span-8"
          control={control}
          required
          errors={errors.kecamatan}
          body={["id", "nm_kecamatan"]}
          dataDb={dtKecamatan}
          label="Kecamatan"
          menuPosition="absolute"
          placeholder="Pilih Kecamatan"
        />
      )}

      <InputText
        label="Nomor Telepon"
        name="tlp_pengelola"
        register={register}
        addClass="col-span-4"
        errors={errors.tlp_pengelola}
        placeholder="Contoh: 08123456789"
      />

      <div className="col-span-8">
        <label className="label">
          <span className="label-text">Koordinat Lokasi</span>
        </label>
        <div className="flex gap-2">
          <InputText
            name="latitude"
            register={register}
            type="number"
            step="any"
            placeholder="Latitude"
            addClass="flex-1"
            readOnly
          />
          <InputText
            name="longitude"
            register={register}
            type="number"
            step="any"
            placeholder="Longitude"
            addClass="flex-1"
            readOnly
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleShowMap}
          >
            <MapPinIcon className="h-4 w-4" />
            Pilih di Peta
          </button>
        </div>
        {latitude && longitude && (
          <label className="label">
            <span className="label-text-alt text-success">
              Koordinat telah dipilih: {latitude}, {longitude}
            </span>
          </label>
        )}
      </div>

      <div className="col-span-8">
        <label className="label">
          <span className="label-text">Status</span>
        </label>
        <input
          type="checkbox"
          {...register("aktif")}
          className="toggle toggle-primary"
        />
        <span className="ml-2">Aktif</span>
      </div>
    </>
  );
};

export default BodyForm;
