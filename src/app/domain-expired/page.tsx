/** @format */

// app/domain-expired/page.tsx
"use client";

import { AlertCircle, Calendar, RefreshCcw, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function DomainExpired() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full transition-all duration-1000 transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header dengan gradient */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute transform rotate-45 -top-12 -right-12 w-64 h-64 bg-white rounded-full"></div>
              <div className="absolute transform -rotate-45 -bottom-12 -left-12 w-64 h-64 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm animate-pulse">
                <AlertCircle size={48} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Domain Expired</h1>
              <p className="text-red-100 text-lg">
                Masa aktif domain telah berakhir
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Website ini sedang tidak dapat diakses karena{" "}
                <span className="font-semibold text-red-600">
                  masa aktif domain telah berakhir
                </span>
                .
              </p>
              <p className="text-gray-600">
                Silakan hubungi administrator website untuk informasi lebih
                lanjut.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 text-center border border-red-100 transition-transform hover:scale-105">
                <Calendar className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">
                  Domain Expired
                </h3>
                <p className="text-sm text-gray-600">Perpanjang segera</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 text-center border border-orange-100 transition-transform hover:scale-105">
                <RefreshCcw className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Renewal</h3>
                <p className="text-sm text-gray-600">Proses pembaruan</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 text-center border border-yellow-100 transition-transform hover:scale-105">
                <Mail className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">
                  Hubungi Kami
                </h3>
                <p className="text-sm text-gray-600">Butuh bantuan?</p>
              </div>
            </div>

            {/* Action Message */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">
                    Untuk Administrator
                  </h3>
                  <p className="text-sm text-amber-700">
                    Harap segera lakukan perpanjangan domain untuk mengaktifkan
                    kembali website Anda. Jika sudah melakukan pembayaran,
                    tunggu beberapa saat hingga status domain terupdate.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Jika Anda memiliki pertanyaan, silakan hubungi penyedia layanan
                domain Anda
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>🔒 Halaman ini ditampilkan secara otomatis</p>
        </div>
      </div>
    </div>
  );
}
