/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { UserType } from "@/types";

type Store = {
  accountData: UserType | null;
  getUserAccount: () => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
  updateData: (
    id: number | string,
    data: UserType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useUserAccount = create(
  devtools<Store>((set) => ({
    accountData: null,
    getUserAccount: async () => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/user/me/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          accountData: response.data.data,
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

    updateData: async (id, row) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "PUT",
          url: `/user/me_update/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((state) => ({
          ...state,
          accountData: response.data.data,
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

export default useUserAccount;
