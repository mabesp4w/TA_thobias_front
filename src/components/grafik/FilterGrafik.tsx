/** @format */

import React, { useEffect, useState } from "react";
import useGrafikStore from "@/stores/api/GrafikApi";
import { FilterGrafikType } from "@/types/grafik";

const BULAN_OPTIONS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const PERIODE_OPTIONS = [
  { value: "pertahun", label: "Per Tahun" },
  { value: "perbulan", label: "Per Bulan" },
  { value: "periode", label: "Periode" },
];

type PeriodeType = "pertahun" | "perbulan" | "periode";

const FilterGrafik: React.FC = () => {
  const {
    filters,
    dtListUMKM,
    isLoading,
    isLoadingUMKM,
    isLoadingRingkasan,
    clearFilters,
    fetchListUMKM,
    applyFiltersAndFetch,
  } = useGrafikStore();

  const [localFilters, setLocalFilters] = useState<FilterGrafikType>(filters);
  const [isApplying, setIsApplying] = useState(false);
  const [tipeperiode, setTipePeriode] = useState<PeriodeType>("pertahun");
  const [selectedBulan, setSelectedBulan] = useState<number | undefined>(
    undefined
  );

  // Load list UMKM saat komponen mount
  useEffect(() => {
    fetchListUMKM();
  }, [fetchListUMKM]);

  // Sync local filters dengan store
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Generate tahun options (10 tahun terakhir)
  const currentYear = new Date().getFullYear();
  const tahunOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleFilterChange = (key: keyof FilterGrafikType, value: any) => {
    const newFilters = {
      ...localFilters,
      [key]: value === "" ? undefined : value,
    };
    setLocalFilters(newFilters);
  };

  const handleTipePeriodeChange = (newTipe: PeriodeType) => {
    setTipePeriode(newTipe);

    // Reset filter berdasarkan tipe periode
    const updatedFilters = { ...localFilters };

    switch (newTipe) {
      case "pertahun":
        // Hanya tahun, reset bulan
        updatedFilters.bulan_start = undefined;
        updatedFilters.bulan_end = undefined;
        setSelectedBulan(undefined);
        break;
      case "perbulan":
        // Tahun dan bulan yang sama untuk start dan end
        if (selectedBulan) {
          updatedFilters.bulan_start = selectedBulan;
          updatedFilters.bulan_end = selectedBulan;
        } else {
          updatedFilters.bulan_start = undefined;
          updatedFilters.bulan_end = undefined;
        }
        break;
      case "periode":
        // Biarkan user pilih bulan_start dan bulan_end secara terpisah
        // Jika sebelumnya perbulan, reset bulan_end agar tidak sama dengan start
        if (updatedFilters.bulan_start === updatedFilters.bulan_end) {
          updatedFilters.bulan_end = undefined;
        }
        setSelectedBulan(undefined);
        break;
    }

    setLocalFilters(updatedFilters);
  };

  const handleBulanChange = (bulan: number | undefined) => {
    setSelectedBulan(bulan);

    if (tipeperiode === "perbulan") {
      // Untuk perbulan, bulan_start dan bulan_end sama
      setLocalFilters({
        ...localFilters,
        bulan_start: bulan,
        bulan_end: bulan,
      });
    }
  };

  const handleApplyFilter = async () => {
    setIsApplying(true);
    try {
      await applyFiltersAndFetch(localFilters);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearFilter = async () => {
    const defaultFilters = { tahun: currentYear };
    setLocalFilters(defaultFilters);
    setTipePeriode("pertahun");
    setSelectedBulan(undefined);
    clearFilters();

    setIsApplying(true);
    try {
      await applyFiltersAndFetch(defaultFilters);
    } catch (error) {
      console.error("Error clearing filters:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const isLoadingAny = isLoading || isLoadingRingkasan || isApplying;

  const renderPeriodeFields = () => {
    switch (tipeperiode) {
      case "pertahun":
        return null; // Hanya menampilkan tahun

      case "perbulan":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulan
            </label>
            <select
              value={selectedBulan || ""}
              onChange={(e) =>
                handleBulanChange(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingAny}
            >
              <option value="">Pilih Bulan</option>
              {BULAN_OPTIONS.map((bulan) => (
                <option key={bulan.value} value={bulan.value}>
                  {bulan.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "periode":
        return (
          <>
            {/* Filter Bulan Mulai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulan Mulai
              </label>
              <select
                value={localFilters.bulan_start || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "bulan_start",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoadingAny}
              >
                <option value="">Pilih Bulan Mulai</option>
                {BULAN_OPTIONS.map((bulan) => (
                  <option key={bulan.value} value={bulan.value}>
                    {bulan.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Bulan Akhir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulan Akhir
              </label>
              <select
                value={localFilters.bulan_end || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "bulan_end",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!localFilters.bulan_start || isLoadingAny}
              >
                <option value="">Sampai Akhir Tahun</option>
                {BULAN_OPTIONS.filter(
                  (bulan) =>
                    !localFilters.bulan_start ||
                    bulan.value >= localFilters.bulan_start
                ).map((bulan) => (
                  <option key={bulan.value} value={bulan.value}>
                    {bulan.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getGridCols = () => {
    switch (tipeperiode) {
      case "pertahun":
        return "lg:grid-cols-4"; // UMKM, Tipe Periode, Tahun, Buttons
      case "perbulan":
        return "lg:grid-cols-5"; // UMKM, Tipe Periode, Tahun, Bulan, Buttons
      case "periode":
        return "lg:grid-cols-6"; // UMKM, Tipe Periode, Tahun, Bulan Mulai, Bulan Akhir, Buttons
      default:
        return "lg:grid-cols-4";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filter Grafik Penjualan
      </h3>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridCols()} gap-4`}>
        {/* Filter UMKM */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UMKM
          </label>
          <select
            value={localFilters.umkm_id || ""}
            onChange={(e) => handleFilterChange("umkm_id", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoadingUMKM || isLoadingAny}
          >
            <option value="">Semua UMKM</option>
            {dtListUMKM.map((umkm) => (
              <option key={umkm.id} value={umkm.id}>
                {umkm.nama_umkm}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tipe Periode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Periode
          </label>
          <select
            value={tipeperiode}
            onChange={(e) =>
              handleTipePeriodeChange(e.target.value as PeriodeType)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoadingAny}
          >
            {PERIODE_OPTIONS.map((periode) => (
              <option key={periode.value} value={periode.value}>
                {periode.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tahun */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tahun
          </label>
          <select
            value={localFilters.tahun || currentYear}
            onChange={(e) =>
              handleFilterChange("tahun", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoadingAny}
          >
            {tahunOptions.map((tahun) => (
              <option key={tahun} value={tahun}>
                {tahun}
              </option>
            ))}
          </select>
        </div>

        {/* Render periode fields berdasarkan tipe */}
        {renderPeriodeFields()}

        {/* Action Buttons */}
        <div className="flex flex-col justify-end space-y-2">
          <button
            onClick={handleApplyFilter}
            disabled={isLoadingAny}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            {isLoadingAny ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memuat...
              </>
            ) : (
              "Terapkan Filter"
            )}
          </button>
          <button
            onClick={handleClearFilter}
            disabled={isLoadingAny}
            className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Info Filter Aktif */}
      {(localFilters.umkm_id ||
        localFilters.bulan_start ||
        localFilters.bulan_end ||
        tipeperiode !== "pertahun") && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Filter Aktif:</span>
            <span className="ml-2 inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
              Periode:{" "}
              {PERIODE_OPTIONS.find((p) => p.value === tipeperiode)?.label}
            </span>
            {localFilters.umkm_id && (
              <span className="ml-2 inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                UMKM:{" "}
                {
                  dtListUMKM.find((u) => u.id === localFilters.umkm_id)
                    ?.nama_umkm
                }
              </span>
            )}
            {tipeperiode === "perbulan" && selectedBulan && (
              <span className="ml-2 inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                Bulan:{" "}
                {BULAN_OPTIONS.find((b) => b.value === selectedBulan)?.label}
              </span>
            )}
            {tipeperiode === "periode" && localFilters.bulan_start && (
              <span className="ml-2 inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                Mulai:{" "}
                {
                  BULAN_OPTIONS.find(
                    (b) => b.value === localFilters.bulan_start
                  )?.label
                }
              </span>
            )}
            {tipeperiode === "periode" && localFilters.bulan_end && (
              <span className="ml-2 inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                Sampai:{" "}
                {
                  BULAN_OPTIONS.find((b) => b.value === localFilters.bulan_end)
                    ?.label
                }
              </span>
            )}
          </p>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoadingAny && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-800 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            Sedang memuat data dengan filter baru...
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterGrafik;
