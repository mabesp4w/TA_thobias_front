/** @format */

"use client";
import { FC, useState, useEffect } from "react";
import { KategoriOption, PromosiFilter } from "@/types/promosi";

interface FilterSectionProps {
  categories: KategoriOption[];
  currentFilter: PromosiFilter;
  onFilterChange: (filter: PromosiFilter) => void;
  totalProducts?: number;
}

const FilterSection: FC<FilterSectionProps> = ({
  categories,
  currentFilter,
  onFilterChange,
  totalProducts = 0,
}) => {
  const [searchInput, setSearchInput] = useState(currentFilter.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    currentFilter.kategori || ""
  );
  const [sortBy, setSortBy] = useState(currentFilter.sortby || "");
  const [order, setOrder] = useState(currentFilter.order || "desc");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentFilter.search) {
        onFilterChange({
          ...currentFilter,
          search: searchInput,
          page: 1, // Reset to first page when searching
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onFilterChange({
      ...currentFilter,
      kategori: categoryId || undefined,
      page: 1,
    });
  };

  const handleSortChange = (newSortBy: string, newOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    onFilterChange({
      ...currentFilter,
      sortby: newSortBy || undefined,
      order: newOrder,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSelectedCategory("");
    setSortBy("");
    setOrder("desc");
    onFilterChange({
      page: 1,
      limit: currentFilter.limit,
    });
  };

  const hasActiveFilters = searchInput || selectedCategory || sortBy;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Filter Produk</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ditemukan {totalProducts} produk
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="btn btn-ghost btn-sm mt-2 sm:mt-0"
          >
            <svg
              className="w-4 h-4 mr-1"
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
            Hapus Filter
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Cari Produk</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nama produk atau UMKM..."
              className="input input-bordered w-full pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Kategori</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nm_kategori}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Urutkan</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={sortBy}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const [field, direction] = value.split("_");
                handleSortChange(field, direction as "asc" | "desc");
              } else {
                handleSortChange("", "desc");
              }
            }}
          >
            <option value="">Default</option>
            <option value="nm_produk_asc">Nama A-Z</option>
            <option value="nm_produk_desc">Nama Z-A</option>
            <option value="harga_asc">Harga Terendah</option>
            <option value="harga_desc">Harga Tertinggi</option>
            <option value="tgl_dibuat_desc">Terbaru</option>
            <option value="tgl_dibuat_asc">Terlama</option>
          </select>
        </div>

        {/* View Options */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Tampilan</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={currentFilter.limit || 12}
            onChange={(e) =>
              onFilterChange({
                ...currentFilter,
                limit: parseInt(e.target.value),
                page: 1,
              })
            }
          >
            <option value="12">12 per halaman</option>
            <option value="24">24 per halaman</option>
            <option value="36">36 per halaman</option>
            <option value="48">48 per halaman</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filter aktif:</span>

            {searchInput && (
              <div className="badge badge-primary gap-1">
                Pencarian: &quot;{searchInput}&quot;
                <button
                  onClick={() => {
                    setSearchInput("");
                    onFilterChange({
                      ...currentFilter,
                      search: undefined,
                      page: 1,
                    });
                  }}
                  className="ml-1"
                >
                  ×
                </button>
              </div>
            )}

            {selectedCategory && (
              <div className="badge badge-secondary gap-1">
                Kategori:{" "}
                {categories.find((c) => c.id === selectedCategory)?.nm_kategori}
                <button
                  onClick={() => handleCategoryChange("")}
                  className="ml-1"
                >
                  ×
                </button>
              </div>
            )}

            {sortBy && (
              <div className="badge badge-accent gap-1">
                Urutan:{" "}
                {sortBy === "nm_produk"
                  ? order === "asc"
                    ? "Nama A-Z"
                    : "Nama Z-A"
                  : sortBy === "harga"
                  ? order === "asc"
                    ? "Harga Terendah"
                    : "Harga Tertinggi"
                  : sortBy === "tgl_dibuat"
                  ? order === "desc"
                    ? "Terbaru"
                    : "Terlama"
                  : "Custom"}
                <button
                  onClick={() => handleSortChange("", "desc")}
                  className="ml-1"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
