/** @format */

import InputText from "@/components/input/InputText";
import InputTextarea from "@/components/input/InputTextarea";

import { ProdukType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import useKategoriApi from "@/stores/api/KategoriProduk";
import SelectFromDb from "@/components/select/SelectFromDB";

type Props = {
  register: any;
  errors: FieldErrors<ProdukType>;
  dtEdit: ProdukType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors, control }) => {
  const { setKategori, dtKategori } = useKategoriApi();
  const [IsLoading, setIsLoading] = useState(false);
  // effect provinsi
  useEffect(() => {
    setIsLoading(true);
    setKategori();
    setIsLoading(false);
  }, [setKategori]);

  return (
    <>
      <InputText
        label="Nama Produk"
        name="nm_produk"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_produk}
      />

      {!IsLoading && dtKategori?.length > 0 && (
        <SelectFromDb
          name="kategori"
          addClass={"col-span-8"}
          control={control}
          required
          errors={errors.kategori}
          body={["id", "nm_kategori"]}
          dataDb={dtKategori}
          label={`Kategori`}
          menuPosition="absolute"
          placeholder="Pilih Kategori"
        />
      )}

      <InputText
        label="Harga"
        name="harga"
        register={register}
        addClass="col-span-4"
        required
        errors={errors.harga}
        type="currency"
      />

      <InputText
        label="Stok"
        name="stok"
        register={register}
        addClass="col-span-4"
        required
        type="number"
        errors={errors.stok}
      />

      <InputText
        label="Satuan"
        name="satuan"
        register={register}
        addClass="col-span-4"
        required
        errors={errors.satuan}
        placeholder="pcs, kg, liter, dll"
      />

      <InputTextarea
        label="Deskripsi"
        name="desc"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.desc}
      />

      <InputTextarea
        label="Bahan Baku"
        name="bahan_baku"
        register={register}
        addClass="col-span-8"
        errors={errors.bahan_baku}
      />

      <InputTextarea
        label="Metode Produksi"
        name="metode_produksi"
        register={register}
        addClass="col-span-8"
        errors={errors.metode_produksi}
      />

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
