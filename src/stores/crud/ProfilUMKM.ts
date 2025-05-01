/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { ProfilUMKMType } from "@/types";

type Store = {
  profilData: ProfilUMKMType | null;

  getProfile: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  updateProfile: (
    id: number | string,
    data: ProfilUMKMType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useProfilUMKM = create(
  devtools<Store>((set) => ({
    profilData: null,

    getProfile: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/profil-umkm/my_profile/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          profilData: response.data.data,
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

    updateProfile: async (id, row) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "PUT",
          url: `/profil-umkm/update_my_profile/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((state) => ({
          ...state,
          profilData: response.data.data,
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

export default useProfilUMKM;
