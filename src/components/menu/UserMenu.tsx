/** @format */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiHome,
  BiStore,
  BiPackage,
  BiCart,
  BiLocationPlus,
  BiLineChart,
  BiLogOut,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { useRouter } from "next/navigation";
import useLogout from "@/stores/auth/logout";
import handleLogout from "@/app/auth/logout/logout";
import { useState } from "react";
import { UserPen } from "lucide-react";

interface SubMenuItem {
  title: string;
  icon?: JSX.Element;
  href: string;
}

interface MenuItem {
  title: string;
  icon: JSX.Element;
  href: string;
  subMenu?: SubMenuItem[];
}

const UserMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setLogout } = useLogout();
  const [loadLogout, setLoadLogout] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <BiHome className="h-5 w-5" />,
      href: "/umkm/dashboard",
    },
    {
      title: "Profil Bisnis",
      icon: <BiStore className="h-5 w-5" />,
      href: "/umkm/profil",
    },
    {
      title: "Produk",
      icon: <BiPackage className="h-5 w-5" />,
      href: "/umkm/produk",
    },
    {
      title: "Lokasi Penjualan",
      icon: <BiLocationPlus className="h-5 w-5" />,
      href: "/umkm/lokasi-penjualan",
    },
    {
      title: "Laporan Penjualan",
      icon: <BiCart className="h-5 w-5" />,
      href: "/umkm/laporan-penjualan",
    },
    {
      title: "File Laporan",
      icon: <BiCart className="h-5 w-5" />,
      href: "/umkm/file-penjualan",
      subMenu: [
        {
          title: "Upload File",
          href: "/umkm/file-penjualan",
        },
        {
          title: "Export Excel",
          href: "/umkm/export-excel",
        },
      ],
    },
    {
      title: "Statistik",
      icon: <BiLineChart className="h-5 w-5" />,
      href: "/umkm/statistik",
    },
  ];

  const isActive = (href: string) => {
    // Untuk halaman root, hanya cocokkan path yang tepat sama
    if (href === "/") {
      return pathname === "/";
    }

    // Untuk menu lain, periksa apakah pathname dimulai dengan href
    return pathname.startsWith(href);
  };

  const isParentActive = (item: MenuItem) => {
    // Cek apakah menu utama atau salah satu submenu aktif
    if (isActive(item.href)) return true;

    if (item.subMenu) {
      return item.subMenu.some((sub) => isActive(sub.href));
    }

    return false;
  };

  const toggleSubmenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  // Auto expand menu yang aktif
  useState(() => {
    const activeMenus = menuItems
      .filter((item) => item.subMenu && isParentActive(item))
      .map((item) => item.title);
    setExpandedMenus(activeMenus);
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logo atau Header */}
      <div className="p-4 border-b border-base-300">
        <h1 className="text-xl font-bold text-primary">UMKM Dashboard</h1>
        <p className="text-sm text-base-content/70">Sistem Informasi UMKM</p>
      </div>

      {/* Menu Items */}
      <ul className="menu p-4 flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.subMenu ? (
              <>
                {/* Menu dengan submenu */}
                <div
                  onClick={() => toggleSubmenu(item.title)}
                  className={`flex items-center justify-between cursor-pointer ${
                    isParentActive(item)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-base-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {expandedMenus.includes(item.title) ? (
                    <BiChevronUp className="h-4 w-4" />
                  ) : (
                    <BiChevronDown className="h-4 w-4" />
                  )}
                </div>

                {/* Submenu items */}
                {expandedMenus.includes(item.title) && (
                  <ul className="mt-1">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem.href}
                          className={`pl-11 flex items-center gap-2 ${
                            isActive(subItem.href)
                              ? "bg-primary text-primary-content"
                              : "hover:bg-base-200"
                          }`}
                        >
                          {subItem.icon && subItem.icon}
                          <span className="text-sm">{subItem.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              /* Menu tanpa submenu */
              <Link
                href={item.href}
                className={`flex items-center gap-3 ${
                  isActive(item.href)
                    ? "active bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      {loadLogout ? (
        <div className="p-4 border-t border-base-300 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="p-4 border-t border-base-300 flex flex-col">
          {/* akun */}
          <Link
            href="/umkm/akun"
            className="flex items-center gap-3 hover:bg-base-200 pl-4"
          >
            <UserPen className="h-5 w-5" />
            <span>Akun</span>
          </Link>
          <button
            onClick={() => handleLogout({ setLogout, setLoadLogout, router })}
            className="btn btn-ghost btn-block justify-start gap-3 text-error hover:bg-error/10"
          >
            <BiLogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
