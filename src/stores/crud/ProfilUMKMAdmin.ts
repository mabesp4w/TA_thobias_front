/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { ProfilUMKMType } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtProfilUMKM: {
    last_page: number;
    current_page: number;
    data: ProfilUMKMType[];
  };

  showProfilUMKM: ProfilUMKMType | null;

  setProfilUMKM: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  setShowProfilUMKM: (id: number | string) => Promise<{
    status: string;
    data?: object;
    error?: object;
  }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useProfilUMKMAdmin = create(
  devtools<Store>((set) => ({
    dtProfilUMKM: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showProfilUMKM: null,

    setProfilUMKM: async ({ page = 1, limit = 10, search, sortby, order }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/profil-umkm/`,
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
          dtProfilUMKM: response.data.data,
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

    setShowProfilUMKM: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/admin/profil-umkm/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showProfilUMKM: response.data.data,
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

    removeData: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "delete",
          url: `/admin/profil-umkm/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtProfilUMKM: {
            last_page: prevState.dtProfilUMKM.last_page,
            current_page: prevState.dtProfilUMKM.current_page,
            data: prevState.dtProfilUMKM.data.filter(
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
  }))
);

export default useProfilUMKMAdmin;
