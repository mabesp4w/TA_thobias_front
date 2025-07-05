/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { KategoriLokasiPenjualanType } from "@/types";
// store kategoriLokasiPenjualan
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtKategoriLokasiPenjualan: {
    last_page: number;
    current_page: number;
    data: KategoriLokasiPenjualanType[];
  };

  showKategoriLokasiPenjualan: KategoriLokasiPenjualanType | null;

  setKategoriLokasiPenjualan: ({
    page,
    limit,
    search,
    sortby,
    order,
  }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowKategoriLokasiPenjualan: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  addData: (
    data: KategoriLokasiPenjualanType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: KategoriLokasiPenjualanType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useKategoriLokasiPenjualan = create(
  devtools<Store>((set) => ({
    dtKategoriLokasiPenjualan: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showKategoriLokasiPenjualan: null,
    setKategoriLokasiPenjualan: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
    }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/kategori-lokasi-penjualan/`,
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit,
            page,
            search,
            sortby,
            order,
          },
        });
        set((state) => ({
          ...state,
          dtKategoriLokasiPenjualan: response.data.data,
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
    setShowKategoriLokasiPenjualan: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/kategori-lokasi-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showKategoriLokasiPenjualan: response.data.data,
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
    addData: async (row) => {
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "post",
          url: `/kategori-lokasi-penjualan/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtKategoriLokasiPenjualan: {
            last_page: prevState.dtKategoriLokasiPenjualan.last_page,
            current_page: prevState.dtKategoriLokasiPenjualan.current_page,
            data: [res.data.data, ...prevState.dtKategoriLokasiPenjualan.data],
          },
        }));
        return {
          status: "berhasil tambah",
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
    removeData: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "delete",
          url: `/kategori-lokasi-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtKategoriLokasiPenjualan: {
            last_page: prevState.dtKategoriLokasiPenjualan.last_page,
            current_page: prevState.dtKategoriLokasiPenjualan.current_page,
            data: prevState.dtKategoriLokasiPenjualan.data.filter(
              (item: any) => item.id !== id
            ),
          },
        }));
        return {
          status: "berhasil hapus",
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
    updateData: async (id, row) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "PUT",
          url: `/kategori-lokasi-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtKategoriLokasiPenjualan: {
            last_page: prevState.dtKategoriLokasiPenjualan.last_page,
            current_page: prevState.dtKategoriLokasiPenjualan.current_page,
            data: prevState.dtKategoriLokasiPenjualan.data.map((item: any) => {
              if (item.id === id) {
                return {
                  ...item,
                  ...response.data.data,
                };
              } else {
                return item;
              }
            }),
          },
        }));
        return {
          status: "berhasil update",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
  }))
);

export default useKategoriLokasiPenjualan;
