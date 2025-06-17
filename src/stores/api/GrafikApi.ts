/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import {
  GrafikPenjualanType,
  GrafikPenjualanUMKMType,
  UMKMType,
  RingkasanPenjualanType,
  FilterGrafikType,
} from "@/types/grafik";

type GrafikStore = {
  // Data state
  dtGrafikPenjualan: GrafikPenjualanType[];
  dtGrafikPerUMKM: GrafikPenjualanUMKMType[];
  dtListUMKM: UMKMType[];
  dtRingkasan: RingkasanPenjualanType | null;

  // Filter state
  filters: FilterGrafikType;

  // Loading state
  isLoading: boolean;
  isLoadingRingkasan: boolean;
  isLoadingUMKM: boolean;

  // Error state
  error: string | null;

  // Actions
  setFilters: (filters: FilterGrafikType) => void;
  clearFilters: () => void;

  // API calls dengan parameter filter opsional
  fetchGrafikPenjualan: (customFilters?: FilterGrafikType) => Promise<{
    status: string;
    data?: GrafikPenjualanType[];
    error?: any;
  }>;

  fetchGrafikPerUMKM: (customFilters?: FilterGrafikType) => Promise<{
    status: string;
    data?: GrafikPenjualanUMKMType[];
    error?: any;
  }>;

  fetchListUMKM: () => Promise<{
    status: string;
    data?: UMKMType[];
    error?: any;
  }>;

  fetchRingkasanPenjualan: (customFilters?: FilterGrafikType) => Promise<{
    status: string;
    data?: RingkasanPenjualanType;
    error?: any;
  }>;

  // Combined action untuk apply filter dan fetch data
  applyFiltersAndFetch: (newFilters: FilterGrafikType) => Promise<void>;
};

const useGrafikStore = create(
  devtools<GrafikStore>((set, get) => ({
    // Initial state
    dtGrafikPenjualan: [],
    dtGrafikPerUMKM: [],
    dtListUMKM: [],
    dtRingkasan: null,

    filters: {
      tahun: new Date().getFullYear(),
    },

    isLoading: false,
    isLoadingRingkasan: false,
    isLoadingUMKM: false,
    error: null,

    // Filter actions
    setFilters: (filters: FilterGrafikType) => {
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
          tahun: new Date().getFullYear(),
        },
        error: null,
      }));
    },

    // Combined action untuk apply filter dan fetch data
    applyFiltersAndFetch: async (newFilters: FilterGrafikType) => {
      // Update filters first
      set((state) => ({
        ...state,
        filters: { ...state.filters, ...newFilters },
        error: null,
      }));

      // Fetch data dengan filters baru
      const { fetchGrafikPenjualan, fetchRingkasanPenjualan } = get();

      try {
        await Promise.all([
          fetchGrafikPenjualan(newFilters),
          fetchRingkasanPenjualan(newFilters),
        ]);
      } catch (error) {
        console.error("Error fetching data with new filters:", error);
      }
    },

    // Fetch grafik penjualan (semua UMKM atau per UMKM)
    fetchGrafikPenjualan: async (customFilters?: FilterGrafikType) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      // Gunakan customFilters jika ada, otherwise gunakan filters dari store
      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoading: true, error: null }));

      try {
        // Build query parameters
        const params = new URLSearchParams();

        if (filters.umkm_id) {
          params.append("umkm_id", filters.umkm_id);
        }
        if (filters.tahun) {
          params.append("tahun", filters.tahun.toString());
        }
        if (filters.bulan_start) {
          params.append("bulan_start", filters.bulan_start.toString());
        }
        if (filters.bulan_end) {
          params.append("bulan_end", filters.bulan_end.toString());
        }

        console.log(
          "Fetching grafik penjualan with params:",
          params.toString()
        );

        const response = await api({
          method: "get",
          url: `/grafik-penjualan/?${params.toString()}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtGrafikPenjualan: response.data.data,
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

    // Fetch grafik per UMKM (untuk perbandingan)
    fetchGrafikPerUMKM: async (customFilters?: FilterGrafikType) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      // Gunakan customFilters jika ada, otherwise gunakan filters dari store
      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const params = new URLSearchParams();

        if (filters.tahun) {
          params.append("tahun", filters.tahun.toString());
        }
        if (filters.bulan_start) {
          params.append("bulan_start", filters.bulan_start.toString());
        }
        if (filters.bulan_end) {
          params.append("bulan_end", filters.bulan_end.toString());
        }

        console.log("Fetching grafik per UMKM with params:", params.toString());

        const response = await api({
          method: "get",
          url: `/grafik-penjualan-per-umkm/?${params.toString()}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtGrafikPerUMKM: response.data.data,
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

    // Fetch list UMKM untuk dropdown
    fetchListUMKM: async () => {
      const token = await useLogin.getState().setToken();

      set((state) => ({ ...state, isLoadingUMKM: true, error: null }));

      try {
        const response = await api({
          method: "get",
          url: `/list-umkm/`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtListUMKM: response.data.data,
          isLoadingUMKM: false,
        }));

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Terjadi kesalahan";
        set((state) => ({
          ...state,
          isLoadingUMKM: false,
          error: errorMessage,
        }));

        return {
          status: "error",
          error: errorMessage,
        };
      }
    },

    // Fetch ringkasan penjualan
    fetchRingkasanPenjualan: async (customFilters?: FilterGrafikType) => {
      const token = await useLogin.getState().setToken();
      const { filters: storeFilters } = get();

      // Gunakan customFilters jika ada, otherwise gunakan filters dari store
      const filters = customFilters || storeFilters;

      set((state) => ({ ...state, isLoadingRingkasan: true, error: null }));

      try {
        const params = new URLSearchParams();

        if (filters.umkm_id) {
          params.append("umkm_id", filters.umkm_id);
        }
        if (filters.tahun) {
          params.append("tahun", filters.tahun.toString());
        }
        if (filters.bulan_start) {
          params.append("bulan_start", filters.bulan_start.toString());
        }
        if (filters.bulan_end) {
          params.append("bulan_end", filters.bulan_end.toString());
        }

        console.log("Fetching ringkasan with params:", params.toString());

        const response = await api({
          method: "get",
          url: `/ringkasan-penjualan/?${params.toString()}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtRingkasan: response.data.data,
          isLoadingRingkasan: false,
        }));

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Terjadi kesalahan";
        set((state) => ({
          ...state,
          isLoadingRingkasan: false,
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

export default useGrafikStore;
