/** @format */

// components/crud/FilePenjualan/form/Form.tsx
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import useFilePenjualan, {
  FilePenjualanType,
} from "@/stores/crud/FilePenjualan";
import { closeModal } from "@/utils/modalHelper";

type Props = {
  dtEdit: FilePenjualanType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  const { addData, updateData } = useFilePenjualan();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<FilePenjualanType>();

  const resetForm = () => {
    reset({
      id: "",
      nama_file: "",
      deskripsi: "",
      file: null,
    });
  };

  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id || "");
      setValue("nama_file", dtEdit.nama_file || "");
      setValue("deskripsi", dtEdit.deskripsi || "");
      // Note: file tidak bisa di-set dari data existing
    } else {
      resetForm();
    }
  }, [dtEdit, setValue, reset]);

  const onSubmit: SubmitHandler<FilePenjualanType> = async (row) => {
    // Validate file for new uploads
    if (!dtEdit && !row.file) {
      toastShow({
        event: {
          status: "error",
          data: {
            message: "File harus dipilih",
          },
        },
      });
      return;
    }

    // Validate file type
    if (row.file) {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!allowedTypes.includes(row.file.type)) {
        toastShow({
          event: {
            status: "error",
            data: {
              message: "File harus berformat Excel (.xlsx atau .xls)",
            },
          },
        });
        return;
      }

      // Validate file size (5MB)
      if (row.file.size > 5 * 1024 * 1024) {
        toastShow({
          event: {
            status: "error",
            data: {
              message: "Ukuran file tidak boleh lebih dari 5MB",
            },
          },
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      let result;
      if (dtEdit) {
        result = await updateData(dtEdit.id!, row);
      } else {
        result = await addData(row);
      }

      toastShow({
        event: result.data,
      });

      if (
        result.status === "berhasil tambah" ||
        result.status === "berhasil update"
      ) {
        closeModal("add_file_penjualan");
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalDef
      id="add_file_penjualan"
      title={`${dtEdit ? "Edit" : "Upload"} ${halaman}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />
        <div className="grid grid-cols-1 gap-4 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            dtEdit={dtEdit}
            control={control}
            watch={watch}
            setValue={setValue}
          />
        </div>
        <div className="flex gap-2">
          {isLoading ? (
            <span className="loading loading-dots loading-md" />
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={handleSubmit(onSubmit)}
                type="submit"
              >
                {dtEdit ? "Update" : "Upload"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => closeModal("add_file_penjualan")}
              >
                Batal
              </button>
            </>
          )}
        </div>
      </form>
    </ModalDef>
  );
};

export default Form;
