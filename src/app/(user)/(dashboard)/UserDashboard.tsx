/** @format */

"use client";
import React from "react";
import { useWelcomeContext } from "@/context/WelcomeContext";
import { useEffect } from "react";
import { BiStore, BiPackage, BiCart, BiLocationPlus } from "react-icons/bi";
import { BsGraphUp } from "react-icons/bs";
import Link from "next/link";

const UserDashboard = () => {
  const { setWelcome } = useWelcomeContext();

  useEffect(() => {
    setWelcome("Dashboard UMKM");
  }, [setWelcome]);

  const menuItems = [
    {
      title: "Profil Bisnis",
      description: "Lengkapi dan kelola informasi bisnis Anda",
      icon: <BiStore className="h-8 w-8" />,
      href: "/user/profil",
      color: "bg-blue-500",
    },
    {
      title: "Produk Saya",
      description: "Kelola daftar produk yang Anda jual",
      icon: <BiPackage className="h-8 w-8" />,
      href: "/user/produk",
      color: "bg-green-500",
    },
    {
      title: "Lokasi Penjualan",
      description: "Kelola lokasi penjualan produk Anda",
      icon: <BiLocationPlus className="h-8 w-8" />,
      href: "/user/lokasi-penjualan",
      color: "bg-purple-500",
    },
    {
      title: "Laporan Penjualan",
      description: "Catat dan lihat laporan penjualan Anda",
      icon: <BiCart className="h-8 w-8" />,
      href: "/user/laporan-penjualan",
      color: "bg-orange-500",
    },
    {
      title: "Statistik Bisnis",
      description: "Lihat perkembangan bisnis Anda",
      icon: <BsGraphUp className="h-8 w-8" />,
      href: "/user/statistik",
      color: "bg-red-500",
    },
  ];

  return (
    <section className="flex flex-col h-full p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Selamat Datang di Dashboard UMKM
        </h1>
        <p className="text-gray-600">
          Kelola bisnis Anda dengan mudah melalui menu di bawah ini
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

      {/* Quick Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Ringkasan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Total Produk</div>
            <div className="stat-value text-primary">25</div>
            <div className="stat-desc">Produk aktif</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Penjualan Hari Ini</div>
            <div className="stat-value text-secondary">Rp 5.2M</div>
            <div className="stat-desc">↗︎ 5% dari kemarin</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Lokasi Penjualan</div>
            <div className="stat-value">8</div>
            <div className="stat-desc">Lokasi aktif</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Rating Bisnis</div>
            <div className="stat-value">4.8</div>
            <div className="stat-desc">Dari 120 ulasan</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
