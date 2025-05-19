/** @format */

"use client";
import { useEffect, useState } from "react";
import { useWelcomeContext } from "@/context/WelcomeContext";
import useProdukTerjual from "@/stores/crud/ProdukTerjual";
import useProduk from "@/stores/crud/Produk";
import useLokasiPenjualan from "@/stores/crud/LokasiPenjualan";
import moment from "moment";
import {
  BiCart,
  BiPackage,
  BiLocationPlus,
  BiTrendingUp,
} from "react-icons/bi";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const StatistikPage = () => {
  const { setWelcome } = useWelcomeContext();
  const { setMySales, dtProdukTerjual } = useProdukTerjual();
  const { setMyProduk, dtProduk } = useProduk();
  const { setLokasiPenjualan, dtLokasiPenjualan } = useLokasiPenjualan();

  // state
  const [isLoading, setIsLoading] = useState(true);
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [penjualanBulanIni, setPenjualanBulanIni] = useState(0);
  const [produkTerlaris, setProdukTerlaris] = useState<any[]>([]);
  const [lokasiTerbaik, setLokasiTerbaik] = useState<any[]>([]);
  const [dataBulanan, setDataBulanan] = useState<any[]>([]);

  useEffect(() => {
    setWelcome("Statistik Bisnis");
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      setMySales({ page: 1, limit: 1000 }),
      setMyProduk({ page: 1, limit: 100 }),
      setLokasiPenjualan({ page: 1, limit: 100 }),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (dtProdukTerjual?.data) {
      calculateStatistics();
    }
  }, [dtProdukTerjual]);

  // Grafik penjualan bulanan
  const calculateMonthlyData = () => {
    const data = dtProdukTerjual?.data || [];

    // Grouping data berdasarkan bulan
    const monthlyData: Record<string, number> = {};

    // Dapatkan rentang bulan dari data (maksimal 12 bulan terakhir)
    const endDate = moment();
    const startDate = moment().subtract(11, "months");

    // Inisialisasi semua bulan dengan nilai 0
    for (
      let m = moment(startDate);
      m.isSameOrBefore(endDate);
      m.add(1, "month")
    ) {
      const monthKey = m.format("YYYY-MM");
      monthlyData[monthKey] = 0;
    }

    // Hitung total penjualan per bulan
    data.forEach((item) => {
      const monthKey = moment(item.tgl_penjualan).format("YYYY-MM");
      // Hanya masukkan data dalam 12 bulan terakhir
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += item.total_penjualan || 0;
      }
    });

    // Konversi ke format data untuk Recharts dengan format tanggal lengkap
    const formattedData = Object.keys(monthlyData).map((month) => {
      const momentDate = moment(month, "YYYY-MM");
      return {
        bulan: momentDate.format("MMM YY"),
        penjualan: monthlyData[month],
        // Tambahkan property sortDate untuk pengurutan
        sortDate: momentDate.valueOf(),
      };
    });

    // Sort by date - dari bulan terlama ke terbaru (kiri ke kanan)
    formattedData.sort((a, b) => a.sortDate - b.sortDate);

    setDataBulanan(formattedData);
  };

  const calculateStatistics = () => {
    calculateMonthlyData();
    const data = dtProdukTerjual?.data || [];

    // Total penjualan
    const total = data.reduce(
      (sum, item) => sum + (item.total_penjualan || 0),
      0
    );
    setTotalPenjualan(total);

    // Penjualan bulan ini
    const currentMonth = moment().format("YYYY-MM");
    const thisMonthSales = data
      .filter(
        (item) => moment(item.tgl_penjualan).format("YYYY-MM") === currentMonth
      )
      .reduce((sum, item) => sum + (item.total_penjualan || 0), 0);
    setPenjualanBulanIni(thisMonthSales);

    // Produk terlaris (by quantity)
    const productSales = data.reduce((acc: any, item) => {
      const produkId = item.produk;
      if (!acc[produkId]) {
        acc[produkId] = {
          produk: item.produk,
          produk_detail: item.produk_detail,
          jumlah: 0,
          total: 0,
        };
      }
      acc[produkId].jumlah += item.jumlah_terjual;
      acc[produkId].total += item.total_penjualan || 0;
      return acc;
    }, {});

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.jumlah - a.jumlah)
      .slice(0, 5);
    setProdukTerlaris(topProducts);

    // Lokasi penjualan terbaik
    const locationSales = data.reduce((acc: any, item) => {
      const lokasiId = item.lokasi_penjualan;
      if (!acc[lokasiId]) {
        acc[lokasiId] = {
          lokasi: item.lokasi_penjualan,
          lokasi_detail: item.lokasi_penjualan_detail,
          jumlah: 0,
          total: 0,
        };
      }
      acc[lokasiId].jumlah += 1;
      acc[lokasiId].total += item.total_penjualan || 0;
      return acc;
    }, {});

    const topLocations = Object.values(locationSales)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 5);
    setLokasiTerbaik(topLocations);
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
      <h1 className="text-2xl font-bold mb-6">Statistik Bisnis</h1>

      {/* Ringkasan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <BiCart className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Penjualan</div>
          <div className="stat-value text-primary">
            Rp {totalPenjualan.toLocaleString()}
          </div>
          <div className="stat-desc">Seluruh periode</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-secondary">
            <BiTrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Penjualan Bulan Ini</div>
          <div className="stat-value text-secondary">
            Rp {penjualanBulanIni.toLocaleString()}
          </div>
          <div className="stat-desc">{moment().format("MMMM YYYY")}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-accent">
            <BiPackage className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Produk</div>
          <div className="stat-value text-accent">
            {dtProduk?.data?.length || 0}
          </div>
          <div className="stat-desc">Produk aktif</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-info">
            <BiLocationPlus className="w-8 h-8" />
          </div>
          <div className="stat-title">Lokasi Penjualan</div>
          <div className="stat-value text-info">
            {dtLokasiPenjualan?.data?.length || 0}
          </div>
          <div className="stat-desc">Lokasi aktif</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produk Terlaris */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">5 Produk Terlaris</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Jumlah Terjual</th>
                    <th>Total Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  {produkTerlaris.map((item: any, index) => (
                    <tr key={index}>
                      <td>{item.produk_detail?.nm_produk}</td>
                      <td>{item.jumlah}</td>
                      <td>Rp {item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lokasi Penjualan Terbaik */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">5 Lokasi Penjualan Terbaik</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Lokasi</th>
                    <th>Jumlah Transaksi</th>
                    <th>Total Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  {lokasiTerbaik.map((item: any, index) => (
                    <tr key={index}>
                      <td>{item.lokasi_detail?.nm_lokasi}</td>
                      <td>{item.jumlah}</td>
                      <td>Rp {item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik Penjualan Bulanan */}
      <div className="mt-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              Grafik Penjualan Bulanan {moment().year()}
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataBulanan}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis
                    tickFormatter={(value) =>
                      `Rp${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `Rp${value.toLocaleString()}`,
                      "Penjualan",
                    ]}
                    labelFormatter={(label) => `Bulan: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="penjualan"
                    name="Total Penjualan"
                    fill="#8884d8"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistikPage;
