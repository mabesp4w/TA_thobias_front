/** @format */

"use client";
import { useEffect, useState } from "react";
import { useWelcomeContext } from "@/context/WelcomeContext";
import useProdukTerjual from "@/stores/crud/ProdukTerjual";
import useProvinsi from "@/stores/crud/Provinsi";
import useKabupaten from "@/stores/crud/Kabupaten";
import moment from "moment";
import { BiBarChart, BiLineChart, BiPieChart } from "react-icons/bi";

const AnalisisPenjualanPage = () => {
  const { setWelcome } = useWelcomeContext();
  const { setProdukTerjual, dtProdukTerjual } = useProdukTerjual();
  const { setProvinsi, dtProvinsi } = useProvinsi();
  const { setKabupaten, dtKabupaten } = useKabupaten();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(1, "month").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
  });

  const [analisisData, setAnalisisData] = useState({
    totalPenjualan: 0,
    totalTransaksi: 0,
    rataRataPerTransaksi: 0,
    penjualanPerWilayah: [] as any[],
    penjualanPerKategori: [] as any[],
    penjualanPerUMKM: [] as any[],
    trendBulanan: [] as any[],
  });

  console.log({ dtProdukTerjual });

  useEffect(() => {
    setWelcome("Analisis Penjualan");
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    await Promise.all([
      setProdukTerjual({ page: 1, limit: 10000 }),
      setProvinsi({ page: 1, limit: 100 }),
      setKabupaten({ page: 1, limit: 1000 }),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (dtProdukTerjual?.data) {
      analyzeData();
    }
  }, [dtProdukTerjual, selectedProvinsi, selectedKabupaten, dateRange]);

  const analyzeData = () => {
    let filteredData = dtProdukTerjual?.data || [];

    // Filter by date range
    filteredData = filteredData.filter((item) => {
      const itemDate = moment(item.tgl_penjualan);
      return itemDate.isBetween(
        dateRange.startDate,
        dateRange.endDate,
        null,
        "[]"
      );
    });

    // Filter by selected province/district if any
    if (selectedProvinsi) {
      filteredData = filteredData.filter((item: any) => {
        // Pastikan mengakses properti yang benar berdasarkan struktur data
        return (
          item.lokasi_penjualan_detail?.kecamatan_detail?.kabupaten_detail
            ?.provinsi_detail?.id === selectedProvinsi
        );
      });
    }

    if (selectedKabupaten) {
      filteredData = filteredData.filter((item: any) => {
        return (
          item.lokasi_penjualan_detail?.kecamatan_detail?.kabupaten_detail
            ?.id === selectedKabupaten
        );
      });
    }

    // Calculate analysis
    const totalPenjualan = filteredData.reduce(
      (sum, item) => sum + (item.total_penjualan || 0),
      0
    );
    const totalTransaksi = filteredData.length;
    const rataRataPerTransaksi =
      totalTransaksi > 0 ? totalPenjualan / totalTransaksi : 0;

    // Penjualan per wilayah
    const penjualanPerWilayah = filteredData.reduce((acc: any, item: any) => {
      const lokasiName =
        item.lokasi_penjualan_detail?.nm_lokasi || "Tidak Diketahui";
      if (!acc[lokasiName]) {
        acc[lokasiName] = 0;
      }
      acc[lokasiName] += item.total_penjualan || 0;
      return acc;
    }, {});

    // Penjualan per kategori
    const penjualanPerKategori = filteredData.reduce((acc: any, item: any) => {
      const kategoriName =
        item.kategori_detail?.nm_kategori ||
        item.produk_detail?.kategori_detail?.nm_kategori ||
        "Tidak Diketahui";
      if (!acc[kategoriName]) {
        acc[kategoriName] = 0;
      }
      acc[kategoriName] += item.total_penjualan || 0;
      return acc;
    }, {});

    // Penjualan per UMKM
    const penjualanPerUMKM = filteredData.reduce((acc: any, item: any) => {
      const umkmName =
        item.umkm_detail?.nm_bisnis ||
        item.produk_detail?.umkm_detail?.nm_bisnis ||
        item.umkm_detail?.user_detail?.first_name ||
        "Tidak Diketahui";

      if (!acc[umkmName]) {
        acc[umkmName] = 0;
      }
      acc[umkmName] += item.total_penjualan || 0;
      return acc;
    }, {});

    // Trend bulanan
    const trendBulanan = filteredData.reduce((acc: any, item) => {
      const month = moment(item.tgl_penjualan).format("YYYY-MM");
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += item.total_penjualan || 0;
      return acc;
    }, {});

    setAnalisisData({
      totalPenjualan,
      totalTransaksi,
      rataRataPerTransaksi,
      penjualanPerWilayah: Object.entries(penjualanPerWilayah).map(
        ([name, value]) => ({ name, value })
      ),
      penjualanPerKategori: Object.entries(penjualanPerKategori).map(
        ([name, value]) => ({ name, value })
      ),
      penjualanPerUMKM: Object.entries(penjualanPerUMKM).map(
        ([name, value]) => ({ name, value })
      ),
      trendBulanan: Object.entries(trendBulanan).map(([month, value]) => ({
        month,
        value,
      })),
    });
  };
  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Analisis Penjualan</h1>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Filter Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Provinsi</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedProvinsi}
                onChange={(e) => setSelectedProvinsi(e.target.value)}
              >
                <option value="">Semua Provinsi</option>
                {dtProvinsi?.data?.map((prov: any) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nm_provinsi}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Kabupaten/Kota</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedKabupaten}
                onChange={(e) => setSelectedKabupaten(e.target.value)}
                disabled={!selectedProvinsi}
              >
                <option value="">Semua Kabupaten/Kota</option>
                {dtKabupaten?.data
                  ?.filter((kab: any) => kab.provinsi_id === selectedProvinsi)
                  ?.map((kab: any) => (
                    <option key={kab.id} value={kab.id}>
                      {kab.nm_kabupaten}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tanggal Mulai</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tanggal Akhir</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <BiBarChart className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Penjualan</div>
          <div className="stat-value text-primary">
            Rp {analisisData.totalPenjualan.toLocaleString()}
          </div>
          <div className="stat-desc">
            Periode: {dateRange.startDate} s/d {dateRange.endDate}
          </div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-secondary">
            <BiLineChart className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Transaksi</div>
          <div className="stat-value text-secondary">
            {analisisData.totalTransaksi.toLocaleString()}
          </div>
          <div className="stat-desc">Jumlah transaksi penjualan</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-accent">
            <BiPieChart className="w-8 h-8" />
          </div>
          <div className="stat-title">Rata-rata Per Transaksi</div>
          <div className="stat-value text-accent">
            Rp {Math.round(analisisData.rataRataPerTransaksi).toLocaleString()}
          </div>
          <div className="stat-desc">Nilai rata-rata per transaksi</div>
        </div>
      </div>

      {/* penjualan per umkm */}
      <div className="mt-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Penjualan per UMKM</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>UMKM</th>
                    <th>Total Penjualan</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {analisisData.penjualanPerUMKM
                    ?.sort((a: any, b: any) => b.value - a.value)
                    .map((item: any, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>Rp {item.value.toLocaleString()}</td>
                        <td>
                          {analisisData.totalPenjualan > 0
                            ? (
                                (item.value / analisisData.totalPenjualan) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Penjualan per Wilayah */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Penjualan per Wilayah</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Wilayah</th>
                    <th>Total Penjualan</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {analisisData.penjualanPerWilayah
                    .sort((a: any, b: any) => b.value - a.value)
                    .map((item: any, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>Rp {item.value.toLocaleString()}</td>
                        <td>
                          {analisisData.totalPenjualan > 0
                            ? (
                                (item.value / analisisData.totalPenjualan) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Penjualan per Kategori */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Penjualan per Kategori</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Total Penjualan</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {analisisData.penjualanPerKategori
                    .sort((a: any, b: any) => b.value - a.value)
                    .map((item: any, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>Rp {item.value.toLocaleString()}</td>
                        <td>
                          {analisisData.totalPenjualan > 0
                            ? (
                                (item.value / analisisData.totalPenjualan) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Bulanan */}
      <div className="mt-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Trend Penjualan Bulanan</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th>Total Penjualan</th>
                    <th>Perubahan</th>
                  </tr>
                </thead>
                <tbody>
                  {analisisData.trendBulanan
                    .sort((a: any, b: any) => a.month.localeCompare(b.month))
                    .map((item: any, index, array) => {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      const prevMonth = index > 0 ? array[index - 1].value : 0;
                      const change =
                        prevMonth > 0
                          ? ((item.value - prevMonth) / prevMonth) * 100
                          : 0;

                      return (
                        <tr key={index}>
                          <td>{moment(item.month).format("MMMM YYYY")}</td>
                          <td>Rp {item.value.toLocaleString()}</td>
                          <td>
                            {index > 0 && (
                              <span
                                className={
                                  change >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {change >= 0 ? "↑" : "↓"}{" "}
                                {Math.abs(change).toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisPenjualanPage;
