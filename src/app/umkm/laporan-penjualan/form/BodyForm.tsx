/** @format */

import InputText from "@/components/input/InputText";
import { ProdukTerjualType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import SelectFromDb from "@/components/select/SelectFromDB";
import InputTextarea from "@/components/input/InputTextarea";
import useProdukUMKM from "@/stores/crud/ProdukUMKM";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";

type Props = {
  register: any;
  errors: FieldErrors<ProdukTerjualType>;
  dtEdit: ProdukTerjualType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors, control, watch }) => {
  // store
  const { setProduk, dtProduk } = useProdukUMKM();
  const { setMyLokasiPenjualan, dtMyLokasiPenjualan } = useLokasiPenjualan();
  // state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setProduk({ page: 1, limit: 100 });
    setMyLokasiPenjualan({
      limit: 100,
    });
    setIsLoading(false);
  }, []);

  return (
    <>
      <InputText
        label="Tanggal Penjualan"
        name="tgl_penjualan"
        register={register}
        addClass="col-span-4"
        type="date"
        required
        errors={errors.tgl_penjualan}
      />

      {!isLoading && dtProduk?.data?.length > 0 && (
        <SelectFromDb
          label="Produk"
          name="produk"
          control={control}
          dataDb={dtProduk?.data}
          body={["id", "nm_produk"]}
          addClass="col-span-4"
          required
          errors={errors.produk}
          menuPosition="absolute"
          placeholder="Pilih Produk"
        />
      )}

      {!isLoading && dtMyLokasiPenjualan?.data?.length > 0 && (
        <SelectFromDb
          label="Lokasi Penjualan"
          name="lokasi_penjualan"
          control={control}
          dataDb={dtMyLokasiPenjualan?.data}
          body={["id", "nm_lokasi"]}
          addClass="col-span-8"
          required
          errors={errors.lokasi_penjualan}
          menuPosition="absolute"
          placeholder="Pilih Lokasi Penjualan"
        />
      )}

      <InputText
        label="Jumlah Terjual"
        name="jumlah_terjual"
        register={register}
        addClass="col-span-4"
        required
        type="number"
        valueAsNumber
        errors={errors.jumlah_terjual}
      />

      <InputText
        label="Harga Jual"
        name="harga_jual"
        addClass="col-span-4"
        required
        errors={errors.harga_jual}
        type="currency"
        register={register}
        minLength={1000} // Minimal Rp 1.000
        maxLength={1000000} // Maksimal Rp 1.000.000
        placeholder="0"
      />

      <div className="col-span-8">
        <p className="text-sm font-medium">
          Total Penjualan: Rp{" "}
          {(watch("jumlah_terjual") || 0) * (watch("harga_jual") || 0)}
        </p>
      </div>

      <InputTextarea
        label="Catatan"
        name="catatan"
        register={register}
        addClass="col-span-8"
        errors={errors.catatan}
        placeholder="Masukkan deskripsi..."
        rows={6}
      />
    </>
  );
};

export default BodyForm;
