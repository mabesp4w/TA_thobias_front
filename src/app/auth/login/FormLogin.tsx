/** @format */
"use client";
import InputEmail from "@/components/input/InputEmail";
import InputPassword from "@/components/input/InputPassword";
import { FC } from "react";

type Props = {
  register: any;
  errors: any;
  control: any;
  watch: any;
  setValue: any;
};

const FormLogin: FC<Props> = ({ register, errors }) => {
  return (
    <div className="flex flex-col gap-y-2">
      <InputEmail
        label="Email"
        name="username"
        register={register}
        required
        errors={errors.username}
        addClass="col-span-4"
        labelClass="text-black"
        placeholder="Masukan Email"
      />
      <InputPassword
        label="Password"
        name="password"
        register={register}
        required
        errors={errors.password}
        labelClass="text-black"
        placeholder="Masukan Password"
      />
    </div>
  );
};

export default FormLogin;
