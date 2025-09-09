/** @format */

"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useUserAccount from "@/stores/crud/UserAccount";
import { useWelcomeContext } from "@/context/WelcomeContext";
import Form from "./form/Form";
import { showModal } from "@/utils/modalHelper";

const halaman = "Account Settings";

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  const { getUserAccount, accountData } = useUserAccount();

  useEffect(() => {
    setWelcome(`Halaman ${halaman}`);
    fetchAccount();
    return () => {};
  }, []);

  const fetchAccount = async () => {
    await getUserAccount();
  };

  const handleEdit = () => {
    showModal("edit_account");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <Form dtEdit={accountData} halaman={halaman} />
        <div className="m-4">
          <h2 className="text-2xl font-bold mb-2">{halaman}</h2>
          <p className="text-gray-600">
            Kelola informasi akun dan data pribadi Anda
          </p>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title">Informasi Pribadi</h3>
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit Akun
            </button>
          </div>
          {accountData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Nama Lengkap</p>
                <p>{accountData.first_name || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Username</p>
                <p>{accountData.username || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p>{accountData.email || "-"}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Loading data akun...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
