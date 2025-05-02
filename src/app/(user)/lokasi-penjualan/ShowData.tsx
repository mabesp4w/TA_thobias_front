/** @format */

"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: any) => void;
};

const ShowData: FC<Props> = ({ setDelete, setEdit }) => {
  const { setLokasiPenjualan, dtLokasiPenjualan } = useLokasiPenjualan();
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataLokasiPenjualan = async () => {
    await setLokasiPenjualan({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataLokasiPenjualan();
    return () => {};
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchDataLokasiPenjualan();
  }, [search, sortby, order]);

  const headTable = [
    "No",
    "Nama Lokasi",
    "Tipe Lokasi",
    "Alamat",
    "Kecamatan",
    "Telepon",
  ];
  const tableBodies = [
    "nm_lokasi",
    "tipe_lokasi",
    "alamat",
    "kecamatan_detail.nm_kecamatan",
    "tlp_pengelola",
  ];

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
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
            ubah={false}
            hapus={false}
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
