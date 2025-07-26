/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";

// Types untuk data statistik
interface StatistikPerLokasi {
  lokasi_id: string;
  nama_lokasi: string;
  alamat: string;
  kategori_lokasi: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  total_transaksi: number;
  total_produk_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_bersih: string;
  margin_keuntungan: string;
  produk_terlaris: string;
  jumlah_produk_terlaris: number;
}

interface StatistikPerProduk {
  produk_id: string;
  nama_produk: string;
  kategori: string;
  satuan: string;
  harga_jual_rata_rata: string;
  total_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_per_produk: string;
}

interface StatistikPerPeriode {
  periode: string;
  label_periode: string;
  total_transaksi: number;
  total_produk_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_bersih: string;
  margin_keuntungan: string;
}

interface StatistikRingkasan {
  periode_awal: string;
  periode_akhir: string;
  total_transaksi: number;
  total_produk_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_bersih: string;
  margin_keuntungan: string;
  rata_rata_transaksi_per_hari: string;
  rata_rata_pemasukan_per_hari: string;
  statistik_per_lokasi: StatistikPerLokasi[];
  statistik_per_produk: StatistikPerProduk[];
  statistik_per_periode: StatistikPerPeriode[];
}

interface FilterStatistik {
  tipe_periode?: "bulanan" | "tahunan" | "custom";
  tahun?: number;
  bulan?: number;
  tanggal_awal?: string;
  tanggal_akhir?: string;
  lokasi_id?: string;
  produk_id?: string;
}

type StatistikStore = {
  // Data state
  dtStatistikRingkasan: StatistikRingkasan | null;

  // Filter state
  filters: FilterStatistik;

  // Loading state
  isLoading: boolean;

  // Error state
  error: string | null;

  // Actions
  setFilters: (filters: FilterStatistik) => void;
  clearFilters: () => void;

  // API calls
  fetchStatistikRingkasan: (customFilters?: FilterStatistik) => Promise<{
    status: string;
    data?: StatistikRingkasan;
    error?: any;
  }>;

  // Combined action untuk apply filter dan fetch data
  applyFiltersAndFetch: (newFilters: FilterStatistik) => Promise<void>;

  // Helper untuk format data chart
  getChartData: () => {
    series: Array<{
      name: string;
      data: number[];
    }>;
    categories: string[];
    detailData: Array<{
      lokasi: string;
      pemasukan: number;
      pengeluaran: number;
      alamat: string;
      kecamatan: string;
      kabupaten: string;
      provinsi: string;
    }>;
  };
};

const useStatistikStore = create(
  devtools<StatistikStore>((set, get) => ({
    // Initial state
    dtStatistikRingkasan: null,

    filters: {
      tipe_periode: "bulanan",
      tahun: new Date().getFullYear(),
    },

    isLoading: false,
    error: null,

    // Filter actions
    setFilters: (filters: FilterStatistik) => {
      set((state) => ({
        ...state,
        filters: { ...state.filters, ...filters },
        error: null,
      }));
    },

    clearFilters: () => {
      set((state) => ({
        ...state,
        filters: {
          tipe_periode: "bulanan",
          tahun: new Date().getFullYear(),
        },
        error: null,
      }));
    },

    // Combined action untuk apply filter dan fetch data
    applyFiltersAndFetch: async (newFilters: FilterStatistik) => {
      // Update filters first
      set((state) => ({
        ...state,
        filters: { ...state.filters, ...newFilters },
        error: null,
      }));

      // Fetch data dengan filters baru
      const { fetchStatistikRingkasan } = get();

      try {
        await fetchStatistikRingkasan(newFilters);
      } catch (error) {
        console.error("Error fetching data with new filters:", error);
      }
    },

    // Fetch statistik ringkasan
    fetchStatistikRingkasan: async (customFilters?: FilterStatistik) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      // Gunakan customFilters jika ada, otherwise gunakan filters dari store
      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoading: true, error: null }));

      try {
        // Build query parameters
        const params = new URLSearchParams();

        // tipe_periode dan tahun wajib untuk bulanan/tahunan
        if (filters.tipe_periode) {
          params.append("tipe_periode", filters.tipe_periode);
        }

        if (filters.tahun) {
          params.append("tahun", filters.tahun.toString());
        }

        if (filters.bulan) {
          params.append("bulan", filters.bulan.toString());
        }

        if (filters.tanggal_awal) {
          params.append("tanggal_awal", filters.tanggal_awal);
        }

        if (filters.tanggal_akhir) {
          params.append("tanggal_akhir", filters.tanggal_akhir);
        }

        if (filters.lokasi_id) {
          params.append("lokasi_id", filters.lokasi_id);
        }

        if (filters.produk_id) {
          params.append("produk_id", filters.produk_id);
        }

        console.log(
          "Fetching statistik ringkasan with params:",
          params.toString()
        );

        const response = await api({
          method: "get",
          url: `/statistik/ringkasan/?${params.toString()}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtStatistikRingkasan: response.data.data,
          isLoading: false,
        }));

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Terjadi kesalahan";
        set((state) => ({
          ...state,
          isLoading: false,
          error: errorMessage,
        }));

        return {
          status: "error",
          error: errorMessage,
        };
      }
    },

    // Helper untuk format data chart
    getChartData: () => {
      const { dtStatistikRingkasan } = get();

      if (!dtStatistikRingkasan || !dtStatistikRingkasan.statistik_per_lokasi) {
        return {
          series: [],
          categories: [],
          detailData: [],
        };
      }

      const statistikPerLokasi = dtStatistikRingkasan.statistik_per_lokasi;

      // Buat categories (nama lokasi)
      const categories = statistikPerLokasi.map((item) => item.nama_lokasi);

      // Buat series data
      const pemasukanData = statistikPerLokasi.map((item) =>
        parseFloat(item.total_pemasukan)
      );

      const pengeluaranData = statistikPerLokasi.map((item) =>
        parseFloat(item.total_pengeluaran)
      );

      const series = [
        {
          name: "Total Pemasukan",
          data: pemasukanData,
        },
        {
          name: "Total Pengeluaran",
          data: pengeluaranData,
        },
      ];

      // Detail data untuk tooltip
      const detailData = statistikPerLokasi.map((item) => ({
        lokasi: item.nama_lokasi,
        pemasukan: parseFloat(item.total_pemasukan),
        pengeluaran: parseFloat(item.total_pengeluaran),
        alamat: item.alamat,
        kecamatan: item.kecamatan,
        kabupaten: item.kabupaten,
        provinsi: item.provinsi,
      }));

      return {
        series,
        categories,
        detailData,
      };
    },
  }))
);

export default useStatistikStore;
