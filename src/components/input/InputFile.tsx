/** @format */
// components/input/InputFile.tsx
"use client";
import { BASE_URL } from "@/services/baseURL";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import CameraCapture from "./CameraCapture";
import FilePicker from "./FilePicker";

type Props = {
  label?: string;
  register: any;
  watch: any;
  required?: boolean;
  name: string;
  errors?: any;
  accept?: any;
  addClass?: string;
  setValue: any;
  fileEdit?: any;
  initialValue?: any;
  size?: "file-input-xs" | "file-input-sm" | "file-input-md" | "file-input-lg";
  labelClass?: string;
  color?:
    | "file-input-primary"
    | "file-input-secondary"
    | "file-input-accent"
    | "file-input-info"
    | "file-input-success"
    | "file-input-warning"
    | "file-input-error";
};

const InputFile: FC<Props> = ({
  label,
  register,
  required,
  name,
  errors,
  addClass,
  accept,
  setValue,
  fileEdit,
  initialValue,
  watch,
  size = "file-input-md",
  labelClass = "text-gray-700",
}) => {
  const [typeFile, setTypeFile] = useState<string>();
  const [myFile, setMyFile] = useState<any>(initialValue || "");
  const [inputMode, setInputMode] = useState<"file" | "camera">("file");

  const watchValue = watch(name);

  useEffect(() => {
    if (!watchValue) {
      setMyFile("");
    }
  }, [watchValue]);

  const onSelectFile = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setMyFile(reader.result as string);
      };
      const splitType = file?.type?.split("/") || [];
      setTypeFile(splitType[0]);
    } else {
      setMyFile("");
      setTypeFile("");
    }
    setValue(name, file);
  };

  const handleModeChange = (mode: "file" | "camera") => {
    setInputMode(mode);
    // Reset file when changing modes
    setMyFile("");
    setValue(name, null);
  };

  const handleCameraCapture = (file: File) => {
    onSelectFile(file);
    setInputMode("file"); // Switch back to file mode after capture
  };

  const handleCameraCancel = () => {
    setInputMode("file"); // Switch back to file mode
  };

  const handleFileClear = () => {
    setMyFile("");
    setValue(name, null);
  };

  return (
    <div className={`flex flex-col my-1 ${addClass}`}>
      {label && (
        <div className="flex gap-x-2">
          <label className={`text-sm ${labelClass}`}>{label}</label>
          {required && <span className="ml-1 text-red-600">*</span>}
          {!required && (
            <span className={`text-sm ${labelClass}`}>(Optional)</span>
          )}
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          className={`btn btn-sm ${
            inputMode === "file" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => handleModeChange("file")}
        >
          📁 Pilih File
        </button>
        <button
          type="button"
          className={`btn btn-sm ${
            inputMode === "camera" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => handleModeChange("camera")}
        >
          📷 Kamera
        </button>
      </div>

      {/* File Input Mode */}
      {inputMode === "file" && (
        <FilePicker accept={accept} onFileSelect={onSelectFile} size={size} />
      )}

      {/* Camera Mode */}
      {inputMode === "camera" && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={handleCameraCancel}
        />
      )}

      {/* Hidden input for form registration */}
      <input
        type="hidden"
        id={label}
        {...register(name, {
          required,
        })}
      />

      {/* File Preview */}
      <div className="flex gap-4 mt-2">
        {myFile && typeFile === "image" && (
          <div className="relative">
            <Image
              className="rounded-lg border"
              src={myFile as string}
              width={100}
              height={100}
              alt="Preview"
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
              onClick={handleFileClear}
            >
              ✕
            </button>
          </div>
        )}

        {fileEdit && name !== "file" && name !== "file_materi" && !myFile && (
          <div className="relative">
            <Image
              src={BASE_URL + fileEdit}
              width={100}
              height={100}
              alt="Current file"
              className="rounded-lg border"
            />
            <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">
              Current
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errors?.type === "required" && (
        <p className="text-red-500 font-inter italic text-sm">
          {label} tidak boleh kosong
        </p>
      )}
    </div>
  );
};

export default InputFile;
