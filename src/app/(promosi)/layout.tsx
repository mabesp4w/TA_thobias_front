/** @format */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promosi Produk UMKM | Platform UMKM Indonesia",
  description:
    "Temukan berbagai produk berkualitas dari UMKM lokal. Dukung ekonomi kreatif Indonesia dengan berbelanja produk-produk unggulan dari usaha mikro, kecil, dan menengah.",
  keywords: [
    "UMKM",
    "produk lokal",
    "usaha kecil",
    "ekonomi kreatif",
    "Indonesia",
    "promosi",
    "produk berkualitas",
    "usaha mikro",
    "kecil menengah",
  ],
  openGraph: {
    title: "Promosi Produk UMKM | Platform UMKM Indonesia",
    description:
      "Temukan berbagai produk berkualitas dari UMKM lokal. Dukung ekonomi kreatif Indonesia dengan berbelanja produk-produk unggulan.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promosi Produk UMKM | Platform UMKM Indonesia",
    description:
      "Temukan berbagai produk berkualitas dari UMKM lokal. Dukung ekonomi kreatif Indonesia dengan berbelanja produk-produk unggulan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Ganti dengan kode verifikasi Google Search Console
  },
};

export default function PromosiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Main content */}
      {children}
    </>
  );
}
