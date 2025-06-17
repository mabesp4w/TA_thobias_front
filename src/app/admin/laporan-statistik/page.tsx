/** @format */
"use client";
import React, { useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import FilterGrafik from "@/components/grafik/FilterGrafik";
import RingkasanPenjualan from "@/components/grafik/RingkasanPenjualan";
import GrafikPenjualan from "@/components/grafik/GrafikPenjualan";
import useGrafikStore from "@/stores/api/GrafikApi";

const StatistikPenjualan: NextPage = () => {
  const { fetchGrafikPenjualan, fetchRingkasanPenjualan, filters, error } =
    useGrafikStore();

  // Load initial data saat pertama kali mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchGrafikPenjualan(), fetchRingkasanPenjualan()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []); // Hanya jalankan sekali saat mount

  // Tidak perlu useEffect untuk reload data saat filter berubah
  // karena sudah dihandle oleh FilterGrafik dengan applyFiltersAndFetch

  return (
    <>
      <Head>
        <title>Dashboard Penjualan UMKM</title>
        <meta
          name="description"
          content="Dashboard grafik penjualan untuk semua UMKM"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Penjualan
                </h1>
                <p className="text-gray-600 mt-1">
                  Analisis data penjualan UMKM
                </p>
              </div>

              {/* Info Badge */}
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Live Data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filter Section */}
          <FilterGrafik />

          {/* Summary Section */}
          <RingkasanPenjualan />

          {/* Main Chart Section */}
          <GrafikPenjualan />

          {/* Additional Info Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tips Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tips Penggunaan
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>
                    Gunakan filter UMKM untuk melihat performa spesifik satu
                    UMKM
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>
                    Klik &quot;Bandingkan UMKM&quot; untuk melihat perbandingan
                    antar UMKM
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>
                    Pilih periode bulan untuk analisis data dalam rentang
                    tertentu
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>
                    Ganti tipe grafik (Garis, Batang, Pie) sesuai preferensi
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>
                    Klik &quot;Terapkan Filter&quot; setelah mengubah pengaturan
                    filter
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informasi Filter
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Tahun Aktif:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {filters.tahun || new Date().getFullYear()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Mode Tampilan:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {filters.umkm_id ? "UMKM Spesifik" : "Semua UMKM"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Periode:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {filters.bulan_start
                      ? `${filters.bulan_start}${
                          filters.bulan_end
                            ? ` - ${filters.bulan_end}`
                            : " - 12"
                        }`
                      : "Semua Bulan"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Last Update:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {new Date().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StatistikPenjualan;
