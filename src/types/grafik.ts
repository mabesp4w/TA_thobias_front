/** @format */

// types/grafik.ts
export interface GrafikPenjualanType {
  bulan: number;
  tahun: number;
  total_penjualan: number;
  jumlah_transaksi: number;
  nama_bulan: string;
}

export interface GrafikPenjualanUMKMType {
  umkm_id: string;
  nama_umkm: string;
  bulan: number;
  tahun: number;
  total_penjualan: number;
  jumlah_transaksi: number;
  nama_bulan: string;
}

export interface UMKMType {
  id: string;
  username: string;
  nama_umkm: string;
}

export interface RingkasanPenjualanType {
  total_penjualan: number;
  total_transaksi: number;
  total_produk_terjual: number;
  jumlah_umkm_aktif: number;
}

export interface FilterGrafikType {
  umkm_id?: string | null;
  tahun?: number;
  bulan_start?: number;
  bulan_end?: number;
}

export interface GrafikApiResponse<T> {
  status: string;
  data: T;
  filters_applied?: FilterGrafikType;
}
