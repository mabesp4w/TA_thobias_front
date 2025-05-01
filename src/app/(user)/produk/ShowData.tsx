/** @format */

"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useProdukUMKM from "@/stores/crud/ProdukUMKM";
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
  const { setProduk, dtProduk } = useProdukUMKM();
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataProduk = async () => {
    await setProduk({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataProduk();
    return () => {};
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchDataProduk();
  }, [search, sortby, order]);

  const headTable = [
    "No",
    "Nama Produk",
    "Kategori",
    "Harga",
    "Stok",
    "Satuan",
    "Aktif",
    "Aksi",
  ];
  const tableBodies = [
    "nm_produk",
    "kategori_detail.nm_kategori",
    "harga",
    "stok",
    "satuan",
    "aktif",
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
            dataTable={dtProduk?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
          />
        </div>
        {dtProduk?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtProduk?.current_page}
              totalPages={dtProduk?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
