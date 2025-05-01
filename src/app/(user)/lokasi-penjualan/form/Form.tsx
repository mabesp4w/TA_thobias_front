/** @format */

"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import { LokasiPenjualanType } from "@/types";

type Props = {
  dtEdit: LokasiPenjualanType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  const { addData, updateData } = useLokasiPenjualan();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<LokasiPenjualanType>();

  const resetForm = () => {
    setValue("id", "");
    setValue("nm_lokasi", "");
    setValue("tipe_lokasi", "");
    setValue("alamat", "");
    setValue("latitude", undefined);
    setValue("longitude", undefined);
    setValue("kecamatan", "");
    setValue("tlp_pengelola", "");
  };

  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("nm_lokasi", dtEdit.nm_lokasi);
      setValue("tipe_lokasi", dtEdit.tipe_lokasi);
      setValue("alamat", dtEdit.alamat);
      setValue("latitude", dtEdit.latitude);
      setValue("longitude", dtEdit.longitude);
      setValue("kecamatan", dtEdit.kecamatan || "");
      setValue("tlp_pengelola", dtEdit.tlp_pengelola || "");
    } else {
      resetForm();
    }
  }, [dtEdit]);

  const onSubmit: SubmitHandler<LokasiPenjualanType> = async (row) => {
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
    <ModalDef id="add_lokasi_penjualan" title={`Form ${halaman}`} size="lg">
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
