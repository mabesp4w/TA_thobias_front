/** @format */

"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import useProdukUMKM from "@/stores/crud/ProdukUMKM";

const halaman = "Produk";

type Delete = {
  id?: number | string;
  isDelete: boolean;
};

const Content = () => {
  const { setWelcome } = useWelcomeContext();

  useEffect(() => {
    setWelcome(`Halaman ${halaman}`);
    return () => {};
  }, []);

  const { removeData } = useProdukUMKM();
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<any>();

  const handleTambah = () => {
    showModal("add_produk");
    setDtEdit(null);
  };

  const setEdit = (row: any) => {
    showModal("add_produk");
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
            Kelola daftar produk yang Anda jual. Pastikan informasi produk
            selalu up to date.
          </p>
          <button className="btn btn-primary" onClick={handleTambah}>
            Tambah Produk
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
