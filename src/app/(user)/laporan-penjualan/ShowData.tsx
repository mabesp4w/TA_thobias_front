/** @format */

"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useProdukTerjual from "@/stores/crud/ProdukTerjual";
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
  const { setProdukTerjual, dtProdukTerjual } = useProdukTerjual();
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataProdukTerjual = async () => {
    await setProdukTerjual({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataProdukTerjual();
    return () => {};
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchDataProdukTerjual();
  }, [search, sortby, order]);

  const headTable = [
    "No",
    "Tanggal",
    "Produk",
    "Lokasi",
    "Jumlah",
    "Harga Jual",
    "Total",
    "Aksi",
  ];
  const tableBodies = [
    "tgl_penjualan",
    "produk.nm_produk",
    "lokasi_penjualan.nm_lokasi",
    "jumlah_terjual",
    "harga_jual",
    "total_penjualan",
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
            dataTable={dtProdukTerjual?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
          />
        </div>
        {dtProdukTerjual?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtProdukTerjual?.current_page}
              totalPages={dtProdukTerjual?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
