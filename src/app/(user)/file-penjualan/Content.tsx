/** @format */

// components/crud/FilePenjualan/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import useFilePenjualan, {
  FilePenjualanType,
} from "@/stores/crud/FilePenjualan";

const halaman = "File Penjualan";

type Delete = {
  id?: number | string;
  isDelete: boolean;
};

const Content = () => {
  const { setWelcome } = useWelcomeContext();

  useEffect(() => {
    setWelcome(`Halaman ${halaman}`);
    return () => {};
  }, [setWelcome]);

  const { removeData } = useFilePenjualan();
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<FilePenjualanType | null>(null);

  const handleTambah = () => {
    showModal("add_file_penjualan");
    setDtEdit(null);
  };

  const setEdit = (row: FilePenjualanType) => {
    showModal("add_file_penjualan");
    setDtEdit(row);
  };

  const setDelete = async ({ id, isDelete }: Delete) => {
    setIdDel(id);
    showModal("modal_delete");
    if (isDelete) {
      const { data } = await removeData(idDel as string);
      toastShow({
        event: data,
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <Form dtEdit={dtEdit} halaman={halaman} />
        <DeleteModal setDelete={setDelete} />
        <div className="mb-4 flex flex-col gap-4">
          {" "}
          {/* Ubah dari flex justify-between jadi flex-col biar teks dan tombol nggak numpuk */}
          <p>
            Kelola file Excel detail penjualan Anda. Upload file untuk
            melaporkan penjualan secara batch.
          </p>
          <div className="p-4 bg-info/10 rounded-md">
            {" "}
            {/* Tambahin box info biar keliatan sebagai keterangan khusus, sesuaikan styling kalau pakai Tailwind/DaisyUI */}
            <h3 className="font-bold mb-2">Panduan Upload File Penjualan:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Download template Excel di bawah ini untuk format yang benar.
              </li>
              <li>
                Isi data penjualan Anda sesuai kolom-kolom di template (jangan
                ubah header atau struktur).
              </li>
              <li>
                Simpan file sebagai .xlsx, lalu klik &quot;Upload File&quot;
                untuk submit.
              </li>
            </ol>
          </div>
          <div className="flex justify-end gap-2">
            {" "}
            {/* Tombol-tombol di kanan bawah */}
            <a
              href="/templates/daftar_produk_lokasi_penjualan.xlsx"
              download="daftar_produk_lokasi_penjualan.xlsx"
              className="btn btn-outline btn-secondary"
            >
              Download Template
            </a>
            <button className="btn btn-primary" onClick={handleTambah}>
              Upload File
            </button>
          </div>
        </div>
      </div>

      <Suspense>
        <ShowData setDelete={setDelete} setEdit={setEdit} />
      </Suspense>
    </div>
  );
};

export default Content;
