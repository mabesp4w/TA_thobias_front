/** @format */

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import useGrafikStore from "@/stores/api/GrafikApi";
import { ApexOptions } from "apexcharts";

// Dynamic import untuk ApexCharts agar tidak error saat SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartType = "line" | "bar" | "pie" | "donut";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

const GrafikPenjualan: React.FC = () => {
  const {
    dtGrafikPenjualan,
    dtGrafikPerUMKM,
    isLoading,
    error,
    filters,
    fetchGrafikPenjualan,
    fetchGrafikPerUMKM,
  } = useGrafikStore();

  const [chartType, setChartType] = useState<ChartType>("bar");
  const [showPerUMKM, setShowPerUMKM] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const chartRef = useRef<any>(null);

  // FIX 1: Handle filter changes - fetch appropriate data
  useEffect(() => {
    const refetchData = async () => {
      try {
        if (showPerUMKM) {
          await fetchGrafikPerUMKM();
        } else {
          await fetchGrafikPenjualan();
        }
      } catch (error) {
        console.error("Error refetching data on filter change:", error);
      }
    };

    // Only refetch if we have filters (avoid initial empty fetch)
    if (filters && Object.keys(filters).length > 0) {
      refetchData();
    }
  }, [filters]); // Dependency hanya filters, bukan showPerUMKM

  // FIX 2: Force re-render chart when data or settings change
  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, [dtGrafikPenjualan, dtGrafikPerUMKM, showPerUMKM, filters, chartType]);

  // FIX 3: Debug effect to track data changes (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("GrafikPenjualan Data Changed:", {
        showPerUMKM,
        dtGrafikPenjualan: dtGrafikPenjualan?.length || 0,
        dtGrafikPerUMKM: dtGrafikPerUMKM?.length || 0,
        filters,
        chartType,
      });
    }
  }, [dtGrafikPenjualan, dtGrafikPerUMKM, showPerUMKM, filters, chartType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(1)}M`;
    } else if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}Jt`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}Rb`;
    }
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // Data untuk grafik per UMKM (agregat per bulan)
  const getDataPerUMKM = () => {
    if (!dtGrafikPerUMKM || dtGrafikPerUMKM.length === 0) {
      return [];
    }

    const groupedData: { [key: string]: any } = {};

    dtGrafikPerUMKM.forEach((item) => {
      if (!item.nama_bulan || !item.tahun || !item.nama_umkm) {
        return;
      }

      const key = `${item.nama_bulan} ${item.tahun}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          periode: key,
          nama_bulan: item.nama_bulan,
          bulan: item.bulan,
          tahun: item.tahun,
        };
      }

      groupedData[key][item.nama_umkm] = item.total_penjualan || 0;
    });

    const sortedData = Object.values(groupedData).sort((a: any, b: any) => {
      if (a.tahun !== b.tahun) return a.tahun - b.tahun;
      return a.bulan - b.bulan;
    });

    return sortedData;
  };

  // Ambil unique UMKM names untuk series
  const getUMKMNames = () => {
    if (!dtGrafikPerUMKM || dtGrafikPerUMKM.length === 0) {
      return [];
    }

    const names = new Set(
      dtGrafikPerUMKM
        .filter((item) => item.nama_umkm)
        .map((item) => item.nama_umkm)
    );
    return Array.from(names);
  };

  // FIX 4: Improved toggle function
  const handleToggleView = async () => {
    setIsToggling(true);
    try {
      if (!showPerUMKM) {
        // Switching to per UMKM view
        await fetchGrafikPerUMKM();
        setChartType("line");
      } else {
        // Switching to combined view
        await fetchGrafikPenjualan();
        setChartType("bar");
      }
      setShowPerUMKM(!showPerUMKM);
    } catch (error) {
      console.error("Error toggling view:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // Prepare chart data and options
  const getChartConfig = () => {
    // FIX 5: Better data validation
    const hasValidData = showPerUMKM
      ? dtGrafikPerUMKM && dtGrafikPerUMKM.length > 0
      : dtGrafikPenjualan && dtGrafikPenjualan.length > 0;

    if (!hasValidData) {
      return {
        series: [],
        options: {
          chart: { type: chartType, height: 450 },
          noData: { text: "Tidak ada data untuk ditampilkan" },
        },
      };
    }

    if (chartType === "pie" || chartType === "donut") {
      let pieData: any[] = [];
      let pieLabels: string[] = [];

      if (showPerUMKM && dtGrafikPerUMKM.length > 0) {
        const umkmTotals: { [key: string]: number } = {};

        dtGrafikPerUMKM.forEach((item) => {
          if (umkmTotals[item.nama_umkm]) {
            umkmTotals[item.nama_umkm] += item.total_penjualan;
          } else {
            umkmTotals[item.nama_umkm] = item.total_penjualan;
          }
        });

        const sortedEntries = Object.entries(umkmTotals).sort(
          (a, b) => b[1] - a[1]
        );
        pieData = sortedEntries.map(([, value]) => value);
        pieLabels = sortedEntries.map(([name]) => name);
      } else {
        pieData = dtGrafikPenjualan.map((item) => item.total_penjualan);
        pieLabels = dtGrafikPenjualan.map((item) => item.nama_bulan);
      }

      return {
        series: pieData,
        options: {
          chart: {
            type: chartType,
            height: 450,
            animations: {
              enabled: true,
              easing: "easeinout",
              speed: 800,
            },
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false,
              },
            },
          },
          labels: pieLabels,
          colors: COLORS,
          plotOptions: {
            pie: {
              donut: {
                size: chartType === "donut" ? "50%" : "0%",
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: number) {
              return val.toFixed(1) + "%";
            },
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "12px",
            itemMargin: {
              horizontal: 5,
              vertical: 2,
            },
          },
          tooltip: {
            y: {
              formatter: function (val: number) {
                return formatCurrency(val);
              },
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  height: 350,
                },
                legend: {
                  position: "bottom",
                  fontSize: "10px",
                },
              },
            },
          ],
        },
      };
    }

    // For line and bar charts
    if (showPerUMKM && dtGrafikPerUMKM.length > 0) {
      const processedData = getDataPerUMKM();
      const umkmNames = getUMKMNames();

      const series = umkmNames.map((umkmName, index) => ({
        name: umkmName,
        data: processedData.map((item) => item[umkmName] || 0),
        color: COLORS[index % COLORS.length],
      }));

      const categories = processedData.map((item) => item.nama_bulan);

      return {
        series,
        options: {
          chart: {
            type: chartType,
            height: 450,
            animations: {
              enabled: true,
              easing: "easeinout",
              speed: 800,
            },
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: false,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "60%",
              endingShape: "rounded",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: chartType === "line" ? 3 : 0,
            colors: ["transparent"],
            curve: "smooth",
          },
          xaxis: {
            categories: categories,
            labels: {
              style: {
                fontSize: "12px",
              },
              rotate: -45,
            },
          },
          yaxis: {
            labels: {
              formatter: function (val: number) {
                return formatCurrencyCompact(val);
              },
              style: {
                fontSize: "12px",
              },
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val: number) {
                return formatCurrency(val);
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
            floating: false,
            fontSize: "12px",
            itemMargin: {
              horizontal: 10,
              vertical: 5,
            },
          },
          grid: {
            show: true,
            borderColor: "#e0e0e0",
            strokeDashArray: 3,
          },
          responsive: [
            {
              breakpoint: 768,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "80%",
                  },
                },
                legend: {
                  position: "bottom",
                  fontSize: "10px",
                },
              },
            },
          ],
        },
      };
    }

    // Single UMKM or all UMKM combined
    const series = [
      {
        name: "Total Penjualan",
        data: dtGrafikPenjualan.map((item) => item.total_penjualan),
        color: COLORS[0],
      },
    ];

    const categories = dtGrafikPenjualan.map((item) => item.nama_bulan);

    return {
      series,
      options: {
        chart: {
          type: "bar",
          height: 450,
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 0,
          colors: ["transparent"],
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: "12px",
            },
            rotate: -45,
          },
        },
        yaxis: {
          labels: {
            formatter: function (val: number) {
              return formatCurrencyCompact(val);
            },
            style: {
              fontSize: "12px",
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return formatCurrency(val);
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          floating: false,
          fontSize: "12px",
        },
        grid: {
          show: true,
          borderColor: "#e0e0e0",
          strokeDashArray: 3,
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              plotOptions: {
                bar: {
                  columnWidth: "80%",
                },
              },
            },
          },
        ],
      },
    };
  };

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Terjadi Kesalahan</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={() => fetchGrafikPenjualan()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const isLoadingAny = isLoading || isToggling;
  const chartConfig = getChartConfig();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Grafik Penjualan{" "}
            {showPerUMKM
              ? "Per UMKM"
              : filters.umkm_id
              ? "UMKM Terpilih"
              : "Semua UMKM"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Data penjualan tahun {filters.tahun || new Date().getFullYear()}
            {showPerUMKM &&
              dtGrafikPerUMKM.length > 0 &&
              ` (${getUMKMNames().length} UMKM)`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Toggle View */}
          {!filters.umkm_id && (
            <button
              onClick={handleToggleView}
              disabled={isLoadingAny}
              className={`px-4 py-2 rounded-md font-medium transition duration-200 flex items-center ${
                showPerUMKM
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } ${
                isLoadingAny
                  ? "disabled:opacity-50 disabled:cursor-not-allowed"
                  : ""
              }`}
            >
              {isToggling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Memuat...
                </>
              ) : showPerUMKM ? (
                "Lihat Total"
              ) : (
                "Bandingkan UMKM"
              )}
            </button>
          )}

          {/* Chart Type Selector */}
          <div className="flex bg-gray-100 rounded-md p-1">
            {(showPerUMKM
              ? (["line", "bar", "pie", "donut"] as ChartType[])
              : (["bar"] as ChartType[])
            ).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                disabled={isLoadingAny}
                className={`px-3 py-1 rounded text-sm font-medium transition duration-200 ${
                  chartType === type
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                } ${
                  isLoadingAny
                    ? "disabled:opacity-50 disabled:cursor-not-allowed"
                    : ""
                }`}
              >
                {type === "line"
                  ? "Garis"
                  : type === "bar"
                  ? "Batang"
                  : type === "pie"
                  ? "Pie"
                  : "Donut"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[500px] w-full">
        {isLoadingAny ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isToggling
                  ? "Mengubah tampilan grafik..."
                  : "Memuat data grafik..."}
              </p>
            </div>
          </div>
        ) : (
          <div key={chartKey}>
            {typeof window !== "undefined" && (
              <Chart
                ref={chartRef}
                options={chartConfig.options as ApexOptions}
                series={chartConfig.series}
                type={chartType}
                height={450}
              />
            )}
          </div>
        )}
      </div>

      {/* Data Info */}
      {!isLoadingAny && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Menampilkan{" "}
            {showPerUMKM ? dtGrafikPerUMKM.length : dtGrafikPenjualan.length}{" "}
            data penjualan
            {filters.umkm_id && " untuk UMKM terpilih"}
            {showPerUMKM &&
              !filters.umkm_id &&
              ` dari ${getUMKMNames().length} UMKM`}
          </p>
          {showPerUMKM && dtGrafikPerUMKM.length === 0 && (
            <p className="text-yellow-600 mt-1">
              Tidak ada data untuk perbandingan UMKM pada periode yang dipilih.
            </p>
          )}

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-xs text-gray-500">
              <p>Debug - Mode: {showPerUMKM ? "Per UMKM" : "Combined"}</p>
              <p>Debug - dtGrafikPenjualan: {dtGrafikPenjualan?.length || 0}</p>
              <p>Debug - dtGrafikPerUMKM: {dtGrafikPerUMKM?.length || 0}</p>
              {showPerUMKM && (
                <>
                  <p>Debug - Processed data: {getDataPerUMKM().length}</p>
                  <p>Debug - UMKM count: {getUMKMNames().length}</p>
                </>
              )}
              <p>Debug - Filters: {JSON.stringify(filters)}</p>
              <p>Debug - Chart Key: {chartKey}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GrafikPenjualan;
