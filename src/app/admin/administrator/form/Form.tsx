/** @format */

"use client";

import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import useAdministrator from "@/stores/crud/Administrator";
import { AdministratorType } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Props = {
  dtEdit: AdministratorType | null;
  halaman: string;
};

// 🔧 ADD: FormData type that matches Yup schema exactly
type FormData = {
  id?: string;
  username: string;
  first_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// Schema validasi untuk form user
export const validationSchema = yup.object({
  username: yup.string().required("Username wajib diisi"),
  first_name: yup.string().required("Nama wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Password wajib diisi"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

// administrator
const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = useAdministrator();

  // state
  const [isLoading, setIsLoading] = useState(false);

  // 🔧 CHANGE: Use FormData instead of AdministratorType
  // hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  // reset form
  const resetForm = () => {
    setValue("id", "");
    setValue("username", "");
    setValue("first_name", "");
    setValue("email", "");
    setValue("password", "");
    setValue("password_confirmation", "");
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("username", dtEdit.username);
      setValue("first_name", dtEdit.first_name);
      setValue("email", dtEdit.email);
      setValue("password", dtEdit.show_password || "");
      setValue("password_confirmation", dtEdit.show_password || "");
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // 🔧 CHANGE: Update onSubmit to use FormData and convert to AdministratorType
  // simpan data
  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    // Convert FormData to AdministratorType
    const row: AdministratorType = {
      ...dtEdit, // Preserve existing fields
      id: formData.id || "",
      username: formData.username,
      first_name: formData.first_name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    //  submit data
    // console.log({ row });
    // return;

    submitData({
      row,
      dtEdit,
      setIsLoading,
      addData,
      updateData,
      resetForm,
      toastShow,
    });
  };

  return (
    <ModalDef id="add_administrator" title={`Form ${halaman}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />
        <div className="grid grid-cols-8 gap-2 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            dtEdit={dtEdit}
            control={control}
            watch={watch}
            setValue={setValue}
          />
        </div>
        <div>
          {" "}
          {isLoading ? (
            <span className="loading loading-dots loading-md" />
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              Simpan
            </button>
          )}
        </div>
      </form>
    </ModalDef>
  );
};

export default Form;
