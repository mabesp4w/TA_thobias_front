/** @format */

"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import ShowData from "./ShowData";
import { Toaster } from "react-hot-toast";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import ModalDef from "@/components/modal/ModalDef";
import { MapPinIcon } from "lucide-react";
import useKategoriLokasiPenjualanApi from "@/stores/api/KategoriLokasiPenjualan";
import SaleLocation from "@/components/map/SaleLocation";
import { useForm } from "react-hook-form";
import { LokasiPenjualanType } from "@/types";

const halaman = "Lokasi Penjualan";

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  const { dtKategoriLokasiPenjualan, setKategoriLokasiPenjualan } =
    useKategoriLokasiPenjualanApi();

  const { dtLokasiPenjualan, setLokasiPenjualan } = useLokasiPenjualan();
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
        await setLokasiPenjualan({
          page: 1,
          limit: 100,
          kategori_lokasi: kategori_lokasi?.toString(),
        });
      } finally {
        setIsLoadingLocations(false);
      }
    },
    [setLokasiPenjualan]
  );

  useEffect(() => {
    fetchLocationsByKategori(watchKategoriLokasiPenjualan);
  }, [watchKategoriLokasiPenjualan, fetchLocationsByKategori]);

  // Clear filter function
  const handleClearFilter = () => {
    setValue("kategori_lokasi", undefined);
    fetchLocationsByKategori();
  };

  // Filter safe locations (with valid coordinates)
  const safeLocations =
    dtLokasiPenjualan?.data?.filter(
      (loc) =>
        loc.latitude &&
        loc.longitude &&
        loc.latitude >= -90 &&
        loc.latitude <= 90 &&
        loc.longitude >= -180 &&
        loc.longitude <= 180
    ) || [];

  console.log({ dtLokasiPenjualan });

  return (
    <div className="flex flex-col h-full w-full text-sm md:text-lg">
      <div>
        <Toaster />
        <div className="mb-4 flex justify-between flex-col md:flex-row">
          <p>Sebaran lokasi penjualan UMKM</p>
          <div className="flex gap-2 shrink-0">
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
        <ShowData />

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
