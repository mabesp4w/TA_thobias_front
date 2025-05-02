/** @format */

"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import Link from "next/link";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import { LokasiPenjualanType } from "@/types";
import { useRouter } from "next/navigation";

const halaman = "Lokasi Penjualan";

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
  // router
  const router = useRouter();

  // store
  const { removeData } = useLokasiPenjualan();
  // state
  const [idDel, setIdDel] = useState<number | string>();

  const setEdit = (row: LokasiPenjualanType) => {
    router.push(`/admin/lokasi-penjualan/form?id=${row.id}`);
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
        <div className="mb-4 flex justify-between">
          <p>
            Kelola lokasi penjualan produk Anda seperti kios, pasar,
            supermarket, atau online marketplace.
          </p>
          <div className="flex gap-2">
            <Link
              href="/admin/lokasi-penjualan/form"
              className="btn btn-primary"
            >
              Tambah Lokasi
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => showModal("showMapUMKMLocation")}
            >
              Tampilkan Peta
            </button>
          </div>
        </div>
      </div>

      <Suspense>
        <ShowData setDelete={setDelete} setEdit={setEdit} />
      </Suspense>
    </div>
  );
};

export default Content;
