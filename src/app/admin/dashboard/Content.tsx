/** @format */

"use client";
import { useWelcomeContext } from "@/context/WelcomeContext";
import { useEffect } from "react";
import {
  BiMap,
  BiStore,
  BiPackage,
  BiLocationPlus,
  BiLineChart,
} from "react-icons/bi";
import Link from "next/link";

const Content = () => {
  const { setWelcome } = useWelcomeContext();

  useEffect(() => {
    setWelcome("Dashboard Admin WWF");
  }, [setWelcome]);

  const menuItems = [
    {
      title: "Data Wilayah",
      description: "Kelola data provinsi, kabupaten, dan distrik",
      icon: <BiMap className="h-8 w-8" />,
      href: "/admin/tempat",
      color: "bg-blue-500",
    },
    {
      title: "Data UMKM",
      description: "Kelola data UMKM yang terdaftar",
      icon: <BiStore className="h-8 w-8" />,
      href: "/admin/umkm/akun",
      color: "bg-green-500",
    },
    {
      title: "Kategori Produk",
      description: "Kelola kategori produk UMKM",
      icon: <BiPackage className="h-8 w-8" />,
      href: "/admin/kategori-produk",
      color: "bg-purple-500",
    },
    {
      title: "Lokasi UMKM",
      description: "Pemetaan lokasi UMKM di seluruh wilayah",
      icon: <BiLocationPlus className="h-8 w-8" />,
      href: "/admin/umkm/pemetaan-umkm",
      color: "bg-orange-500",
    },
    {
      title: "Lokasi Penjualan",
      description: "Pemetaan lokasi penjualan di seluruh wilayah",
      icon: <BiLocationPlus className="h-8 w-8" />,
      href: "/admin/lokasi-penjualan",
      color: "bg-yellow-500",
    },

    {
      title: "Laporan Statistik",
      description: "Laporan statistik keseluruhan",
      icon: <BiLineChart className="h-8 w-8" />,
      href: "/admin/laporan-statistik",
      color: "bg-indigo-500",
    },
  ];

  return (
    <section className="flex flex-col h-full p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard Admin WWF</h1>
        <p className="text-gray-600">
          Monitoring dan pengelolaan data UMKM binaan WWF
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="card-body">
                <div
                  className={`w-14 h-14 rounded-lg ${item.color} flex items-center justify-center text-white mb-4`}
                >
                  {item.icon}
                </div>
                <h2 className="card-title text-lg">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Content;
