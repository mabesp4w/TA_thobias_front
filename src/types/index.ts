/** @format */

// index.ts

// TypeScript types corresponding to the Django models

export interface ProvinsiType {
  id: string; // UUID
  nm_provinsi: string;
}

export interface KabupatenType {
  id: string; // UUID
  provinsi: string; // ForeignKey to Provinsi
  provinsi_detail: ProvinsiType; // ForeignKey to Provinsi
  nm_kabupaten: string;
  kode?: string; // Optional
  is_kota: boolean;
}

export interface KecamatanType {
  id: string; // UUID
  kabupaten: string;
  kabupaten_detail: KabupatenType; // ForeignKey to Kabupaten
  nm_kecamatan: string;
  kode?: string; // Optional
}

export interface ProfilUMKMType {
  id: string; // UUID
  user: string; // User ID (OneToOneField to User model)
  nm_bisnis?: string; // Optional
  alamat?: string; // Optional
  tlp?: string; // Optional
  desc_bisnis?: string; // Optional
  tgl_bergabung: string; // DateTime
}

export interface LokasiUMKMType {
  id: string; // UUID
  pengguna: string; // User ID (ForeignKey to User)
  latitude: number;
  longitude: number;
  alamat_lengkap: string;
  kecamatan: string;
  kecamatan_detail: KecamatanType; // ForeignKey to Kecamatan
  kode_pos?: string; // Optional
  tgl_update: string; // DateTime
}

export interface KategoriProdukType {
  id: string; // UUID
  nm_kategori: string;
  desc?: string; // Optional
}

export interface ProdukType {
  id: string; // UUID
  umkm: string; // User ID (ForeignKey to User)
  kategori: string;
  kategori_detail: KategoriProdukType; // ForeignKey to KategoriProduk
  nm_produk: string;
  desc: string;
  harga: number; // DecimalField
  stok: number; // PositiveIntegerField
  satuan: string;
  bahan_baku?: string; // Optional
  metode_produksi?: string; // Optional
  aktif: boolean;
  tgl_dibuat: string; // DateTime
  tgl_update: string; // DateTime
}

export interface LokasiPenjualanType {
  id: string; // UUID
  nm_lokasi: string;
  tipe_lokasi: string;
  alamat: string;
  latitude?: number; // Optional
  longitude?: number; // Optional
  kecamatan?: string; // Optional
  kecamatan_detail?: KecamatanType; // Optional (ForeignKey to Kecamatan)
  tlp_pengelola?: string; // Optional
}

export interface ProdukTerjualType {
  id: string; // UUID
  produk: ProdukType; // ForeignKey to Produk
  lokasi_penjualan: LokasiPenjualanType; // ForeignKey to LokasiPenjualan
  tgl_penjualan: string; // Date
  jumlah_terjual: number; // PositiveIntegerField
  harga_jual: number; // DecimalField
  total_penjualan: number; // DecimalField
  catatan?: string; // Optional
  tgl_pelaporan: string; // DateTime
}

export interface UserType {
  id?: string; // UUID
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  show_password?: string;
  is_staff?: boolean;
  is_active?: boolean;
  last_login?: string; // DateTime
  date_joined?: string; // DateTime
  profile?: ProfilUMKMType;
}
