/** @format */

"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import ModalDef from "@/components/modal/ModalDef";
import UMKMLocationMap from "@/components/map/UMKMLocationMap";
import { MapPinIcon } from "lucide-react";

const halaman = "Lokasi Penjualan";

type Delete = {
  id?: number | string;
  isDelete: boolean;
};

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  // store
  const { dtLokasiPenjualan } = useLokasiPenjualan();

  useEffect(() => {
    setWelcome(`Halaman ${halaman}`);
    return () => {};
  }, []);

  const { removeData } = useLokasiPenjualan();
  const [idDel, setIdDel] = useState<number | string>();

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

  console.log({ dtLokasiPenjualan });

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <DeleteModal setDelete={setDelete} />
        <div className="mb-4 flex justify-between">
          <p>
            Lokasi penjualan produk Anda seperti kios, pasar, supermarket, atau
            online marketplace. Jika lokasi penjualan belum ada, silahkan
            menghubungi admin.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => showModal("showMapUMKMLocation")}
          >
            <MapPinIcon />
          </button>
        </div>
      </div>

      <Suspense>
        <ShowData setDelete={setDelete} setEdit={() => {}} />
        <ModalDef id="showMapUMKMLocation" title={`Tampilkan Peta`} size="lg">
          <UMKMLocationMap
            initialLat={-2.5919}
            initialLng={140.6697}
            enableDraggableMarker={false}
            lokasiPenjualan={dtLokasiPenjualan?.data}
            showControl={false}
          />
        </ModalDef>
      </Suspense>
    </div>
  );
};

export default Content;
