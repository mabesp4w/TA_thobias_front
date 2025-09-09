/** @format */

"use client";
import Image from "next/image";
import { FC } from "react";
import { PromosiProduk } from "@/types/promosi";

interface ProductCardProps {
  produk: PromosiProduk;
  onDetailClick?: (produk: PromosiProduk) => void;
}

const ProductCard: FC<ProductCardProps> = ({ produk, onDetailClick }) => {
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
      month: "short",
      year: "numeric",
    });
  };

  const handleCardClick = () => {
    if (onDetailClick) {
      onDetailClick(produk);
    }
  };

  return (
    <div
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <figure className="relative h-48 overflow-hidden">
        {produk.gambar_utama ? (
          <Image
            src={produk.gambar_utama}
            alt={produk.nm_produk}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
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

        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <div
            className={`badge ${
              produk.stok > 0 ? "badge-success" : "badge-error"
            } text-white`}
          >
            {produk.stok > 0 ? `Stok: ${produk.stok}` : "Habis"}
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <div className="badge badge-primary text-white">
            {produk.kategori_detail.nm_kategori}
          </div>
        </div>
      </figure>

      {/* Content Section */}
      <div className="card-body p-4">
        {/* Product Name */}
        <h3 className="card-title text-lg font-bold line-clamp-2 min-h-[3.5rem]">
          {produk.nm_produk}
        </h3>

        {/* UMKM Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <svg
            className="w-4 h-4"
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
          <span className="truncate">
            {produk.umkm_detail.profil_umkm.nm_bisnis ||
              produk.umkm_detail.username}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[2.5rem]">
          {produk.desc}
        </p>

        {/* Price and Unit */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(produk.harga)}
            </div>
            <div className="text-sm text-gray-500">per {produk.satuan}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center">
          <div className="text-xs text-gray-400">
            {formatDate(produk.tgl_update)}
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
