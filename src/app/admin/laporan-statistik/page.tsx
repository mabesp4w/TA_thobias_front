/** @format */

"use client";
import { useEffect, useState } from "react";
import { useWelcomeContext } from "@/context/WelcomeContext";
import useProfilUMKM from "@/stores/crud/ProfilUMKMAdmin";
import useProduk from "@/stores/crud/Produk";
import useProdukTerjual from "@/stores/crud/ProdukTerjual";
import useProvinsi from "@/stores/crud/Provinsi";
import moment from "moment";
import { BiStore, BiPackage, BiMap, BiTrendingUp } from "react-icons/bi";

const LaporanStatistikPage = () => {
  const { setWelcome } = useWelcomeContext();
  const { setProfilUMKM, dtProfilUMKM } = useProfilUMKM();
  const { setProduk, dtProduk } = useProduk();
  const { setProdukTerjual, dtProdukTerjual } = useProdukTerjual();
  const { setProvinsi, dtProvinsi } = useProvinsi();

  const [isLoading, setIsLoading] = useState(true);
  const [statistik, setStatistik] = useState({
    totalUMKM: 0,
    umkmAktif: 0,
    totalProduk: 0,
    produkAktif: 0,
    totalPenjualan: 0,
    rataRataPenjualanPerUMKM: 0,
    wilayahTerjangkau: 0,
    kategoriProduk: 0,
    pertumbuhanUMKM: [],
    distribusiUMKM: [],
  });

  useEffect(() => {
    setWelcome("Laporan Statistik");
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      setProfilUMKM({ page: 1, limit: 10000 }),
      setProduk({ page: 1, limit: 10000 }),
      setProdukTerjual({ page: 1, limit: 10000 }),
      setProvinsi({ page: 1, limit: 100 }),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (dtProfilUMKM?.data && dtProduk?.data && dtProdukTerjual?.data) {
      calculateStatistics();
    }
  }, [dtProfilUMKM, dtProduk, dtProdukTerjual]);

  const calculateStatistics = () => {
    const umkmData = dtProfilUMKM?.data || [];
    const produkData = dtProduk?.data || [];
    const penjualanData = dtProdukTerjual?.data || [];

    // Total UMKM
    const totalUMKM = umkmData.length;
    const umkmAktif = umkmData.filter((umkm: any) => umkm.aktif).length;

    // Total Produk
    const totalProduk = produkData.length;
    const produkAktif = produkData.filter((prod: any) => prod.aktif).length;

    // Total Penjualan
    const totalPenjualan = penjualanData.reduce(
      (sum, item) => sum + (item.total_penjualan || 0),
      0
    );
    const rataRataPenjualanPerUMKM =
      totalUMKM > 0 ? totalPenjualan / totalUMKM : 0;

    // Wilayah terjangkau
    const wilayahSet = new Set(umkmData.map((umkm: any) => umkm.provinsi_id));
    const wilayahTerjangkau = wilayahSet.size;

    // Kategori produk
    const kategoriSet = new Set(
      produkData.map((prod: any) => prod.kategori_id)
    );
    const kategoriProduk = kategoriSet.size;

    // Pertumbuhan UMKM per bulan
    const pertumbuhanUMKM = umkmData.reduce((acc: any, umkm: any) => {
      const month = moment(umkm.tgl_bergabung).format("YYYY-MM");
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {});

    // Distribusi UMKM per provinsi
    const distribusiUMKM = umkmData.reduce((acc: any, umkm: any) => {
      const provinsiId = umkm.provinsi_id;
      if (!acc[provinsiId]) {
        acc[provinsiId] = {
          nama:
            dtProvinsi?.data.find((p: any) => p.id === provinsiId)
              ?.nm_provinsi || "Tidak Diketahui",
          jumlah: 0,
        };
      }
      acc[provinsiId].jumlah++;
      return acc;
    }, {});

    setStatistik({
      totalUMKM,
      umkmAktif,
      totalProduk,
      produkAktif,
      totalPenjualan,
      rataRataPenjualanPerUMKM,
      wilayahTerjangkau,
      kategoriProduk,
      pertumbuhanUMKM: Object.entries(pertumbuhanUMKM).map(
        ([month, count]) => ({ month, count })
      ),
      distribusiUMKM: Object.values(distribusiUMKM),
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
      <h1 className="text-2xl font-bold mb-6">Laporan Statistik</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <BiStore className="w-8 h-8" />
          </div>
          <div className="stat-title">Total UMKM</div>
          <div className="stat-value text-primary">{statistik.totalUMKM}</div>
          <div className="stat-desc">{statistik.umkmAktif} UMKM aktif</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-secondary">
            <BiPackage className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Produk</div>
          <div className="stat-value text-secondary">
            {statistik.totalProduk}
          </div>
          <div className="stat-desc">{statistik.produkAktif} produk aktif</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-accent">
            <BiTrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Penjualan</div>
          <div className="stat-value text-accent">
            Rp {(statistik.totalPenjualan / 1000000).toFixed(1)}M
          </div>
          <div className="stat-desc">Seluruh periode</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-info">
            <BiMap className="w-8 h-8" />
          </div>
          <div className="stat-title">Wilayah Terjangkau</div>
          <div className="stat-value text-info">
            {statistik.wilayahTerjangkau}
          </div>
          <div className="stat-desc">Provinsi</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pertumbuhan UMKM */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Pertumbuhan UMKM</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th>Jumlah UMKM Baru</th>
                    <th>Kumulatif</th>
                  </tr>
                </thead>
                <tbody>
                  {statistik.pertumbuhanUMKM
                    .sort((a: any, b: any) => a.month.localeCompare(b.month))
                    .reduce((acc: any[], item: any, index) => {
                      const kumulatif =
                        index > 0
                          ? acc[index - 1].kumulatif + item.count
                          : item.count;

                      acc.push({
                        ...item,
                        kumulatif,
                      });

                      return acc;
                    }, [])
                    .map((item: any, index) => (
                      <tr key={index}>
                        <td>{moment(item.month).format("MMMM YYYY")}</td>
                        <td>{item.count}</td>
                        <td>{item.kumulatif}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Distribusi UMKM per Provinsi */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Distribusi UMKM per Provinsi</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Provinsi</th>
                    <th>Jumlah UMKM</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {statistik.distribusiUMKM
                    .sort((a: any, b: any) => b.jumlah - a.jumlah)
                    .map((item: any, index) => (
                      <tr key={index}>
                        <td>{item.nama}</td>
                        <td>{item.jumlah}</td>
                        <td>
                          {statistik.totalUMKM > 0
                            ? (
                                (item.jumlah / statistik.totalUMKM) *
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

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button className="btn btn-primary">Export Laporan</button>
      </div>
    </div>
  );
};

export default LaporanStatistikPage;
