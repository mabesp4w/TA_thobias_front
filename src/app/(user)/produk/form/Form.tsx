/** @format */

"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import { ProdukType } from "@/types";
import useProdukUMKM from "@/stores/crud/ProdukUMKM";
import { closeModal } from "@/utils/modalHelper";

type Props = {
  dtEdit: ProdukType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  const { addMyProduk, updateData } = useProdukUMKM();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<ProdukType>();

  const resetForm = () => {
    setValue("id", "");
    setValue("nm_produk", "");
    setValue("kategori", "");
    setValue("desc", "");
    setValue("harga", 0);
    setValue("stok", 0);
    setValue("satuan", "");
    setValue("bahan_baku", "");
    setValue("metode_produksi", "");
    setValue("aktif", true);
  };

  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("nm_produk", dtEdit.nm_produk);
      setValue("kategori", dtEdit.kategori);
      setValue("desc", dtEdit.desc);
      setValue("harga", dtEdit.harga);
      setValue("stok", dtEdit.stok);
      setValue("satuan", dtEdit.satuan);
      setValue("bahan_baku", dtEdit.bahan_baku);
      setValue("metode_produksi", dtEdit.metode_produksi);
      setValue("aktif", dtEdit.aktif);
    } else {
      resetForm();
    }
  }, [dtEdit]);

  const onSubmit: SubmitHandler<ProdukType> = async (row) => {
    // console.log({ row });
    // return;
    await submitData({
      row,
      dtEdit,
      setIsLoading,
      addData: addMyProduk,
      updateData,
      resetForm,
      toastShow,
    });
    closeModal("add_produk");
  };

  return (
    <ModalDef id="add_produk" title={`Form ${halaman}`}>
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
