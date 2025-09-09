/** @format */

"use client";
import { FC } from "react";
import ProductCard from "./ProductCard";
import { PromosiProduk } from "@/types/promosi";

interface ProductGridProps {
  products: PromosiProduk[];
  isLoading: boolean;
  error: string | null;
  onProductClick?: (produk: PromosiProduk) => void;
}

const ProductGrid: FC<ProductGridProps> = ({
  products,
  isLoading,
  error,
  onProductClick,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="card bg-base-100 shadow-lg animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="card-body p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak Ada Produk
          </h3>
          <p className="text-gray-600 mb-4">
            Tidak ditemukan produk yang sesuai dengan filter yang dipilih.
          </p>
          <p className="text-sm text-gray-500">
            Coba ubah kata kunci pencarian atau hapus beberapa filter.
          </p>
        </div>
      </div>
    );
  }

  // Products grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((produk) => (
        <ProductCard
          key={produk.id}
          produk={produk}
          onDetailClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
