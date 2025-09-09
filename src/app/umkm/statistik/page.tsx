/** @format */

"use client";

import React, { useState } from "react";
import StatistikChart from "@/components/grafik/StatistikChart"; // Sesuaikan path
import useStatistikStore from "@/stores/api/Statistik"; // Sesuaikan path

const StatistikPage: React.FC = () => {
  const { filters, clearFilters, applyFiltersAndFetch, isLoading } =
    useStatistikStore();

  const [tempFilters, setTempFilters] = useState({
    tipe_periode:
      (filters.tipe_periode as "bulanan" | "tahunan" | "custom") || "bulanan",
    tahun: filters.tahun || new Date().getFullYear(),
    bulan: filters.bulan || undefined,
    tanggal_awal: filters.tanggal_awal || "",
    tanggal_akhir: filters.tanggal_akhir || "",
    lokasi_id: filters.lokasi_id || "",
  });

  const handleFilterChange = (key: string, value: any) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    const newFilters: any = {
      tipe_periode: tempFilters.tipe_periode,
      tahun: tempFilters.tahun,
    };

    if (tempFilters.bulan) {
      newFilters.bulan = tempFilters.bulan;
    }

    if (tempFilters.tipe_periode === "custom") {
      if (tempFilters.tanggal_awal) {
        newFilters.tanggal_awal = tempFilters.tanggal_awal;
      }
      if (tempFilters.tanggal_akhir) {
        newFilters.tanggal_akhir = tempFilters.tanggal_akhir;
      }
    }

    if (tempFilters.lokasi_id) {
      newFilters.lokasi_id = tempFilters.lokasi_id;
    }

    applyFiltersAndFetch(newFilters);
  };

  const handleClearFilters = () => {
    const currentYear = new Date().getFullYear();
    setTempFilters({
      tipe_periode: "bulanan",
      tahun: currentYear,
      bulan: undefined,
      tanggal_awal: "",
      tanggal_akhir: "",
      lokasi_id: "",
    });
    clearFilters();
    applyFiltersAndFetch({
      tipe_periode: "bulanan",
      tahun: currentYear,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Statistik</h1>

      {/* Filter Section */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Filter Data</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tipe Periode */}
            <div>
              <label className="label">
                <span className="label-text">Tipe Periode</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={tempFilters.tipe_periode}
                onChange={(e) =>
                  handleFilterChange("tipe_periode", e.target.value)
                }
              >
                <option value="bulanan">Bulanan</option>
                <option value="tahunan">Tahunan</option>
              </select>
            </div>

            {/* Tahun */}
            <div>
              <label className="label">
                <span className="label-text">Tahun *</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={tempFilters.tahun}
                min="2020"
                max="2030"
                onChange={(e) =>
                  handleFilterChange("tahun", parseInt(e.target.value))
                }
              />
            </div>

            {/* Bulan (hanya untuk tipe bulanan) */}
            {tempFilters.tipe_periode === "bulanan" && (
              <div>
                <label className="label">
                  <span className="label-text">Bulan (Opsional)</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={tempFilters.bulan || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "bulan",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">Semua Bulan</option>
                  <option value="1">Januari</option>
                  <option value="2">Februari</option>
                  <option value="3">Maret</option>
                  <option value="4">April</option>
                  <option value="5">Mei</option>
                  <option value="6">Juni</option>
                  <option value="7">Juli</option>
                  <option value="8">Agustus</option>
                  <option value="9">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>
            )}
          </div>

          {/* Custom Date Range (hanya untuk tipe custom) */}
          {tempFilters.tipe_periode === "custom" && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Tanggal Awal *</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={tempFilters.tanggal_awal}
                    onChange={(e) =>
                      handleFilterChange("tanggal_awal", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Tanggal Akhir *</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={tempFilters.tanggal_akhir}
                    onChange={(e) =>
                      handleFilterChange("tanggal_akhir", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-outline"
              onClick={handleClearFilters}
              disabled={isLoading}
            >
              Reset Filter
            </button>
            <button
              className="btn btn-primary"
              onClick={handleApplyFilters}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Memuat...
                </>
              ) : (
                "Terapkan Filter"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <StatistikChart height={500} />
        </div>
      </div>
    </div>
  );
};

export default StatistikPage;
