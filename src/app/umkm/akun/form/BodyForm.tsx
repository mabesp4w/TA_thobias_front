/** @format */

import InputText from "@/components/input/InputText";
import { UserType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  register: any;
  errors: FieldErrors<UserType>;
  dtEdit: UserType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label="Username"
        name="username"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.username}
      />
      <InputText
        label="Email"
        name="email"
        register={register}
        addClass="col-span-8"
        required
        type="email"
        errors={errors.email}
      />

      <div className="divider col-span-8">Ubah Password (Opsional)</div>
      <InputText
        label="Password Baru"
        name="password"
        register={register}
        addClass="col-span-8"
        type="password"
        errors={errors.password}
      />
      <span className="text-red-600 italic text-sm col-span-8">
        {errors.password?.message}
      </span>
      <InputText
        label="Konfirmasi Password"
        name="password_confirmation"
        register={register}
        addClass="col-span-8"
        type="password"
        errors={errors.password_confirmation}
      />
    </>
  );
};

export default BodyForm;
