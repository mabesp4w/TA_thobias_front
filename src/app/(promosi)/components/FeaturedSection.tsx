/** @format */

"use client";
import { FC } from "react";
import ProductCard from "./ProductCard";
import { PromosiProduk } from "@/types/promosi";

interface FeaturedSectionProps {
  products: PromosiProduk[];
  isLoading: boolean;
  onProductClick?: (produk: PromosiProduk) => void;
}

const FeaturedSection: FC<FeaturedSectionProps> = ({
  products,
  isLoading,
  onProductClick,
}) => {
  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-lg animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="card-body p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Produk Unggulan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Temukan produk-produk terbaru dan terpopuler dari UMKM pilihan
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((produk) => (
          <ProductCard
            key={produk.id}
            produk={produk}
            onDetailClick={onProductClick}
          />
        ))}
      </div>

      {/* View All Button */}
      {products.length > 4 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              // Scroll ke section produk utama
              const productSection = document.getElementById("main-products");
              if (productSection) {
                productSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="btn btn-outline btn-primary btn-lg"
          >
            Lihat Semua Produk
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedSection;
