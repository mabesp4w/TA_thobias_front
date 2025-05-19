/** @format */
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import useUser from "@/stores/crud/User";
import { UserType } from "@/types";
import { validationSchema } from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  dtEdit: UserType | null;
  halaman: string;
};
// user
const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = useUser();
  // state
  const [isLoading, setIsLoading] = useState(false);
  // hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<UserType>({
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
  // simpan data
  const onSubmit: SubmitHandler<UserType> = async (row) => {
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
    <ModalDef id="add_user" title={`Form ${halaman}`}>
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
