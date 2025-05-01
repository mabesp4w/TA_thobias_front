/** @format */
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useProvinsi from "@/stores/crud/Provinsi";
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

// provinsi

const ShowData: FC<Props> = ({ setDelete, setEdit }) => {
  const { setProvinsi, dtProvinsi } = useProvinsi();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataDosen = async () => {
    await setProvinsi({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  console.log({ dtProvinsi });

  useEffect(() => {
    fetchDataDosen();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ketika search berubah
  useEffect(() => {
    setPage(1);
    fetchDataDosen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortby, order]);

  // table
  const headTable = ["No", "Nama Provinsi", "Aksi"];
  const tableBodies = ["nm_provinsi"];

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col max-w-full h-full overflow-auto">
      <div className="overflow-hidden h-full flex flex-col ">
        <div className="overflow-auto grow">
          <TableDef
            headTable={headTable}
            tableBodies={tableBodies}
            dataTable={dtProvinsi?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
          />
        </div>
        {dtProvinsi?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtProvinsi?.current_page}
              totalPages={dtProvinsi?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
