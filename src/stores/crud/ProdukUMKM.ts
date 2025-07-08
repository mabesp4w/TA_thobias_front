/** @format */
// stores/crud/ProdukUMKM.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { ProdukType } from "@/types";

// Helper function to convert object to FormData
const createFormData = (data: ProdukType): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof ProdukType];

    if (key === "gambar_utama") {
      // Only append gambar_utama if it's a File instance
      if (value instanceof File) {
        formData.append(key, value);
      }
      // Skip if null or not a File - don't send to backend
    } else if (value !== null && value !== undefined) {
      // For other fields, append if not null/undefined
      formData.append(key, String(value));
    }
  });

  return formData;
};

// Helper function to prepare data for JSON payload (when no file upload)
const prepareJsonData = (data: ProdukType): Partial<ProdukType> => {
  const jsonData: Partial<ProdukType> = {};

  for (const [key, value] of Object.entries(data)) {
    const typedKey = key as keyof ProdukType;

    if (typedKey === "gambar_utama") {
      // Only include gambar_utama in JSON if it's not null and not a File
      if (value !== null && !(value instanceof File)) {
        jsonData[typedKey] = value;
      }
      // Skip if null - don't send to backend
    } else if (value !== null && value !== undefined) {
      jsonData[typedKey] = value;
    }
  }

  return jsonData;
};

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtProduk: {
    last_page: number;
    current_page: number;
    data: ProdukType[];
  };

  showProduk: ProdukType | null;

  setProduk: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setShowProduk: (id: number | string) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  addMyProduk: (
    data: ProdukType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: ProdukType
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useProdukUMKM = create(
  devtools<Store>((set) => ({
    dtProduk: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showProduk: null,

    setProduk: async ({ page = 1, limit = 10, search, sortby, order }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/produk/my_products/`,
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
          dtProduk: response.data,
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

    setShowProduk: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/produk/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showProduk: response.data.data,
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

    addMyProduk: async (row: ProdukType) => {
      const token = await useLogin.getState().setToken();
      try {
        // Check if we have a file to upload
        const hasFile = row.gambar_utama instanceof File;
        const payload = hasFile ? createFormData(row) : prepareJsonData(row);

        const res = await crud({
          method: "post",
          url: `/produk/create_my_product/`,
          headers: {
            Authorization: `Bearer ${token}`,
            // Let axios set the Content-Type for FormData
            ...(hasFile ? {} : { "Content-Type": "application/json" }),
          },
          data: payload,
        });
        set((prevState) => ({
          dtProduk: {
            last_page: prevState.dtProduk.last_page,
            current_page: prevState.dtProduk.current_page,
            data: [res.data.data, ...prevState.dtProduk.data],
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
          url: `/produk/${id}/destroy_my_product/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtProduk: {
            last_page: prevState.dtProduk.last_page,
            current_page: prevState.dtProduk.current_page,
            data: prevState.dtProduk.data.filter((item: any) => item.id !== id),
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
        // Check if we have a file to upload
        const hasFile = row.gambar_utama instanceof File;
        const payload = hasFile ? createFormData(row) : prepareJsonData(row);

        const response = await crud({
          method: "PUT",
          url: `/produk/${id}/update_my_product/`,
          headers: {
            Authorization: `Bearer ${token}`,
            // Let axios set the Content-Type for FormData
            ...(hasFile ? {} : { "Content-Type": "application/json" }),
          },
          data: payload,
        });
        set((prevState) => ({
          dtProduk: {
            last_page: prevState.dtProduk.last_page,
            current_page: prevState.dtProduk.current_page,
            data: prevState.dtProduk.data.map((item: any) => {
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

export default useProdukUMKM;
