/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import useLogin from "../auth/login";
import { KategoriLokasiPenjualanType } from "@/types";
// kategoriLokasiPenjualan
type Store = {
  dtKategoriLokasiPenjualan: KategoriLokasiPenjualanType[];

  setKategoriLokasiPenjualan: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useKategoriLokasiPenjualanApi = create(
  devtools<Store>((set) => ({
    dtKategoriLokasiPenjualan: [],

    setKategoriLokasiPenjualan: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await api({
          method: "get",
          url: `/kategori-lokasi-penjualan/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtKategoriLokasiPenjualan: response.data,
        }));
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
  }))
);

export default useKategoriLokasiPenjualanApi;
