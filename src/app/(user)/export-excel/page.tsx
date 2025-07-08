/** @format */

"use client";
import { useEffect, useState } from "react";
import { useWelcomeContext } from "@/context/WelcomeContext";
import { useForm, Controller } from "react-hook-form";
import useLogin from "@/stores/auth/login";
import moment from "moment";
import {
  BiDownload,
  BiFile,
  BiCalendar,
  BiFilter,
  BiLoaderAlt,
} from "react-icons/bi";
import toast from "react-hot-toast";
import { BASE_URL } from "@/services/baseURL";

// Types
interface ExportForm {
  startDate?: string;
  endDate?: string;
  exportType: "sales_report" | "sales_analysis";
}

const ExportExcelPage = () => {
  const { setWelcome } = useWelcomeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: {},
  } = useForm<ExportForm>({
    defaultValues: {
      exportType: "sales_report",
      startDate: moment().startOf("month").format("YYYY-MM-DD"),
      endDate: moment().endOf("month").format("YYYY-MM-DD"),
    },
  });

  const exportType = watch("exportType");

  useEffect(() => {
    setWelcome("Export Excel");
  }, [setWelcome]);

  // Function to handle file download
  const downloadFile = async (url: string, filename: string) => {
    try {
      const token = await useLogin.getState().setToken();

      console.log("Downloading from URL:", url); // Debug log
      console.log("Using token:", token ? "Token exists" : "No token"); // Debug log

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status); // Debug log
      console.log("Response headers:", response.headers); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText); // Debug log
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const blob = await response.blob();
      console.log("Blob size:", blob.size); // Debug log

      if (blob.size === 0) {
        throw new Error("File kosong atau tidak ada data");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      // Add to download history
      const newDownload = {
        id: Date.now(),
        filename,
        type: exportType,
        downloadedAt: moment().format("DD/MM/YYYY HH:mm:ss"),
      };
      setDownloadHistory((prev) => [newDownload, ...prev.slice(0, 4)]);

      toast.success("File berhasil didownload!");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(`Gagal mendownload file: ${error.message}`);
    }
  };

  // Handle export submission
  const onSubmit = async (data: ExportForm) => {
    setIsLoading(true);

    try {
      let url = "";
      let filename = "";

      // Build URL with query parameters
      const params = new URLSearchParams();

      // Add date filters for sales_report
      if (data.exportType === "sales_report") {
        if (data.startDate) {
          params.append("start_date", data.startDate);
        }
        if (data.endDate) {
          params.append("end_date", data.endDate);
        }
      }

      if (data.exportType === "sales_report") {
        url = `${BASE_URL}/api/export-excel/export_sales_report/?${params.toString()}`;
        filename = `laporan_penjualan_${moment().format(
          "YYYYMMDD_HHmmss"
        )}.xlsx`;
      } else {
        url = `${BASE_URL}/api/export-excel/export_sales_analysis/`;
        filename = `analisis_penjualan_${moment().format(
          "YYYYMMDD_HHmmss"
        )}.xlsx`;
      }

      console.log("Export URL:", url); // Debug log
      console.log("Export data:", data); // Debug log

      await downloadFile(url, filename);
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(`Gagal mengexport data: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Export Data ke Excel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Form */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <BiFile className="w-5 h-5" />
                Pilih Jenis Export
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Export Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Jenis Laporan
                    </span>
                  </label>
                  <Controller
                    name="exportType"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <span className="label-text">
                              <div>
                                <div className="font-medium">
                                  Laporan Penjualan
                                </div>
                                <div className="text-sm text-gray-500">
                                  Data lengkap transaksi penjualan dengan detail
                                  produk dan lokasi
                                </div>
                              </div>
                            </span>
                            <input
                              type="radio"
                              className="radio radio-primary"
                              value="sales_report"
                              checked={field.value === "sales_report"}
                              onChange={() => field.onChange("sales_report")}
                            />
                          </label>
                        </div>
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <span className="label-text">
                              <div>
                                <div className="font-medium">
                                  Analisis Penjualan
                                </div>
                                <div className="text-sm text-gray-500">
                                  Laporan analisis dengan multiple sheets
                                  (ringkasan, per produk, per lokasi)
                                </div>
                              </div>
                            </span>
                            <input
                              type="radio"
                              className="radio radio-primary"
                              value="sales_analysis"
                              checked={field.value === "sales_analysis"}
                              onChange={() => field.onChange("sales_analysis")}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* Date Range Filter - Only for sales_report */}
                {exportType === "sales_report" && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BiFilter className="w-4 h-4" />
                      <span className="font-medium">Filter Tanggal</span>
                      <span className="text-sm text-gray-500">(Opsional)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Tanggal Mulai</span>
                        </label>
                        <Controller
                          name="startDate"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="date"
                              className="input input-bordered w-full"
                              {...field}
                            />
                          )}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Tanggal Selesai</span>
                        </label>
                        <Controller
                          name="endDate"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="date"
                              className="input input-bordered w-full"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="card-actions justify-end pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <BiLoaderAlt className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <BiDownload className="w-4 h-4" />
                        Download Excel
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Export Info */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">
                <BiCalendar className="w-5 h-5" />
                Informasi Export
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">Laporan Penjualan:</div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Data transaksi detail</li>
                    <li>Informasi produk & lokasi</li>
                    <li>Bisa difilter berdasarkan tanggal</li>
                    <li>Format: Single sheet Excel</li>
                  </ul>
                </div>

                <div>
                  <div className="font-medium">Analisis Penjualan:</div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Ringkasan statistik</li>
                    <li>Analisis per produk</li>
                    <li>Analisis per lokasi</li>
                    <li>Format: Multiple sheets Excel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Download History */}
          {downloadHistory.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Download Terakhir</h3>

                <div className="space-y-2">
                  {downloadHistory.map((item) => (
                    <div
                      key={item.id}
                      className="border-l-4 border-primary pl-3 py-2"
                    >
                      <div className="font-medium text-sm truncate">
                        {item.filename}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.downloadedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="alert alert-info">
            <BiFile className="w-4 h-4" />
            <div className="text-sm">
              <div className="font-medium">Tips:</div>
              <div>
                File akan didownload dalam format .xlsx dan dapat dibuka dengan
                Microsoft Excel atau Google Sheets.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportExcelPage;
