/** @format */

// components/crud/FilePenjualan/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import useFilePenjualan, {
  FilePenjualanType,
} from "@/stores/crud/FilePenjualan";

const halaman = "File Penjualan";

type Delete = {
  id?: number | string;
  isDelete: boolean;
};

const Content = () => {
  const { setWelcome } = useWelcomeContext();

  useEffect(() => {
    setWelcome(`Halaman ${halaman}`);
    return () => {};
  }, [setWelcome]);

  const { removeData } = useFilePenjualan();
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<FilePenjualanType | null>(null);

  const handleTambah = () => {
    showModal("add_file_penjualan");
    setDtEdit(null);
  };

  const setEdit = (row: FilePenjualanType) => {
    showModal("add_file_penjualan");
    setDtEdit(row);
  };

  const setDelete = async ({ id, isDelete }: Delete) => {
    setIdDel(id);
    showModal("modal_delete");
    if (isDelete) {
      const { data } = await removeData(idDel as string);
      toastShow({
        event: data,
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <Form dtEdit={dtEdit} halaman={halaman} />
        <DeleteModal setDelete={setDelete} />
        <div className="mb-4 flex justify-between">
          <p>
            Kelola file Excel detail penjualan Anda. Upload file untuk
            melaporkan penjualan secara batch.
          </p>
          <button className="btn btn-primary" onClick={handleTambah}>
            Upload File
          </button>
        </div>
      </div>

      <Suspense>
        <ShowData setDelete={setDelete} setEdit={setEdit} />
      </Suspense>
    </div>
  );
};

export default Content;
