/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { LokasiPenjualanType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtLokasiPenjualan: {
    last_page: number;
    current_page: number;
    data: LokasiPenjualanType[];
  };

  showLokasiPenjualan: LokasiPenjualanType | null;

  setLokasiPenjualan: ({
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

  setShowLokasiPenjualan: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  addData: (
    data: LokasiPenjualanType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: LokasiPenjualanType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useLokasiPenjualan = create(
  devtools<Store>((set) => ({
    dtLokasiPenjualan: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showLokasiPenjualan: null,

    setLokasiPenjualan: async ({
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
          url: `/lokasi-penjualan/`,
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
          dtLokasiPenjualan: response.data.data,
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

    setShowLokasiPenjualan: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/lokasi-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showLokasiPenjualan: response.data.data,
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
          url: `/lokasi-penjualan/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtLokasiPenjualan: {
            last_page: prevState.dtLokasiPenjualan.last_page,
            current_page: prevState.dtLokasiPenjualan.current_page,
            data: [res.data.data, ...prevState.dtLokasiPenjualan.data],
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
          url: `/lokasi-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtLokasiPenjualan: {
            last_page: prevState.dtLokasiPenjualan.last_page,
            current_page: prevState.dtLokasiPenjualan.current_page,
            data: prevState.dtLokasiPenjualan.data.filter(
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
          url: `/lokasi-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtLokasiPenjualan: {
            last_page: prevState.dtLokasiPenjualan.last_page,
            current_page: prevState.dtLokasiPenjualan.current_page,
            data: prevState.dtLokasiPenjualan.data.map((item: any) => {
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

export default useLokasiPenjualan;
