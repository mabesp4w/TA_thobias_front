/** @format */

"use client";
import { FC } from "react";

interface PromosiStats {
  total_produk: number;
  total_umkm: number;
  total_kategori: number;
  produk_terbaru: number;
  umkm_aktif: number;
}

interface StatsSectionProps {
  stats: PromosiStats | null;
  isLoading: boolean;
}

const StatsSection: FC<StatsSectionProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statsData = [
    {
      label: "Total Produk",
      value: stats.total_produk,
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
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
      ),
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total UMKM",
      value: stats.total_umkm,
      icon: (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Kategori",
      value: stats.total_kategori,
      icon: (
        <svg
          className="w-6 h-6 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Produk Baru",
      value: stats.produk_terbaru,
      icon: (
        <svg
          className="w-6 h-6 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "UMKM Aktif",
      value: stats.umkm_aktif,
      icon: (
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg shadow-sm border border-gray-200 p-4 transition-transform hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {formatNumber(stat.value)}
              </p>
            </div>
            <div
              className={`p-2 rounded-lg ${stat.bgColor.replace("50", "100")}`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
