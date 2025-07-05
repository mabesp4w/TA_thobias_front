/** @format */

// components/crud/FilePenjualan/form/BodyForm.tsx
import InputText from "@/components/input/InputText";
import InputTextarea from "@/components/input/InputTextarea";
import InputFile from "@/components/input/InputFile";
import { FilePenjualanType } from "@/stores/crud/FilePenjualan";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  register: any;
  errors: FieldErrors<FilePenjualanType>;
  dtEdit: FilePenjualanType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors, dtEdit, watch, setValue }) => {
  return (
    <>
      <InputFile
        label="File Excel Penjualan"
        name="file"
        register={register}
        watch={watch}
        setValue={setValue}
        required={!dtEdit} // Required only for new uploads
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        addClass="w-full"
        size="file-input-md"
        color="file-input-primary"
      />

      <div className="text-sm text-gray-600 mb-4">
        <p>• Format file yang didukung: Excel (.xlsx, .xls)</p>
        <p>• Ukuran maksimal: 5MB</p>
        <p>• File harus berisi data penjualan dengan format yang sesuai</p>
      </div>

      <InputText
        label="Nama File"
        name="nama_file"
        register={register}
        addClass="w-full"
        required
        errors={errors.nama_file}
        placeholder="Masukkan nama file untuk identifikasi"
      />

      <InputTextarea
        label="Deskripsi"
        name="deskripsi"
        register={register}
        addClass="w-full"
        errors={errors.deskripsi}
        placeholder="Deskripsi tambahan tentang file ini (opsional)"
        rows={3}
      />

      {dtEdit && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>File saat ini:</strong> {dtEdit.nama_file}
          </p>
          <p className="text-sm text-blue-600">
            Upload file baru untuk mengganti file yang sudah ada
          </p>
        </div>
      )}
    </>
  );
};

export default BodyForm;
