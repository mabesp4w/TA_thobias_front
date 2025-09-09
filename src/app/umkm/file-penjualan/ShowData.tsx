/** @format */

// components/crud/FilePenjualan/ShowData.tsx
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import useFilePenjualan, {
  FilePenjualanType,
} from "@/stores/crud/FilePenjualan";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { formatFileSize, formatDate } from "@/utils/formatters";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: FilePenjualanType) => void;
};

const ShowData: FC<Props> = ({ setDelete, setEdit }) => {
  const { setMyFiles, dtFilePenjualan, downloadFile } = useFilePenjualan();
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataFilePenjualan = async () => {
    await setMyFiles({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataFilePenjualan();
    return () => {};
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchDataFilePenjualan();
  }, [search, sortby, order]);

  const handleDownload = async (id: string) => {
    try {
      await downloadFile(id);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const headTable = [
    "No",
    "Nama File",
    "Deskripsi",
    "Ukuran File",
    "Tanggal Upload",
    "Aksi",
  ];

  const CustomTableBody = ({
    item,
    index,
  }: {
    item: FilePenjualanType;
    index: number;
  }) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2">{item.nama_file}</td>
      <td className="px-4 py-2">{item.deskripsi || "-"}</td>
      <td className="px-4 py-2">{formatFileSize(item.ukuran_file || 0)}</td>
      <td className="px-4 py-2">{formatDate(item.tgl_upload || "")}</td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button
            className="btn btn-xs btn-info"
            onClick={() => handleDownload(item.id!)}
            title="Download"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            className="btn btn-xs btn-warning"
            onClick={() => setEdit(item)}
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            className="btn btn-xs btn-error"
            onClick={() => setDelete({ id: item.id!, isDelete: false })}
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );

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
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {headTable.map((head, index) => (
                  <th key={index} className="text-center">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dtFilePenjualan?.data?.map((item, index) => (
                <CustomTableBody
                  key={item.id}
                  item={item}
                  index={(page - 1) * 10 + index}
                />
              ))}
            </tbody>
          </table>

          {(!dtFilePenjualan?.data || dtFilePenjualan.data.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada data file penjualan</p>
            </div>
          )}
        </div>

        {dtFilePenjualan?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtFilePenjualan?.current_page}
              totalPages={dtFilePenjualan?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
