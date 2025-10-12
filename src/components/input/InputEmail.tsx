/** @format */

import React from "react";
import { UseFormRegister } from "react-hook-form";

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

const InputEmail = ({
  label,
  register,
  required,
  name,
  errors,
  readOnly,
  placeholder,
  autoComplete = "on",
  addClass,
  labelClass,
  value,
}: Props) => {
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

      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full text-gray-600"
        readOnly={readOnly}
        autoComplete={autoComplete}
        {...register(name as any)}
        defaultValue={value}
      />

      {/* Error messages */}
      {errors?.type === "required" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh kosong
        </p>
      )}
      {errors?.type === "email" && (
        <p className="text-red-600 italic text-sm">
          {errors.message || "Format email tidak valid"}
        </p>
      )}
      {errors?.type === "min" && (
        <p className="text-red-600 italic text-sm">
          {errors.message}
        </p>
      )}
      {errors?.type === "matches" && (
        <p className="text-red-600 italic text-sm">
          {errors.message || "Format email tidak valid"}
        </p>
      )}
    </label>
  );
};

export default InputEmail;
