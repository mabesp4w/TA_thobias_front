/** @format */

import InputText from "@/components/input/InputText";
import { ProdukTerjualType } from "@/types";
import { FC, useEffect } from "react";
import { FieldErrors } from "react-hook-form";
import useProduk from "@/stores/crud/Produk";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import SelectFromDb from "@/components/select/SelectFromDB";
import InputTextarea from "@/components/input/InputTextarea";

type Props = {
  register: any;
  errors: FieldErrors<ProdukTerjualType>;
  dtEdit: ProdukTerjualType | null;
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
  dtEdit,
}) => {
  const { setProduk, dtProduk } = useProduk();
  const { setLokasiPenjualan, dtLokasiPenjualan } = useLokasiPenjualan();

  useEffect(() => {
    // Fetch produk dan lokasi penjualan
    setProduk({ page: 1, limit: 100 });
    setLokasiPenjualan({ page: 1, limit: 100 });
  }, []);

  const optionsProduk = dtProduk?.data?.map((item: any) => ({
    value: item.id,
    label: `${item.nm_produk} - Rp ${item.harga}`,
  }));

  const optionsLokasiPenjualan = dtLokasiPenjualan?.data?.map((item: any) => ({
    value: item.id,
    label: `${item.nm_lokasi} (${item.tipe_lokasi})`,
  }));

  // Auto-fill harga jual ketika produk dipilih
  const selectedProdukId = watch("produk_id");
  useEffect(() => {
    if (selectedProdukId && !dtEdit) {
      const selectedProduk = dtProduk?.data?.find(
        (item: any) => item.id === selectedProdukId
      );
      if (selectedProduk) {
        setValue("harga_jual", selectedProduk.harga);
      }
    }
  }, [selectedProdukId, dtProduk, setValue, dtEdit]);

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

      <SelectFromDb
        label="Produk"
        name="produk_id"
        control={control}
        options={optionsProduk}
        addClass="col-span-4"
        required
        errors={errors.produk_id}
      />

      <SelectFromDb
        label="Lokasi Penjualan"
        name="lokasi_penjualan_id"
        control={control}
        options={optionsLokasiPenjualan}
        addClass="col-span-8"
        required
        errors={errors.lokasi_penjualan_id}
      />

      <InputText
        label="Jumlah Terjual"
        name="jumlah_terjual"
        register={register}
        addClass="col-span-4"
        required
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
        required={true}
        minLength={10}
        maxLength={500}
        placeholder="Masukkan deskripsi..."
        rows={6}
      />
    </>
  );
};

export default BodyForm;
