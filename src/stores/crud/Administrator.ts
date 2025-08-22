/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { AdministratorType } from "@/types";
// store administrator
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtAdministrator: {
    last_page: number;
    current_page: number;
    data: AdministratorType[];
  };

  showAdministrator: AdministratorType | null;

  setAdministrator: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setShowAdministrator: (id: number | string) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  addData: (
    data: AdministratorType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: AdministratorType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useAdministrator = create(
  devtools<Store>((set) => ({
    dtAdministrator: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showAdministrator: null,
    setAdministrator: async ({
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
          url: `/administrator/`,
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
          dtAdministrator: response.data.data,
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
    setShowAdministrator: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/administrator/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showAdministrator: response.data.data,
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
          url: `/administrator/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtAdministrator: {
            last_page: prevState.dtAdministrator.last_page,
            current_page: prevState.dtAdministrator.current_page,
            data: [res.data.data, ...prevState.dtAdministrator.data],
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
          url: `/administrator/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtAdministrator: {
            last_page: prevState.dtAdministrator.last_page,
            current_page: prevState.dtAdministrator.current_page,
            data: prevState.dtAdministrator.data.filter(
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
          url: `/administrator/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtAdministrator: {
            last_page: prevState.dtAdministrator.last_page,
            current_page: prevState.dtAdministrator.current_page,
            data: prevState.dtAdministrator.data.map((item: any) => {
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

export default useAdministrator;
