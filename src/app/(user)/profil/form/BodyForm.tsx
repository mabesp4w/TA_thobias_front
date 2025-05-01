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
      />
      <InputText
        label="Nomor Telepon"
        name="tlp"
        register={register}
        required
        errors={errors.tlp}
      />
      <InputTextarea
        label="Alamat"
        name="alamat"
        register={register}
        required
        errors={errors.alamat}
      />
      <InputTextarea
        label="Deskripsi Bisnis"
        name="desc_bisnis"
        register={register}
        errors={errors.desc_bisnis}
      />
    </>
  );
};

export default BodyForm;
