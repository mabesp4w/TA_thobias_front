/** @format */

"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import { LokasiPenjualanType } from "@/types";
import ModalDef from "@/components/modal/ModalDef";
import UMKMLocationMap from "@/components/map/UMKMLocationMap";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import { Toaster } from "react-hot-toast";

type Props = {
  dtEdit: LokasiPenjualanType | null;
};

const Form = ({ dtEdit }: Props) => {
  const { addData, updateData, dtLokasiPenjualan, setLokasiPenjualan } =
    useLokasiPenjualan();
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
    setLokasiPenjualan({
      limit: 100,
    });
  }, []);

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

  // Fungsi untuk mengupdate koordinat dari peta
  const handleLocationSelect = (lng: number, lat: number) => {
    setValue("longitude", lng);
    setValue("latitude", lat);
  };

  console.log({ dtLokasiPenjualan });

  return (
    <>
      <Toaster />
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
      <ModalDef id="showMapUMKMLocation" title={`Tampilkan Peta`} size="lg">
        <UMKMLocationMap
          initialLat={-2.5919}
          initialLng={140.6697}
          enableDraggableMarker={true}
          setValue={setValue}
          onLocationSelect={handleLocationSelect}
          lokasiPenjualan={dtLokasiPenjualan && dtLokasiPenjualan?.data}
        />
      </ModalDef>
    </>
  );
};

export default Form;
