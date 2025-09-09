/** @format */

"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import useProfilUMKM from "@/stores/crud/ProfilUMKM";
import { ProfilUMKMType } from "@/types";

type Props = {
  dtEdit: ProfilUMKMType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  const { updateProfile } = useProfilUMKM();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<ProfilUMKMType>();

  const resetForm = () => {
    setValue("id", "");
    setValue("nm_bisnis", "");
    setValue("alamat", "");
    setValue("tlp", "");
    setValue("desc_bisnis", "");
  };

  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("nm_bisnis", dtEdit.nm_bisnis);
      setValue("alamat", dtEdit.alamat);
      setValue("tlp", dtEdit.tlp);
      setValue("desc_bisnis", dtEdit.desc_bisnis);
    } else {
      resetForm();
    }
  }, [dtEdit]);

  const onSubmit: SubmitHandler<ProfilUMKMType> = async (row) => {
    submitData({
      row,
      dtEdit,
      setIsLoading,
      addData: null,
      updateData: updateProfile,
      resetForm,
      toastShow,
    });
  };

  return (
    <ModalDef id="edit_profil" title={`Form ${halaman}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
