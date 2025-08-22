/** @format */

import MenuType from "@/types/MenuType";
import { UserPen } from "lucide-react";
import { BiAbacus, BiCategory } from "react-icons/bi";
import { BsBook, BsHouseDoor, BsInfoLg } from "react-icons/bs";
import { PiNewspaper } from "react-icons/pi";

const adminUrl = (path: string) => `/admin${path}`;
const userUrl = (path: string) => `${path}`;

const setAdminMenus = () => {
  const ListMenu: MenuType[] = [
    {
      name: "Dashboard",
      href: adminUrl("/dashboard"),
      icon: <BsHouseDoor />,
    },
    {
      name: "Tempat",
      href: adminUrl("/tempat"),
      icon: <BsInfoLg />,
      slug: "tempat",
      subMenus: [
        {
          name: "Provinsi",
          href: adminUrl("/tempat/provinsi"),
        },
        {
          name: "Kabupaten",
          href: adminUrl("/tempat/kabupaten"),
        },
        {
          name: "Distrik",
          href: adminUrl("/tempat/kecamatan"),
        },
      ],
    },
    {
      name: "Kategori",
      icon: <BiCategory />,
      slug: "kategori",
      subMenus: [
        {
          name: "Produk",
          href: adminUrl("/kategori/produk"),
        },
        {
          name: "Lokasi Penjualan",
          href: adminUrl("/kategori/lokasi-penjualan"),
        },
      ],
    },
    {
      name: "UMKM",
      href: adminUrl("/umkm"),
      icon: <BiAbacus />,
      slug: "umkm",
      subMenus: [
        {
          name: "Akun",
          href: adminUrl("/umkm/akun"),
        },
        {
          name: "Profile",
          href: adminUrl("/umkm/profile"),
        },
        {
          name: "Lokasi Penjualan",
          href: adminUrl("/umkm/lokasi-penjualan"),
        },
      ],
    },
    {
      name: "Laporan",
      icon: <PiNewspaper />,
      slug: "laporan",
      subMenus: [
        {
          name: "Statistik",
          href: adminUrl("/laporan-statistik"),
        },
        {
          name: "Export Excel",
          href: adminUrl("/export-excel"),
        },
      ],
    },
    {
      name: "Administrator",
      href: adminUrl("/administrator"),
      icon: <UserPen />,
      slug: "administrator",
    },
  ];

  return ListMenu;
};

const setUserMenus = () => {
  const ListMenu: MenuType[] = [
    {
      name: "Dashboard",
      href: userUrl("/dashboard"),
      icon: <BsHouseDoor />,
    },
    {
      name: "Kategori",
      href: userUrl("/categories"),
      icon: <BsInfoLg />,
    },
    {
      name: "Buku",
      href: userUrl("/books/lists"),
      icon: <BsBook />,
    },
  ];

  return ListMenu;
};

export { setAdminMenus, setUserMenus };
