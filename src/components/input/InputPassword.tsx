/** @format */

import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { BsEyeSlash, BsEye } from "react-icons/bs";

type Props = {
  label?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  name: string;
  errors?: any;
  readOnly?: boolean;
  placeholder?: string;
  autoComplete?: string;
  addClass?: string;
  labelClass?: string;
  value?: string | number;
};

const InputPassword = ({
  label,
  register,
  required,
  name,
  errors,
  readOnly,
  placeholder,
  autoComplete = "current-password",
  addClass,
  labelClass,
  value,
}: Props) => {
  const [isTypePassword, setIsTypePassword] = useState(true);
  const tooglePassword = () => {
    setIsTypePassword(!isTypePassword);
  };

  return (
    <label className={`relative ${addClass}`}>
      <div className="flex">
        {label && (
          <div className={`label ${labelClass}`}>
            <span className={`label-text ${labelClass}`}>{label}</span>
          </div>
        )}
        {required && label && (
          <span className="ml-1 text-red-600 self-center">*</span>
        )}
        {!required && label && (
          <span className="label-text ml-1 self-center">(Optional)</span>
        )}
      </div>

      <div className="relative">
        <input
          type={isTypePassword ? "password" : "text"}
          placeholder={placeholder}
          className="input input-bordered w-full text-gray-600 pr-10"
          readOnly={readOnly}
          autoComplete={autoComplete}
          {...register(name as any)}
          defaultValue={value}
        />

        <div
          className="absolute right-2 h-fit top-1/2 -translate-y-1/2 cursor-pointer text-accent flex items-center"
          onClick={tooglePassword}
        >
          <div className="">
            {isTypePassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
          </div>
        </div>
      </div>

      {/* Error messages */}
      {errors?.type === "required" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh kosong
        </p>
      )}
      {errors?.type === "min" && (
        <p className="text-red-600 italic text-sm">
          {errors.message}
        </p>
      )}
    </label>
  );
};

export default InputPassword;
