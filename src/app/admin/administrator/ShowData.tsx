/** @format */
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useAdministrator from "@/stores/crud/Administrator";
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

// administrator

const ShowData: FC<Props> = ({ setDelete, setEdit }) => {
  const { setAdministrator, dtAdministrator } = useAdministrator();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataDosen = async () => {
    await setAdministrator({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

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
  const headTable = ["No", "Username", "Email", "Password", "Aksi"];
  const tableBodies = ["username", "email", "show_password"];

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
            dataTable={dtAdministrator?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
          />
        </div>
        {dtAdministrator?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtAdministrator?.current_page}
              totalPages={dtAdministrator?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
