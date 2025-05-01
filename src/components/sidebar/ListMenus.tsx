/** @format */

import MenuType from "@/types/MenuType";
import { BriefcaseBusinessIcon } from "lucide-react";
import { BiCategory } from "react-icons/bi";
import { BsBook, BsHouseDoor, BsInfoLg } from "react-icons/bs";

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
          name: "Kecamatan",
          href: adminUrl("/tempat/kecamatan"),
        },
      ],
    },
    {
      name: "Kategori",
      href: adminUrl("/kategori-produk"),
      icon: <BiCategory />,
    },
    {
      name: "UMKM",
      href: adminUrl("/umkm"),
      icon: <BriefcaseBusinessIcon />,
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
          name: "Lokasi",
          href: adminUrl("/umkm/lokasi"),
        },
      ],
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
