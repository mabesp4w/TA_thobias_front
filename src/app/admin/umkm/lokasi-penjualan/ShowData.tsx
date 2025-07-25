/** @format */

"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import { LokasiPenjualanType } from "@/types";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState, useCallback } from "react";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete?: ({ id, isDelete }: DeleteProps) => void;
  setEdit?: (row: LokasiPenjualanType) => void;
};

const ShowData: FC<Props> = ({ setDelete, setEdit }) => {
  const { setLokasiPenjualan } = useLokasiPenjualan();
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  // state
  const [dtLokasiPenjualan, setDtLokasiPenjualan] = useState<any>();

  const fetchDataLokasiPenjualan = useCallback(async () => {
    setIsLoading(true);
    try {
      const dataLokasiPenjualan = await setLokasiPenjualan({
        page,
        search,
        sortby,
        order,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setDtLokasiPenjualan(dataLokasiPenjualan.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortby, order, setLokasiPenjualan]);

  useEffect(() => {
    fetchDataLokasiPenjualan();
  }, [fetchDataLokasiPenjualan]);

  useEffect(() => {
    setPage(1);
  }, [search, sortby, order]);

  const headTable = [
    "No",
    "Nama Lokasi",
    "Kategori Lokasi",
    "Kabupaten",
    "Distrik",
    "Alamat",
    "Telepon",
    "Aktif",
  ];

  const tableBodies = [
    "nm_lokasi",
    "kategori_lokasi_nama",
    "kabupaten_nama",
    "kecamatan_nama",
    "alamat",
    "tlp_pengelola",
    "aktif",
  ];

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // Handle empty data
  if (!dtLokasiPenjualan?.data || dtLokasiPenjualan.data.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Tidak ada data lokasi penjualan</p>
          <p className="text-sm text-gray-400">
            Klik tombol &quot;Tambah Lokasi&quot; untuk menambahkan lokasi baru
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col max-w-full h-full overflow-auto">
      <div className="overflow-hidden h-full flex flex-col">
        <div className="overflow-auto grow">
          <TableDef
            headTable={headTable}
            tableBodies={tableBodies}
            dataTable={dtLokasiPenjualan?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
            hapus={false}
            ubah={false}
          />
        </div>
        {dtLokasiPenjualan?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtLokasiPenjualan?.current_page}
              totalPages={dtLokasiPenjualan?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
