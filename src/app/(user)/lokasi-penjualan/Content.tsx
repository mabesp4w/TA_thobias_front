/** @format */

"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import ModalDef from "@/components/modal/ModalDef";
import { MapPinIcon } from "lucide-react";
import useKategoriLokasiPenjualanApi from "@/stores/api/KategoriLokasiPenjualan";
import SaleLocation from "@/components/map/SaleLocation";
import { useForm } from "react-hook-form";
import { LokasiPenjualanType } from "@/types";

const halaman = "Lokasi Penjualan";

type Delete = {
  id?: number | string;
  isDelete: boolean;
};

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  const { dtKategoriLokasiPenjualan, setKategoriLokasiPenjualan } =
    useKategoriLokasiPenjualanApi();

  const { destroyMyLocation, dtMyLokasiPenjualan, setMyLokasiPenjualan } =
    useLokasiPenjualan();
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<any>();
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  useEffect(() => {
    setWelcome(`Halaman ${halaman}`);
    // Fetch kategori lokasi for map
    setKategoriLokasiPenjualan();
    return () => {};
  }, []);

  // form
  const { control, watch, setValue } = useForm<LokasiPenjualanType>();
  const watchKategoriLokasiPenjualan = watch("kategori_lokasi");

  // Fetch locations based on kategori
  const fetchLocationsByKategori = useCallback(
    async (kategori_lokasi?: string | number) => {
      setIsLoadingLocations(true);
      try {
        await setMyLokasiPenjualan({
          page: 1,
          limit: 100,
          kategori_lokasi: kategori_lokasi?.toString(),
        });
      } finally {
        setIsLoadingLocations(false);
      }
    },
    [setMyLokasiPenjualan]
  );

  useEffect(() => {
    fetchLocationsByKategori(watchKategoriLokasiPenjualan);
  }, [watchKategoriLokasiPenjualan, fetchLocationsByKategori]);

  // Clear filter function
  const handleClearFilter = () => {
    setValue("kategori_lokasi", undefined);
    fetchLocationsByKategori();
  };

  const handleTambah = () => {
    showModal("add_lokasi_penjualan");
    setDtEdit(null);
  };

  const setEdit = (row: any) => {
    showModal("add_lokasi_penjualan");
    setDtEdit(row);
  };

  const setDelete = async ({ id, isDelete }: Delete) => {
    setIdDel(id);
    showModal("modal_delete");
    if (isDelete) {
      const { data } = await destroyMyLocation(idDel as string);
      toastShow({
        event: data,
      });
      // Refresh data after delete
      fetchLocationsByKategori(watchKategoriLokasiPenjualan);
    }
  };

  // Filter safe locations (with valid coordinates)
  const safeLocations =
    dtMyLokasiPenjualan?.data?.filter(
      (loc) =>
        loc.latitude &&
        loc.longitude &&
        loc.latitude >= -90 &&
        loc.latitude <= 90 &&
        loc.longitude >= -180 &&
        loc.longitude <= 180
    ) || [];

  return (
    <div className="flex flex-col h-full w-full text-sm md:text-lg">
      <div>
        <Toaster />
        <Form
          dtEdit={dtEdit}
          halaman={halaman}
          lokasiPenjualan={dtMyLokasiPenjualan?.data}
        />
        <DeleteModal setDelete={setDelete} />
        <div className="mb-4 flex justify-between flex-col md:flex-row">
          <p>
            Lokasi penjualan produk Anda seperti kios, pasar, supermarket,
            online marketplace dan lainnya. Jika kategori lokasi penjualan belum
            ada, silahkan menghubungi admin wwf.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              className="btn btn-primary btn-sm md:btn-md"
              onClick={handleTambah}
            >
              Tambah Lokasi
            </button>
            <button
              className="btn btn-secondary btn-sm md:btn-md"
              onClick={() => {
                showModal("showMapUMKMLocation");
                setValue("kategori_lokasi", "");
              }}
            >
              <MapPinIcon className="h-4 w-4" />
              Lihat Peta
            </button>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center">
            <span className="loading loading-spinner" />
          </div>
        }
      >
        <ShowData setDelete={setDelete} setEdit={setEdit} />

        {/* Modal untuk menampilkan peta semua lokasi */}
        <ModalDef
          id="showMapUMKMLocation"
          title={`Peta Lokasi Penjualan`}
          size="lg"
        >
          <SaleLocation
            initialLat={-2.5919}
            initialLng={140.6697}
            lokasiPenjualan={safeLocations}
            dtKategoriLokasiPenjualan={dtKategoriLokasiPenjualan}
            control={control}
            isLoadingLocations={isLoadingLocations}
            onClearFilter={handleClearFilter}
          />
        </ModalDef>
      </Suspense>
    </div>
  );
};

export default Content;
