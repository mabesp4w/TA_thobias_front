/** @format */

"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useProfilUMKM from "@/stores/crud/ProfilUMKMAdmin";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setShow: (row: any) => void;
  setDelete: ({ id, isDelete }: DeleteProps) => void;
};

const ShowData: FC<Props> = ({ setShow, setDelete }) => {
  const { setProfilUMKM, dtProfilUMKM } = useProfilUMKM();
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataUMKM = async () => {
    await setProfilUMKM({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataUMKM();
    return () => {};
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchDataUMKM();
  }, [search, sortby, order]);

  console.log({ dtProfilUMKM });

  const headTable = [
    "No",
    "Nama Bisnis",
    "Pemilik",
    "Jumlah Laki-laki",
    "Jumlah Perempuan",
    "Email",
    "Telepon",
    "Alamat",
    "Tanggal Bergabung",
  ];
  const tableBodies = [
    "nm_bisnis",
    "user_detail.nama_lengkap",
    "total_laki",
    "total_perempuan",
    "user_detail.email",
    "tlp",
    "alamat",
    "tgl_bergabung",
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
            dataTable={dtProfilUMKM?.data}
            page={page}
            limit={10}
            setEdit={setShow}
            setDelete={setDelete}
            ubah={false}
            hapus={false}
          />
        </div>
        {dtProfilUMKM?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtProfilUMKM?.current_page}
              totalPages={dtProfilUMKM?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
