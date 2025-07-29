/** @format */
// components/grafik/GrafikPenjualan.tsx
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import useGrafikStore from "@/stores/api/GrafikApi";
import { ApexOptions } from "apexcharts";
import LokasiBreakdownModal from "./LokasiBreakdownModal";

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

  // State untuk modal lokasi breakdown
  const [modalLokasiData, setModalLokasiData] = useState<any>(null);
  const [showModalLokasi, setShowModalLokasi] = useState(false);

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

  // Function untuk handle modal lokasi breakdown
  const handleShowAllLocations = (dataItem: any, hiddenLocations: any[]) => {
    setModalLokasiData({
      umkmData: dataItem,
      allLocations: dataItem.breakdown_lokasi || [],
      hiddenLocations: hiddenLocations,
    });
    setShowModalLokasi(true);
  };

  // Function untuk close modal
  const handleCloseModal = () => {
    setShowModalLokasi(false);
    setModalLokasiData(null);
  };

  // Helper function untuk membuat custom tooltip
  const createCustomTooltip = (dataIndex: number, seriesName?: string) => {
    let dataItem: any = null;

    if (showPerUMKM && dtGrafikPerUMKM.length > 0) {
      // Untuk mode per UMKM, cari data berdasarkan nama UMKM dan index
      const processedData = getDataPerUMKM();
      if (processedData[dataIndex]) {
        const periode = processedData[dataIndex].periode;
        const umkmName = seriesName || "";

        // Cari data asli berdasarkan periode dan nama UMKM
        dataItem = dtGrafikPerUMKM.find(
          (item) =>
            `${item.nama_bulan} ${item.tahun}` === periode &&
            item.nama_umkm === umkmName
        );
      }
    } else {
      // Untuk mode single/combined, ambil dari dtGrafikPenjualan
      dataItem = dtGrafikPenjualan[dataIndex];
    }

    return dataItem;
  };

  // Enhanced tooltip formatter
  const getEnhancedTooltip = () => {
    return {
      enabled: true,
      shared: true,
      intersect: false,
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
      custom: function ({ seriesIndex, dataPointIndex, w }: any) {
        const dataItem = createCustomTooltip(
          dataPointIndex,
          w.config.series[seriesIndex]?.name
        );

        if (!dataItem) {
          return `<div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; color: #6b7280;">Data tidak tersedia</div>
                  </div>`;
        }

        const totalPenjualan = parseFloat(dataItem.total_penjualan || 0);
        const totalPengeluaran = parseFloat(dataItem.total_pengeluaran || 0);
        const breakdownLokasi = dataItem.breakdown_lokasi || [];

        // Batasi lokasi yang ditampilkan untuk menghindari overflow
        const maxDisplayLocations = 2;
        const displayedLocations = breakdownLokasi.slice(
          0,
          maxDisplayLocations
        );
        const hiddenCount = breakdownLokasi.length - maxDisplayLocations;

        let tooltipContent = `
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; min-width: 320px; max-width: 400px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
              ${dataItem.nama_umkm || "Data Penjualan"} - ${
          dataItem.nama_bulan
        } ${dataItem.tahun}
            </div>
            
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 12px; color: #6b7280;">Total Penjualan:</span>
                <span style="font-weight: 500; color: #059669; font-size: 12px;">${formatCurrency(
                  totalPenjualan
                )}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 12px; color: #6b7280;">Total Pengeluaran:</span>
                <span style="font-weight: 500; color: #dc2626; font-size: 12px;">${formatCurrency(
                  totalPengeluaran
                )}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #6b7280;">Produk Terjual:</span>
                <span style="font-weight: 500; color: #1f2937; font-size: 12px;">${
                  dataItem.total_produk_terjual || 0
                }</span>
              </div>
            </div>`;

        // Tambahkan breakdown lokasi jika ada
        if (breakdownLokasi.length > 0) {
          tooltipContent += `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
              <div style="font-weight: 500; color: #374151; margin-bottom: 8px; font-size: 12px;">
                Lokasi ${
                  breakdownLokasi.length > maxDisplayLocations
                    ? `(${maxDisplayLocations} dari ${breakdownLokasi.length})`
                    : ""
                }:
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">`;

          displayedLocations.forEach((lokasi: any) => {
            const penjualanLokasi = parseFloat(lokasi.total_penjualan || 0);
            const pengeluaranLokasi = parseFloat(lokasi.total_pengeluaran || 0);

            tooltipContent += `
              <div style="background: #f9fafb; padding: 8px; border-radius: 6px; border: 1px solid #f3f4f6;">
                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px; font-size: 11px; line-height: 1.3;">
                  ${lokasi.nama_lokasi}
                </div>
                <div style="color: #6b7280; margin-bottom: 6px; font-size: 10px; line-height: 1.3;">
                  ${lokasi.alamat_lokasi}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 10px;">
                  <div>
                    <div style="color: #6b7280; margin-bottom: 2px;">Penjualan:</div>
                    <div style="font-weight: 500; color: #059669;">${formatCurrency(
                      penjualanLokasi
                    )}</div>
                  </div>
                  <div>
                    <div style="color: #6b7280; margin-bottom: 2px;">Pengeluaran:</div>
                    <div style="font-weight: 500; color: #dc2626;">${formatCurrency(
                      pengeluaranLokasi
                    )}</div>
                  </div>
                </div>
              </div>`;
          });

          // Tambahkan instruksi click jika ada lokasi yang tersembunyi
          if (hiddenCount > 0) {
            tooltipContent += `
              <div style="text-align: center; margin-top: 8px; padding: 8px; background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 6px;">
                <div style="font-size: 10px; color: #0369a1; font-weight: 500; margin-bottom: 2px;">
                  📍 ${hiddenCount} lokasi lainnya tersedia
                </div>
                <div style="font-size: 9px; color: #0369a1;">
                  Klik pada titik grafik ini untuk melihat semua lokasi
                </div>
              </div>`;
          }

          tooltipContent += `</div></div>`;
        }

        tooltipContent += `</div>`;
        return tooltipContent;
      },
    };
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

  // Chart click handler
  const handleChartClick = (
    dataPointIndex: number,
    seriesIndex: number,
    chartContext: any
  ) => {
    if (dataPointIndex === -1 || dataPointIndex === undefined) return;

    let dataItem: any = null;

    if (chartType === "pie" || chartType === "donut") {
      // Untuk pie/donut chart
      if (showPerUMKM && dtGrafikPerUMKM.length > 0) {
        const umkmNames = getUMKMNames();
        const umkmName = umkmNames[dataPointIndex];
        // Ambil data pertama dari UMKM tersebut untuk modal
        dataItem = dtGrafikPerUMKM.find((item) => item.nama_umkm === umkmName);
      } else {
        dataItem = dtGrafikPenjualan[dataPointIndex];
      }
    } else {
      // Untuk line/bar chart
      if (showPerUMKM && dtGrafikPerUMKM.length > 0) {
        const processedData = getDataPerUMKM();
        if (processedData[dataPointIndex]) {
          const periode = processedData[dataPointIndex].periode;
          const seriesName =
            chartContext.w.config.series[seriesIndex]?.name || "";

          dataItem = dtGrafikPerUMKM.find(
            (item) =>
              `${item.nama_bulan} ${item.tahun}` === periode &&
              item.nama_umkm === seriesName
          );
        }
      } else {
        dataItem = dtGrafikPenjualan[dataPointIndex];
      }
    }

    // Tampilkan modal jika ada breakdown lokasi
    if (
      dataItem &&
      dataItem.breakdown_lokasi &&
      dataItem.breakdown_lokasi.length > 0
    ) {
      handleShowAllLocations(dataItem, []);
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

    // Event handler untuk semua jenis chart
    const chartEvents = {
      dataPointSelection: function (
        event: any,
        chartContext: any,
        config: any
      ) {
        handleChartClick(
          config.dataPointIndex,
          config.seriesIndex,
          chartContext
        );
      },
      plotAreaClick: function (event: any, chartContext: any, config: any) {
        // Fallback untuk chart yang tidak support dataPointSelection
        if (chartType === "pie" || chartType === "donut") {
          // Untuk pie/donut, coba ambil dari event target
          const dataPointIndex = config.dataPointIndex || 0;
          handleChartClick(dataPointIndex, 0, chartContext);
        }
      },
    };

    // Base chart options dengan events
    const baseChartOptions = {
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
          zoom: chartType !== "pie" && chartType !== "donut",
          zoomin: chartType !== "pie" && chartType !== "donut",
          zoomout: chartType !== "pie" && chartType !== "donut",
          pan: chartType !== "pie" && chartType !== "donut",
          reset: chartType !== "pie" && chartType !== "donut",
        },
      },
      events: chartEvents,
    };

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
          chart: baseChartOptions,
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
          tooltip: getEnhancedTooltip(),
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
          chart: baseChartOptions,
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
          tooltip: getEnhancedTooltip(),
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
        chart: baseChartOptions,
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
        tooltip: getEnhancedTooltip(),
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
    <>
      {/* Modal Lokasi Breakdown */}
      {showModalLokasi && modalLokasiData && (
        <LokasiBreakdownModal
          data={modalLokasiData}
          onClose={handleCloseModal}
          formatCurrency={formatCurrency}
        />
      )}

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
            <p className="text-xs text-gray-500 mt-1">
              💡 Hover pada grafik untuk melihat detail penjualan, pengeluaran,
              dan lokasi penjualan
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

            {/* Instruksi untuk user */}
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <span className="mr-1">🖱️</span>
              Klik pada titik grafik untuk melihat detail lokasi penjualan
            </p>

            {showPerUMKM && dtGrafikPerUMKM.length === 0 && (
              <p className="text-yellow-600 mt-1">
                Tidak ada data untuk perbandingan UMKM pada periode yang
                dipilih.
              </p>
            )}

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Debug - Mode: {showPerUMKM ? "Per UMKM" : "Combined"}</p>
                <p>
                  Debug - dtGrafikPenjualan: {dtGrafikPenjualan?.length || 0}
                </p>
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
    </>
  );
};

export default GrafikPenjualan;
