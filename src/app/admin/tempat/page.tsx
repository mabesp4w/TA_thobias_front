/** @format */

"use client";
import { useWelcomeContext } from "@/context/WelcomeContext";
import { useEffect } from "react";
import { BiMap } from "react-icons/bi";
import Link from "next/link";

const Content = () => {
  const { setWelcome } = useWelcomeContext();

  useEffect(() => {
    setWelcome("Dashboard Admin WWF");
  }, [setWelcome]);

  const menuItems = [
    {
      title: "Provinsi",
      description: "Kelola data provinsi",
      icon: <BiMap className="h-8 w-8" />,
      href: "/admin/tempat/provinsi",
      color: "bg-blue-500",
    },
    {
      title: "Kabupaten",
      description: "Kelola data kabupaten",
      icon: <BiMap className="h-8 w-8" />,
      href: "/admin/tempat/kabupaten",
      color: "bg-green-500",
    },
    {
      title: "Kecamatan",
      description: "Kelola data kecamatan",
      icon: <BiMap className="h-8 w-8" />,
      href: "/admin/tempat/kecamatan",
      color: "bg-yellow-500",
    },
  ];

  return (
    <section className="flex flex-col h-full p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Data Tempat</h1>
        <p className="text-gray-600">
          Kelola data provinsi, kabupaten, dan kecamatan
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
