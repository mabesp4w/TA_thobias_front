/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";

// Types untuk statistik
export type StatistikLokasiType = {
  lokasi_id: string;
  nama_lokasi: string;
  alamat: string;
  kategori_lokasi: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  total_transaksi: number;
  total_produk_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_bersih: string;
  margin_keuntungan: string | null;
  produk_terlaris: string | null;
  jumlah_produk_terlaris: number;
};

export type StatistikProdukType = {
  produk_id: string;
  nama_produk: string;
  kategori: string;
  satuan: string;
  harga_jual_rata_rata: string;
  total_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_per_produk: string;
};

export type StatistikPeriodeType = {
  periode: string;
  label_periode: string;
  total_transaksi: number;
  total_produk_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_bersih: string;
  margin_keuntungan: string | null;
};

export type StatistikRingkasanType = {
  periode_awal: string;
  periode_akhir: string;
  total_transaksi: number;
  total_produk_terjual: number;
  total_pemasukan: string;
  total_pengeluaran: string;
  keuntungan_bersih: string;
  margin_keuntungan: string | null;
  rata_rata_transaksi_per_hari: string;
  rata_rata_pemasukan_per_hari: string;
  statistik_per_lokasi: StatistikLokasiType[];
  statistik_per_produk: StatistikProdukType[];
  statistik_per_periode: StatistikPeriodeType[];
};

export type FilterStatistikType = {
  tipe_periode?: "bulanan" | "tahunan" | "custom";
  tahun?: number;
  bulan?: number;
  tanggal_awal?: string;
  tanggal_akhir?: string;
  lokasi_id?: string;
  produk_id?: string;
};

type StatistikStore = {
  // Data state
  dtStatistikRingkasan: StatistikRingkasanType | null;
  dtStatistikLokasi: StatistikLokasiType[];
  dtStatistikProduk: StatistikProdukType[];
  dtStatistikPeriode: StatistikPeriodeType[];

  // Filter state
  filters: FilterStatistikType;

  // Loading state
  isLoading: boolean;
  isLoadingLokasi: boolean;
  isLoadingProduk: boolean;
  isLoadingPeriode: boolean;

  // Error state
  error: string | null;

  // Actions
  setFilters: (filters: FilterStatistikType) => void;
  clearFilters: () => void;

  // API calls
  fetchStatistikRingkasan: (customFilters?: FilterStatistikType) => Promise<{
    status: string;
    data?: StatistikRingkasanType;
    error?: any;
  }>;

  fetchStatistikLokasi: (customFilters?: FilterStatistikType) => Promise<{
    status: string;
    data?: StatistikLokasiType[];
    error?: any;
  }>;

  fetchStatistikProduk: (customFilters?: FilterStatistikType) => Promise<{
    status: string;
    data?: StatistikProdukType[];
    error?: any;
  }>;

  fetchStatistikPeriode: (customFilters?: FilterStatistikType) => Promise<{
    status: string;
    data?: StatistikPeriodeType[];
    error?: any;
  }>;

  // Combined action untuk apply filter dan fetch data
  applyFiltersAndFetch: (newFilters: FilterStatistikType) => Promise<void>;
};

const useStatistikStore = create(
  devtools<StatistikStore>((set, get) => ({
    // Initial state
    dtStatistikRingkasan: null,
    dtStatistikLokasi: [],
    dtStatistikProduk: [],
    dtStatistikPeriode: [],

    filters: {
      tipe_periode: "bulanan",
      tahun: new Date().getFullYear(),
    },

    isLoading: false,
    isLoadingLokasi: false,
    isLoadingProduk: false,
    isLoadingPeriode: false,
    error: null,

    // Filter actions
    setFilters: (filters: FilterStatistikType) => {
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
    applyFiltersAndFetch: async (newFilters: FilterStatistikType) => {
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
        console.error("Error fetching statistik with new filters:", error);
      }
    },

    // Fetch statistik ringkasan
    fetchStatistikRingkasan: async (customFilters?: FilterStatistikType) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      // Gunakan customFilters jika ada, otherwise gunakan filters dari store
      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoading: true, error: null }));

      try {
        // Build query parameters
        const params = new URLSearchParams();

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

        const statistikData = response.data.data;

        set((state) => ({
          ...state,
          dtStatistikRingkasan: statistikData,
          dtStatistikLokasi: statistikData.statistik_per_lokasi || [],
          dtStatistikProduk: statistikData.statistik_per_produk || [],
          dtStatistikPeriode: statistikData.statistik_per_periode || [],
          isLoading: false,
        }));

        return {
          status: "berhasil",
          data: statistikData,
        };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Terjadi kesalahan";
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

    // Fetch statistik lokasi
    fetchStatistikLokasi: async (customFilters?: FilterStatistikType) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoadingLokasi: true, error: null }));

      try {
        const params = new URLSearchParams();

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

        const response = await api({
          method: "get",
          url: `/statistik/lokasi/?${params.toString()}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtStatistikLokasi: response.data.data,
          isLoadingLokasi: false,
        }));

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Terjadi kesalahan";
        set((state) => ({
          ...state,
          isLoadingLokasi: false,
          error: errorMessage,
        }));

        return {
          status: "error",
          error: errorMessage,
        };
      }
    },

    // Fetch statistik produk
    fetchStatistikProduk: async (customFilters?: FilterStatistikType) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoadingProduk: true, error: null }));

      try {
        const params = new URLSearchParams();

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

        const response = await api({
          method: "get",
          url: `/statistik/produk/?${params.toString()}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtStatistikProduk: response.data.data,
          isLoadingProduk: false,
        }));

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Terjadi kesalahan";
        set((state) => ({
          ...state,
          isLoadingProduk: false,
          error: errorMessage,
        }));

        return {
          status: "error",
          error: errorMessage,
        };
      }
    },

    // Fetch statistik periode
    fetchStatistikPeriode: async (customFilters?: FilterStatistikType) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoadingPeriode: true, error: null }));

      try {
        const params = new URLSearchParams();

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

        const response = await api({
          method: "get",
          url: `/statistik/periode/?${params.toString()}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtStatistikPeriode: response.data.data,
          isLoadingPeriode: false,
        }));

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Terjadi kesalahan";
        set((state) => ({
          ...state,
          isLoadingPeriode: false,
          error: errorMessage,
        }));

        return {
          status: "error",
          error: errorMessage,
        };
      }
    },
  }))
);

export default useStatistikStore;
