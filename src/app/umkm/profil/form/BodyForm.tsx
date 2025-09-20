/** @format */

import InputText from "@/components/input/InputText";
import InputTextarea from "@/components/input/InputTextarea";
import { ProfilUMKMType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  register: any;
  errors: FieldErrors<ProfilUMKMType>;
  dtEdit: ProfilUMKMType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label="Nama Bisnis"
        name="nm_bisnis"
        register={register}
        required
        errors={errors.nm_bisnis}
        addClass="col-span-2"
      />
      <InputText
        label="Jumlah Laki-laki"
        name="total_laki"
        register={register}
        required
        type="number"
        errors={errors.total_laki}
        addClass="col-span-1"
      />
      <InputText
        label="Jumlah Perempuan"
        name="total_perempuan"
        register={register}
        required
        type="number"
        errors={errors.total_perempuan}
        addClass="col-span-1"
      />
      <InputText
        label="Nomor Telepon"
        name="tlp"
        register={register}
        required
        errors={errors.tlp}
        addClass="col-span-2"
      />
      <InputTextarea
        label="Alamat"
        name="alamat"
        register={register}
        required
        errors={errors.alamat}
        addClass="col-span-2"
      />
      <InputTextarea
        label="Deskripsi Bisnis"
        name="desc_bisnis"
        register={register}
        errors={errors.desc_bisnis}
        addClass="col-span-2"
      />
      {/* fb_link */}
      <InputText
        label="Link Facebook"
        name="fb_link"
        register={register}
        errors={errors.fb_link}
        addClass="col-span-2"
      />
      {/* ig_link */}
      <InputText
        label="Link Instagram"
        name="ig_link"
        register={register}
        errors={errors.ig_link}
        addClass="col-span-2"
      />
      {/* tiktok_link */}
      <InputText
        label="Link Tiktok"
        name="tiktok_link"
        register={register}
        errors={errors.tiktok_link}
        addClass="col-span-2"
      />
    </>
  );
};

export default BodyForm;
