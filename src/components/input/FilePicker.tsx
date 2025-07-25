/** @format */
// components/input/FilePicker.tsx
"use client";
import { FC, useRef } from "react";
import Resizer from "react-image-file-resizer";

type Props = {
  label?: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  size?: "file-input-xs" | "file-input-sm" | "file-input-md" | "file-input-lg";
  color?:
    | "file-input-primary"
    | "file-input-secondary"
    | "file-input-accent"
    | "file-input-info"
    | "file-input-success"
    | "file-input-warning"
    | "file-input-error";
  addClass?: string;
};

const FilePicker: FC<Props> = ({
  accept,
  onFileSelect,
  size = "file-input-md",
  color = "",
  addClass = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeFile = (file: File | null) =>
    new Promise<void>((resolve) => {
      if (file) {
        const splitType = file?.type?.split("/") || [];
        const type = splitType[0];
        if (type !== "image") {
          onFileSelect(file);
          resolve();
          return;
        }
        Resizer.imageFileResizer(
          file,
          500,
          500,
          splitType[1],
          100,
          0,
          (uri) => {
            onFileSelect(uri as File);
            resolve();
          },
          "file"
        );
      } else {
        onFileSelect(null);
        resolve();
      }
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target?.files?.[0] || null;
    resizeFile(selectedFile);
  };

  //   const clearFile = () => {
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }
  //     onFileSelect(null);
  //   };

  return (
    <div className={`space-y-2 ${addClass}`}>
      <input
        ref={fileInputRef}
        className={`file-input file-input-bordered w-full ${size} ${color}`}
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />
      {/* <button
        type="button"
        className="btn btn-ghost btn-sm w-full"
        onClick={clearFile}
      >
        🗑️ Hapus File
      </button> */}
    </div>
  );
};

export default FilePicker;
