/** @format */

import InputText from "@/components/input/InputText";
import { AdministratorType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";
// administrator
type Props = {
  register: any;
  errors: FieldErrors<AdministratorType>;
  dtEdit: AdministratorType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label={`Nama Administrator`}
        name="first_name"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.first_name}
      />

      <InputText
        label={`Username`}
        name="username"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.username}
      />
      <InputText
        label={`Email`}
        name="email"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.email}
      />
      <InputText
        label={`Password`}
        name="password"
        register={register}
        addClass="col-span-8"
        required
        type="password"
        errors={errors.password}
      />
      <InputText
        label={`Konfirmasi Password`}
        name="password_confirmation"
        register={register}
        addClass="col-span-8"
        required
        type="password"
        errors={errors.password_confirmation}
      />
    </>
  );
};

export default BodyForm;
