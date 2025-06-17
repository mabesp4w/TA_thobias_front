/** @format */

import React from "react";
import useGrafikStore from "@/stores/api/GrafikApi";

const RingkasanPenjualan: React.FC = () => {
  const { dtRingkasan, isLoadingRingkasan, filters, error } = useGrafikStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Loading skeleton
  if (isLoadingRingkasan) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="animate-pulse flex items-center">
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && !dtRingkasan) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-red-50 border border-red-200 p-6 rounded-lg"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">Error</p>
                <p className="text-lg font-bold text-red-700">-</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Penjualan */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Total Penjualan</p>
            <p className="text-2xl font-bold text-green-600">
              {dtRingkasan
                ? formatCurrency(dtRingkasan.total_penjualan)
                : formatCurrency(0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Periode: {filters.tahun || new Date().getFullYear()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Transaksi */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
            <p className="text-2xl font-bold text-blue-600">
              {dtRingkasan ? formatNumber(dtRingkasan.total_transaksi) : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dtRingkasan && dtRingkasan.total_transaksi > 0
                ? `Rata-rata: ${formatCurrency(
                    dtRingkasan.total_penjualan / dtRingkasan.total_transaksi
                  )}`
                : "Tidak ada transaksi"}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Produk Terjual */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Produk Terjual</p>
            <p className="text-2xl font-bold text-orange-600">
              {dtRingkasan
                ? formatNumber(dtRingkasan.total_produk_terjual)
                : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dtRingkasan && dtRingkasan.total_transaksi > 0
                ? `${(
                    dtRingkasan.total_produk_terjual /
                    dtRingkasan.total_transaksi
                  ).toFixed(1)} produk/transaksi`
                : "Unit terjual"}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* UMKM Aktif */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">
              {filters.umkm_id ? "UMKM Dipilih" : "UMKM Aktif"}
            </p>
            <p className="text-2xl font-bold text-purple-600">
              {dtRingkasan ? formatNumber(dtRingkasan.jumlah_umkm_aktif) : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {filters.umkm_id ? "Mode filter UMKM" : "Dengan transaksi"}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingkasanPenjualan;
