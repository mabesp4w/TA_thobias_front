/** @format */

"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import { LokasiPenjualanType } from "@/types";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import { closeModal } from "@/utils/modalHelper";
import SaleLocation from "@/components/map/SaleLocation";

type Props = {
  dtEdit: LokasiPenjualanType | null;
  halaman: string;
  lokasiPenjualan: LokasiPenjualanType[];
};

const Form = ({ dtEdit, halaman, lokasiPenjualan }: Props) => {
  const { createMyLocation, updateMyLocation } = useLokasiPenjualan();
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (lng: number, lat: number) => {
    setValue("longitude", lng);
    setValue("latitude", lat);
  };

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
    setValue("alamat", "");
    setValue("latitude", undefined);
    setValue("longitude", undefined);
    setValue("kecamatan", "");
    setValue("tlp_pengelola", "");
    setValue("kategori_lokasi", "");
    setValue("aktif", true);
  };

  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("nm_lokasi", dtEdit.nm_lokasi);
      setValue("alamat", dtEdit.alamat);
      setValue("latitude", dtEdit.latitude);
      setValue("longitude", dtEdit.longitude);
      setValue("kecamatan", dtEdit.kecamatan || "");
      setValue("tlp_pengelola", dtEdit.tlp_pengelola || "");
      setValue("kategori_lokasi", dtEdit.kategori_lokasi || "");
      setValue("aktif", dtEdit.aktif);
    } else {
      resetForm();
    }
  }, [dtEdit]);

  const onSubmit: SubmitHandler<LokasiPenjualanType> = async (row) => {
    await submitData({
      row,
      dtEdit,
      setIsLoading,
      addData: createMyLocation,
      updateData: updateMyLocation,
      resetForm,
      toastShow,
    });
    closeModal("add_lokasi_penjualan");
  };

  return (
    <>
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
      <ModalDef
        id="modal_select_map_location"
        title="Pilih Lokasi pada Peta"
        size="lg"
      >
        <SaleLocation
          handleLocationSelect={handleLocationSelect}
          lokasiPenjualan={lokasiPenjualan}
          addMarker
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              closeModal("modal_select_map_location");
            }}
          >
            Selesai
          </button>
        </div>
      </ModalDef>
    </>
  );
};

export default Form;
