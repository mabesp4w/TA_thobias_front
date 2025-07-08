/** @format */

// constants/mapConstant.ts

// Warna marker default untuk kategori yang tidak terdefinisi
export const DEFAULT_MARKER_COLOR = "#808080"; // Abu-abu

// Warna marker untuk setiap kategori lokasi (akan disesuaikan dengan data dari DB)
// Ini adalah contoh default, bisa di-extend sesuai kategori yang ada
export const MARKER_COLORS: Record<string, string> = {
  pasar: "#FF6B6B", // Merah
  supermarket: "#4ECDC4", // Cyan
  kios: "#FFD93D", // Kuning
  online: "#6C5CE7", // Ungu
  lainnya: "#FD79A8", // Pink
  umkm: "#00B894", // Hijau - untuk lokasi UMKM
} as const;

// Map styles yang tersedia
export const MAP_STYLES = [
  { name: "Streets", value: "mapbox://styles/mapbox/streets-v11" },
  { name: "Satellite", value: "mapbox://styles/mapbox/satellite-v9" },
  {
    name: "Satellite Streets",
    value: "mapbox://styles/mapbox/satellite-streets-v11",
  },
  { name: "Light", value: "mapbox://styles/mapbox/light-v10" },
  { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
] as const;

// Helper function untuk mendapatkan warna marker berdasarkan kategori
export const getMarkerColor = (
  kategoriId: string,
  kategoriLokasi?: any[]
): string => {
  if (!kategoriLokasi) return DEFAULT_MARKER_COLOR;

  // Cari nama kategori berdasarkan ID
  const kategori = kategoriLokasi.find((k) => k.id === kategoriId);
  if (!kategori) return DEFAULT_MARKER_COLOR;

  // Cek apakah ada warna yang terdefinisi untuk kategori ini
  const categoryName = kategori.nm_kategori_lokasi.toLowerCase();
  return MARKER_COLORS[categoryName] || DEFAULT_MARKER_COLOR;
};
