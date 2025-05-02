/** @format */
"use client";
import React, { useEffect, useState } from "react";
import Form from "./Form";
import { useWelcomeContext } from "@/context/WelcomeContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import { LokasiPenjualanType } from "@/types";

const MyFormPage = () => {
  const { setWelcome } = useWelcomeContext();
  // search params
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // get data by id
  const { setShowLokasiPenjualan, showLokasiPenjualan } = useLokasiPenjualan();
  // state
  const [dtEdit, setDtEdit] = useState<LokasiPenjualanType | null>(null);

  useEffect(() => {
    setWelcome("Lokasi Penjualan");
  }, [setWelcome]);

  useEffect(() => {
    if (id) {
      setShowLokasiPenjualan(id as string);
    }
  }, [id, setShowLokasiPenjualan]);

  useEffect(() => {
    if (showLokasiPenjualan && id) {
      setDtEdit(showLokasiPenjualan);
    } else {
      setDtEdit(null);
    }
    return () => {};
  }, [id, showLokasiPenjualan]);

  return (
    <main className="m-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Form Lokasi Penjualan</h2>
        <Link
          href="/admin/lokasi-penjualan"
          className="underline text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Kembali
        </Link>
      </div>
      <Form dtEdit={dtEdit} />
    </main>
  );
};

export default MyFormPage;
