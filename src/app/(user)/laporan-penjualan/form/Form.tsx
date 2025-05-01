/** @format */

"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import useProdukTerjual from "@/stores/crud/ProdukTerjual";
import { ProdukTerjualType } from "@/types";
import moment from "moment";

type Props = {
  dtEdit: ProdukTerjualType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  const { addData, updateData } = useProdukTerjual();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<ProdukTerjualType>();

  const resetForm = () => {
    setValue("id", "");
    setValue("produk_id", "");
    setValue("lokasi_penjualan_id", "");
    setValue("tgl_penjualan", moment().format("YYYY-MM-DD"));
    setValue("jumlah_terjual", 0);
    setValue("harga_jual", 0);
    setValue("catatan", "");
  };

  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("produk_id", dtEdit.produk_id);
      setValue("lokasi_penjualan_id", dtEdit.lokasi_penjualan_id);
      setValue(
        "tgl_penjualan",
        moment(dtEdit.tgl_penjualan).format("YYYY-MM-DD")
      );
      setValue("jumlah_terjual", dtEdit.jumlah_terjual);
      setValue("harga_jual", dtEdit.harga_jual);
      setValue("catatan", dtEdit.catatan || "");
    } else {
      resetForm();
    }
  }, [dtEdit]);

  const onSubmit: SubmitHandler<ProdukTerjualType> = async (row) => {
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
    <ModalDef id="add_laporan_penjualan" title={`Form ${halaman}`} size="lg">
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
