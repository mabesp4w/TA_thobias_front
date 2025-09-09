/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import {
  PromosiResponse,
  PromosiFilter,
  KategoriOption,
  PromosiProduk,
} from "@/types/promosi";

interface PromosiStats {
  total_produk: number;
  total_umkm: number;
  total_kategori: number;
  produk_terbaru: number;
  umkm_aktif: number;
}

type PromosiStore = {
  dtPromosi: PromosiResponse | null;
  dtKategori: KategoriOption[];
  dtFeatured: PromosiProduk[];
  dtPopular: PromosiProduk[];
  dtStats: PromosiStats | null;
  dtRelated: PromosiProduk[];
  selectedProduct: PromosiProduk | null;
  isLoading: boolean;
  isLoadingCategories: boolean;
  isLoadingFeatured: boolean;
  isLoadingStats: boolean;
  error: string | null;

  // Actions
  setPromosi: (filter?: PromosiFilter) => Promise<{
    status: string;
    data?: PromosiResponse;
    error?: any;
  }>;
  setKategoriPromosi: () => Promise<{
    status: string;
    data?: KategoriOption[];
    error?: any;
  }>;
  setFeaturedProducts: () => Promise<{
    status: string;
    data?: PromosiProduk[];
    error?: any;
  }>;
  setPopularProducts: () => Promise<{
    status: string;
    data?: PromosiProduk[];
    error?: any;
  }>;
  setStats: () => Promise<{
    status: string;
    data?: PromosiStats;
    error?: any;
  }>;
  getProductDetail: (id: string) => Promise<{
    status: string;
    data?: PromosiProduk;
    error?: any;
  }>;
  getRelatedProducts: (id: string) => Promise<{
    status: string;
    data?: PromosiProduk[];
    error?: any;
  }>;
  getProductsByUMKM: (
    umkmId: string,
    page?: number
  ) => Promise<{
    status: string;
    data?: PromosiResponse;
    error?: any;
  }>;
  clearError: () => void;
  resetStore: () => void;
  setSelectedProduct: (product: PromosiProduk | null) => void;
};

const usePromosiStore = create(
  devtools<PromosiStore>((set) => ({
    dtPromosi: null,
    dtKategori: [],
    dtFeatured: [],
    dtPopular: [],
    dtStats: null,
    dtRelated: [],
    selectedProduct: null,
    isLoading: false,
    isLoadingCategories: false,
    isLoadingFeatured: false,
    isLoadingStats: false,
    error: null,

    setPromosi: async (filter = {}) => {
      set({ isLoading: true, error: null });

      try {
        const params = new URLSearchParams();

        // Set pagination
        params.append("page", String(filter.page || 1));
        params.append("limit", String(filter.limit || 12));

        // Add search
        if (filter.search) {
          params.append("search", filter.search);
        }

        // Add category filter
        if (filter.kategori) {
          params.append("kategori", filter.kategori);
        }

        // Add sorting - Django REST Framework menggunakan 'ordering'
        if (filter.sortby) {
          const ordering =
            filter.order === "asc" ? filter.sortby : `-${filter.sortby}`;
          params.append("ordering", ordering);
        }

        // Add price range filters
        if (filter.harga_min) {
          params.append("harga_min", String(filter.harga_min));
        }
        if (filter.harga_max) {
          params.append("harga_max", String(filter.harga_max));
        }

        // Add stock filter
        if (filter.has_stock !== undefined) {
          params.append("has_stock", String(filter.has_stock));
        }

        // Add UMKM name filter
        if (filter.umkm_name) {
          params.append("umkm_name", filter.umkm_name);
        }

        // Add date filters
        if (filter.created_after) {
          params.append("created_after", filter.created_after);
        }
        if (filter.created_before) {
          params.append("created_before", filter.created_before);
        }

        const response = await api({
          method: "get",
          url: `/promosi/products/?${params.toString()}`,
        });

        set({
          dtPromosi: response.data?.data,
          isLoading: false,
          error: null,
        });

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Gagal memuat data produk";

        set({
          isLoading: false,
          error: errorMessage,
        });

        return {
          status: "error",
          error: error.response?.data || errorMessage,
        };
      }
    },

    setKategoriPromosi: async () => {
      set({ isLoadingCategories: true });

      try {
        const response = await api({
          method: "get",
          url: `/promosi/products/categories/`,
        });

        const kategoriData = response.data.data.map((kategori: any) => ({
          id: kategori.id,
          nm_kategori: kategori.nm_kategori,
          count: kategori.jumlah_produk,
        }));

        set({
          dtKategori: kategoriData,
          isLoadingCategories: false,
        });

        return {
          status: "berhasil",
          data: kategoriData,
        };
      } catch (error: any) {
        set({
          isLoadingCategories: false,
        });

        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    setFeaturedProducts: async () => {
      set({ isLoadingFeatured: true });

      try {
        const response = await api({
          method: "get",
          url: `/promosi/products/featured/`,
        });

        set({
          dtFeatured: response.data.data,
          isLoadingFeatured: false,
        });

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        set({
          isLoadingFeatured: false,
        });

        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    setPopularProducts: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/promosi/products/popular/`,
        });

        set({
          dtPopular: response.data,
        });

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    setStats: async () => {
      set({ isLoadingStats: true });

      try {
        const response = await api({
          method: "get",
          url: `/promosi/products/stats/`,
        });

        set({
          dtStats: response.data,
          isLoadingStats: false,
        });

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        set({
          isLoadingStats: false,
        });

        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getProductDetail: async (id: string) => {
      try {
        const response = await api({
          method: "get",
          url: `/promosi/products/${id}/`,
        });

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getRelatedProducts: async (id: string) => {
      try {
        const response = await api({
          method: "get",
          url: `/promosi/products/${id}/related/`,
        });

        set({
          dtRelated: response.data,
        });

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getProductsByUMKM: async (umkmId: string, page = 1) => {
      set({ isLoading: true, error: null });

      try {
        const params = new URLSearchParams();
        params.append("umkm_id", umkmId);
        params.append("page", String(page));

        const response = await api({
          method: "get",
          url: `/promosi/products/by_umkm/?${params.toString()}`,
        });

        const responseData = {
          data: response.data.results || response.data,
          current_page: page,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 12,
          total: response.data.count || response.data.length,
          from: (page - 1) * 12 + 1,
          to: Math.min(page * 12, response.data.count || response.data.length),
        };

        set({
          dtPromosi: responseData,
          isLoading: false,
          error: null,
        });

        return {
          status: "berhasil",
          data: responseData,
        };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "Gagal memuat produk UMKM";

        set({
          isLoading: false,
          error: errorMessage,
        });

        return {
          status: "error",
          error: error.response?.data || errorMessage,
        };
      }
    },

    setSelectedProduct: (product: PromosiProduk | null) => {
      set({ selectedProduct: product });
    },

    clearError: () => {
      set({ error: null });
    },

    resetStore: () => {
      set({
        dtPromosi: null,
        dtKategori: [],
        dtFeatured: [],
        dtPopular: [],
        dtStats: null,
        dtRelated: [],
        selectedProduct: null,
        isLoading: false,
        isLoadingCategories: false,
        isLoadingFeatured: false,
        isLoadingStats: false,
        error: null,
      });
    },
  }))
);

export default usePromosiStore;
