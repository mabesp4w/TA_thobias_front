/** @format */

"use client";
import { FC, useEffect } from "react";
import Image from "next/image";
import { PromosiProduk } from "@/types/promosi";

interface ProductDetailModalProps {
  produk: PromosiProduk | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: FC<ProductDetailModalProps> = ({
  produk,
  isOpen,
  onClose,
}) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !produk) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white bg-opacity-80 p-2 text-gray-600 hover:bg-opacity-100 hover:text-gray-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-96 lg:h-auto">
              {produk.gambar_utama ? (
                <Image
                  src={produk.gambar_utama}
                  alt={produk.nm_produk}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <svg
                    className="h-20 w-20 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="badge badge-primary text-white">
                  {produk.kategori_detail.nm_kategori}
                </div>
                <div
                  className={`badge ${
                    produk.stok > 0 ? "badge-success" : "badge-error"
                  } text-white`}
                >
                  {produk.stok > 0 ? `Stok: ${produk.stok}` : "Habis"}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 lg:p-8">
              {/* Product Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {produk.nm_produk}
              </h1>

              {/* UMKM Info */}
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="font-medium">
                  {produk.umkm_detail.profil_umkm.nm_bisnis ||
                    produk.umkm_detail.username}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(produk.harga)}
                </div>
                <div className="text-gray-500">per {produk.satuan}</div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Deskripsi Produk
                </h3>
                <p className="text-gray-700 leading-relaxed">{produk.desc}</p>
              </div>

              {/* UMKM Details */}
              {produk.umkm_detail.profil_umkm.desc_bisnis && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tentang UMKM
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {produk.umkm_detail.profil_umkm.desc_bisnis}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Informasi Kontak
                </h3>
                <div className="space-y-2">
                  {produk.umkm_detail.profil_umkm.tlp && (
                    <div className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {produk.umkm_detail.profil_umkm.tlp}
                      </span>
                    </div>
                  )}

                  {produk.umkm_detail.profil_umkm.alamat && (
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 text-gray-400 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {produk.umkm_detail.profil_umkm.alamat}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Dibuat:</span>
                    <br />
                    {formatDate(produk.tgl_dibuat)}
                  </div>
                  <div>
                    <span className="font-medium">Diperbarui:</span>
                    <br />
                    {formatDate(produk.tgl_update)}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full btn btn-primary"
                  disabled={produk.stok === 0}
                >
                  {produk.stok > 0 ? "Hubungi Penjual" : "Stok Habis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
