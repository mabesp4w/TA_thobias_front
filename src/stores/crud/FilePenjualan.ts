/** @format */

// stores/crud/FilePenjualan.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";

export interface FilePenjualanType {
  id?: string;
  umkm?: string;
  file?: File | null;
  nama_file: string;
  deskripsi?: string;
  tgl_upload?: string;
  tgl_update?: string;
  ukuran_file?: number;
  umkm_detail?: any;
}

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtFilePenjualan: {
    last_page: number;
    current_page: number;
    data: FilePenjualanType[];
  };

  showFilePenjualan: FilePenjualanType | null;

  setFilePenjualan: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setMyFiles: ({ page, limit, search, sortby, order }: Props) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setShowFilePenjualan: (id: number | string) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  addData: (
    data: FilePenjualanType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: FilePenjualanType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  downloadFile: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useFilePenjualan = create(
  devtools<Store>((set) => ({
    dtFilePenjualan: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showFilePenjualan: null,

    setFilePenjualan: async ({
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
          url: `/file-penjualan/`,
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
          dtFilePenjualan: response.data.data,
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

    setMyFiles: async ({ page = 1, limit = 10, search, sortby, order }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/file-penjualan/my_files/`,
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
          dtFilePenjualan: response.data.data,
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

    setShowFilePenjualan: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/file-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showFilePenjualan: response.data.data,
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

    addData: async (row: FilePenjualanType) => {
      const token = await useLogin.getState().setToken();
      try {
        const formData = new FormData();

        if (row.file) {
          formData.append("file", row.file);
        }
        formData.append("nama_file", row.nama_file);
        if (row.deskripsi) {
          formData.append("deskripsi", row.deskripsi);
        }

        const res = await crud({
          method: "post",
          url: `/file-penjualan/upload_file/`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });

        set((prevState) => ({
          dtFilePenjualan: {
            last_page: prevState.dtFilePenjualan.last_page,
            current_page: prevState.dtFilePenjualan.current_page,
            data: [res.data.data, ...prevState.dtFilePenjualan.data],
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
          url: `/file-penjualan/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtFilePenjualan: {
            last_page: prevState.dtFilePenjualan.last_page,
            current_page: prevState.dtFilePenjualan.current_page,
            data: prevState.dtFilePenjualan.data.filter(
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
        const formData = new FormData();

        if (row.file) {
          formData.append("file", row.file);
        }
        formData.append("nama_file", row.nama_file);
        if (row.deskripsi) {
          formData.append("deskripsi", row.deskripsi);
        }

        const response = await crud({
          method: "PUT",
          url: `/file-penjualan/${id}/`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });

        set((prevState) => ({
          dtFilePenjualan: {
            last_page: prevState.dtFilePenjualan.last_page,
            current_page: prevState.dtFilePenjualan.current_page,
            data: prevState.dtFilePenjualan.data.map((item: any) => {
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

    downloadFile: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/file-penjualan/${id}/download/`,
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Try to get filename from headers
        const contentDisposition = response.headers["content-disposition"];
        let filename = "file_penjualan.xlsx";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return {
          status: "berhasil download",
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

export default useFilePenjualan;
