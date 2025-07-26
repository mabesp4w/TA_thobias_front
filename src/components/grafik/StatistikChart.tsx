/** @format */

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import useStatistikStore from "@/stores/api/Statistik"; // Sesuaikan path sesuai struktur folder Anda

// Dynamic import untuk ApexCharts (untuk Next.js)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatistikChartProps {
  height?: number;
}

const StatistikChart: React.FC<StatistikChartProps> = ({ height = 400 }) => {
  const {
    dtStatistikRingkasan,
    isLoading,
    error,
    fetchStatistikRingkasan,
    getChartData,
  } = useStatistikStore();

  const [chartOptions, setChartOptions] = useState<ApexOptions>({});
  const [chartSeries, setChartSeries] = useState<any[]>([]);

  // Fetch data saat komponen pertama kali dimount
  useEffect(() => {
    if (!dtStatistikRingkasan) {
      fetchStatistikRingkasan();
    }
  }, []);

  // Update chart data ketika data berubah
  useEffect(() => {
    if (dtStatistikRingkasan) {
      const { series, categories, detailData } = getChartData();

      const options: ApexOptions = {
        chart: {
          type: "bar",
          height: height,
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
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 400,
            },
            rotate: -45,
            maxHeight: 120,
          },
        },
        yaxis: {
          title: {
            text: "Rupiah (Rp)",
          },
          labels: {
            formatter: function (val: number) {
              return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(val);
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (val: number, { dataPointIndex }: any) {
              const detail = detailData[dataPointIndex];
              const formatCurrency = (value: number) =>
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(value);

              return `
                <div style="padding: 5px;">
                  <strong>${formatCurrency(val)}</strong><br/>
                  <small>Lokasi: ${detail?.lokasi || "N/A"}</small><br/>
                  <small>Alamat: ${detail?.alamat || "N/A"}</small><br/>
                  <small>Kecamatan: ${detail?.kecamatan || "N/A"}</small><br/>
                  <small>Kabupaten: ${detail?.kabupaten || "N/A"}</small><br/>
                  <small>Provinsi: ${detail?.provinsi || "N/A"}</small>
                </div>
              `;
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40,
        },
        colors: ["#00E396", "#FF4560"], // Hijau untuk pemasukan, Merah untuk pengeluaran
        grid: {
          borderColor: "#f1f1f1",
        },
        title: {
          text: "Statistik Pemasukan dan Pengeluaran per Lokasi",
          align: "center",
          style: {
            fontSize: "16px",
            fontWeight: "bold",
          },
        },
        subtitle: {
          text: dtStatistikRingkasan
            ? `Periode: ${dtStatistikRingkasan.periode_awal} - ${dtStatistikRingkasan.periode_akhir}`
            : "",
          align: "center",
          style: {
            fontSize: "12px",
            color: "#666",
          },
        },
      };

      setChartOptions(options);
      setChartSeries(series);
    }
  }, [dtStatistikRingkasan, height]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center" style={{ height }}>
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">Memuat data statistik...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (
    !dtStatistikRingkasan ||
    !dtStatistikRingkasan.statistik_per_lokasi.length
  ) {
    return (
      <div className="alert alert-info">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Tidak ada data statistik untuk ditampilkan</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={height}
      />

      {/* Summary info */}
      {dtStatistikRingkasan && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Total Pemasukan</div>
            <div className="stat-value text-success">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(parseFloat(dtStatistikRingkasan.total_pemasukan))}
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Total Pengeluaran</div>
            <div className="stat-value text-error">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(parseFloat(dtStatistikRingkasan.total_pengeluaran))}
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Keuntungan Bersih</div>
            <div className="stat-value text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(parseFloat(dtStatistikRingkasan.keuntungan_bersih))}
            </div>
            <div className="stat-desc">
              Margin: {dtStatistikRingkasan.margin_keuntungan}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatistikChart;
