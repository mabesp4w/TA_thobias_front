/** @format */

"use client";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useProfilUMKM from "@/stores/crud/ProfilUMKM";
import { useWelcomeContext } from "@/context/WelcomeContext";
import Form from "./form/Form";
import { showModal } from "@/utils/modalHelper";

const halaman = "Profil Bisnis";

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  const { getProfile, profilData } = useProfilUMKM();

  useEffect(() => {
    setWelcome(`Halaman ${halaman}`);
    fetchProfile();
    return () => {};
  }, []);

  const fetchProfile = async () => {
    await getProfile();
  };

  const handleEdit = () => {
    showModal("edit_profil");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <Form dtEdit={profilData} halaman={halaman} />

        <div className="m-4">
          <h2 className="text-2xl font-bold mb-2">{halaman}</h2>
          <p className="text-gray-600">Kelola informasi profil bisnis Anda</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title">Informasi Bisnis</h3>
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit Profil
            </button>
          </div>

          {profilData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Nama Bisnis</p>
                <p>{profilData.nm_bisnis || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Nomor Telepon</p>
                <p>{profilData.tlp || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-bold">Alamat</p>
                <p>{profilData.alamat || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-bold">Deskripsi Bisnis</p>
                <p>{profilData.desc_bisnis || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Tanggal Bergabung</p>
                <p>{new Date(profilData.tgl_bergabung).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Loading data profil...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
