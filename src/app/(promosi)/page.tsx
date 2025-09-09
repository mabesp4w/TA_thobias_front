/** @format */

"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterSection from "./components/FilterSection";
import ProductGrid from "./components/ProductGrid";
import ProductDetailModal from "./components/ProductDetailModal";
import StatsSection from "./components/StatsSection";
import FeaturedSection from "./components/FeaturedSection";
import PaginationDef from "@/components/pagination/PaginationDef";
import { PromosiFilter, PromosiProduk } from "@/types/promosi";
import usePromosiStore from "@/stores/api/PromosiStore";
import Link from "next/link";

const PromosiContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Destructuring store dengan fallback untuk properties yang mungkin belum ada
  const store = usePromosiStore();
  const {
    dtPromosi,
    dtKategori,
    isLoading,
    error,
    setPromosi,
    setKategoriPromosi,
    clearError,
  } = store;

  // Safely access optional properties with fallbacks
  const dtFeatured = store.dtFeatured || [];
  const dtStats = store.dtStats || null;
  const isLoadingCategories = store.isLoadingCategories || false;
  const isLoadingFeatured = store.isLoadingFeatured || false;
  const isLoadingStats = store.isLoadingStats || false;
  const setFeaturedProducts =
    store.setFeaturedProducts || (() => Promise.resolve({ status: "error" }));
  const setStats =
    store.setStats || (() => Promise.resolve({ status: "error" }));

  const [selectedProduct, setSelectedProduct] = useState<PromosiProduk | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get current filter from URL params
  const getCurrentFilter = (): PromosiFilter => {
    return {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      kategori: searchParams.get("kategori") || undefined,
      sortby: searchParams.get("sortby") || undefined,
      order: (searchParams.get("order") as "asc" | "desc") || "desc",
      limit: parseInt(searchParams.get("limit") || "12"),
    };
  };

  const [currentFilter, setCurrentFilter] = useState<PromosiFilter>(
    getCurrentFilter()
  );

  // Update URL when filter changes
  const updateURL = (filter: PromosiFilter) => {
    const params = new URLSearchParams();

    if (filter.page && filter.page > 1)
      params.set("page", filter.page.toString());
    if (filter.search) params.set("search", filter.search);
    if (filter.kategori) params.set("kategori", filter.kategori);
    if (filter.sortby) params.set("sortby", filter.sortby);
    if (filter.order && filter.order !== "desc")
      params.set("order", filter.order);
    if (filter.limit && filter.limit !== 12)
      params.set("limit", filter.limit.toString());

    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : "/";

    router.push(newURL, { scroll: false });
  };

  // Handle filter change
  const handleFilterChange = (newFilter: PromosiFilter) => {
    setCurrentFilter(newFilter);
    updateURL(newFilter);
    setPromosi(newFilter);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilter = { ...currentFilter, page };
    handleFilterChange(newFilter);
  };

  // Handle product detail
  const handleProductClick = (produk: PromosiProduk) => {
    setSelectedProduct(produk);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Load data on mount and filter changes
  useEffect(() => {
    const filter = getCurrentFilter();
    setCurrentFilter(filter);
    setPromosi(filter);
    setKategoriPromosi();

    // Load optional data if functions exist
    if (setFeaturedProducts) {
      setFeaturedProducts().catch(console.error);
    }
    if (setStats) {
      setStats().catch(console.error);
    }
  }, [setPromosi, setKategoriPromosi, setFeaturedProducts, setStats]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Produk UMKM
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Temukan berbagai produk berkualitas dari UMKM lokal. Dukung
                ekonomi kreatif Indonesia dengan berbelanja produk-produk
                unggulan.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 flex justify-center lg:justify-end">
              {/* Admin Login Button - Positioned on the right for improved layout */}
              <Link href="/auth/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics - Only show if dtStats exists */}
        {(dtStats || isLoadingStats) && (
          <StatsSection stats={dtStats} isLoading={isLoadingStats} />
        )}

        {/* Featured Products - Only show if dtFeatured exists or is loading */}
        {(dtFeatured.length > 0 || isLoadingFeatured) && (
          <FeaturedSection
            products={dtFeatured}
            isLoading={isLoadingFeatured}
            onProductClick={handleProductClick}
          />
        )}

        {/* Main Products Section */}
        <div id="main-products">
          {/* Filters */}
          <FilterSection
            categories={dtKategori}
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            totalProducts={dtPromosi?.total || 0}
          />

          {/* Products Grid */}
          <ProductGrid
            products={dtPromosi?.data || []}
            isLoading={isLoading}
            error={error}
            onProductClick={handleProductClick}
          />

          {/* Pagination */}
          {dtPromosi && dtPromosi.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <PaginationDef
                currentPage={dtPromosi.current_page}
                totalPages={dtPromosi.last_page}
                setPage={handlePageChange}
              />
            </div>
          )}

          {/* Empty State for No Categories */}
          {!isLoading && !isLoadingCategories && dtKategori.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Sedang memuat kategori produk...</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        produk={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 btn btn-circle btn-primary shadow-lg"
        aria-label="Back to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};

const PromosiPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      }
    >
      <PromosiContent />
    </Suspense>
  );
};

export default PromosiPage;
