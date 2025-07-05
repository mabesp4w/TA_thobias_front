/** @format */
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import useKategoriLokasiPenjualan from "@/stores/crud/KategoriLokasiPenjualan";
import { KategoriLokasiPenjualanType } from "@/types";

type Props = {
  dtEdit: KategoriLokasiPenjualanType | null;
  halaman: string;
};
// kategoriProduk
const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = useKategoriLokasiPenjualan();
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
  } = useForm<KategoriLokasiPenjualanType>();

  // reset form
  const resetForm = () => {
    setValue("id", "");
    setValue("nm_kategori_lokasi", "");
  };
  // data edit
  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("nm_kategori_lokasi", dtEdit.nm_kategori_lokasi);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);
  // simpan data
  const onSubmit: SubmitHandler<KategoriLokasiPenjualanType> = async (row) => {
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
    <ModalDef id="add_kategoriLokasiPenjualan" title={`Form ${halaman}`}>
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
