/** @format */
"use client";
import React from "react";

type Props = {
  data: {
    umkmData: any;
    allLocations: any[];
    hiddenLocations: any[];
  };
  onClose: () => void;
  formatCurrency: (value: number) => string;
};

const LokasiBreakdownModal = ({ data, onClose, formatCurrency }: Props) => {
  const { umkmData, allLocations } = data;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Detail Breakdown Lokasi
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {umkmData.nama_umkm} - {umkmData.nama_bulan} {umkmData.tahun}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">
                Total Penjualan
              </div>
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(parseFloat(umkmData.total_penjualan || 0))}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 font-medium">
                Total Pengeluaran
              </div>
              <div className="text-lg font-bold text-red-700">
                {formatCurrency(parseFloat(umkmData.total_pengeluaran || 0))}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">
                Laba Kotor
              </div>
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(parseFloat(umkmData.laba_kotor || 0))}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">
                Total Lokasi
              </div>
              <div className="text-lg font-bold text-purple-700">
                {allLocations.length} Lokasi
              </div>
            </div>
          </div>

          {/* Locations List */}
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            <h4 className="font-medium text-gray-800 mb-4">
              Detail Per Lokasi ({allLocations.length} Lokasi):
            </h4>

            {allLocations.map((lokasi, index) => {
              const penjualanLokasi = parseFloat(lokasi.total_penjualan || 0);
              const pengeluaranLokasi = parseFloat(
                lokasi.total_pengeluaran || 0
              );
              const labaKotorLokasi = parseFloat(lokasi.laba_kotor || 0);
              const kontribusi = parseFloat(lokasi.persentase_kontribusi || 0);

              return (
                <div
                  key={lokasi.lokasi_id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 text-sm">
                        {lokasi.nama_lokasi}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1">
                        📍 {lokasi.alamat_lokasi}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {kontribusi.toFixed(1)}% kontribusi
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Penjualan
                      </div>
                      <div className="font-medium text-green-600 text-sm">
                        {formatCurrency(penjualanLokasi)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Pengeluaran
                      </div>
                      <div className="font-medium text-red-600 text-sm">
                        {formatCurrency(pengeluaranLokasi)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Laba Kotor
                      </div>
                      <div className="font-medium text-blue-600 text-sm">
                        {formatCurrency(labaKotorLokasi)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Transaksi
                      </div>
                      <div className="font-medium text-gray-800 text-sm">
                        {lokasi.jumlah_transaksi || 0} transaksi
                      </div>
                    </div>
                  </div>

                  {/* Products sold info */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        Produk Terjual:{" "}
                        <span className="font-medium text-gray-700">
                          {lokasi.total_produk_terjual || 0} unit
                        </span>
                      </span>
                      <span className="text-gray-500">
                        Rata-rata:{" "}
                        <span className="font-medium text-gray-700">
                          {lokasi.jumlah_transaksi > 0
                            ? formatCurrency(
                                penjualanLokasi / lokasi.jumlah_transaksi
                              )
                            : formatCurrency(0)}
                          /transaksi
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LokasiBreakdownModal;
