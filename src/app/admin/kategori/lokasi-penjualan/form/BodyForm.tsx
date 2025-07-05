/** @format */

import InputText from "@/components/input/InputText";
import { KategoriLokasiPenjualanType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";
// kategoriProduk
type Props = {
  register: any;
  errors: FieldErrors<KategoriLokasiPenjualanType>;
  dtEdit: KategoriLokasiPenjualanType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label={`Nama Kategori Lokasi Penjualan`}
        name="nm_kategori_lokasi"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_kategori_lokasi}
      />
      <InputText
        label={`Keterangan`}
        name="desc"
        register={register}
        addClass="col-span-8"
        errors={errors.desc}
      />
    </>
  );
};

export default BodyForm;
