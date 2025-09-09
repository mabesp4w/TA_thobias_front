/** @format */

export interface PromosiProduk {
  id: string;
  nm_produk: string;
  desc: string;
  harga: number;
  stok: number;
  satuan: string;
  gambar_utama?: string;
  aktif: boolean;
  kategori_detail: {
    id: string;
    nm_kategori: string;
    desc?: string;
  };
  umkm_detail: {
    id: string;
    username: string;
    profil_umkm: {
      nm_bisnis: string;
      alamat?: string;
      tlp?: string;
      desc_bisnis?: string;
    };
  };
  tgl_dibuat: string;
  tgl_update: string;
}

export interface PromosiResponse {
  data: PromosiProduk[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PromosiFilter {
  page?: number;
  search?: string;
  kategori?: string;
  sortby?: string;
  order?: "asc" | "desc";
  limit?: number;
  harga_min?: number;
  harga_max?: number;
  has_stock?: boolean;
  umkm_name?: string;
  created_after?: string;
  created_before?: string;
  satuan?: string;
}

export interface KategoriOption {
  id: string;
  nm_kategori: string;
  count?: number;
}
