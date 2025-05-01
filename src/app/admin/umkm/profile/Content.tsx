/** @format */

"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import useProfilUMKM from "@/stores/crud/ProfilUMKMAdmin";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";

const halaman = "Data UMKM";

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

  const { removeData } = useProfilUMKM();
  const [idDel, setIdDel] = useState<number | string>();

  const setShow = (row: any) => {
    showModal("detail_umkm");
    // Set detail UMKM untuk ditampilkan
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
        <DeleteModal setDelete={setDelete} />
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{halaman}</h2>
          <p>Daftar seluruh UMKM yang terdaftar dalam sistem</p>
        </div>
      </div>

      <Suspense>
        <ShowData setShow={setShow} setDelete={setDelete} />
      </Suspense>
    </div>
  );
};

export default Content;
