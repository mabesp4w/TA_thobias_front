/** @format */

import InputText from "@/components/input/InputText";
import { ProvinsiType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";
// provinsi
type Props = {
  register: any;
  errors: FieldErrors<ProvinsiType>;
  dtEdit: ProvinsiType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label={`Nama Provinsi`}
        name="nm_provinsi"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_provinsi}
      />
    </>
  );
};

export default BodyForm;
