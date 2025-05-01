/** @format */

import UserSidebar from "@/components/sidebar/UserSidebar";
import Auth from "../Auth";
import WelcomeContextProvider from "@/context/WelcomeContext";
import MenuContextProvider from "@/context/MenuContext";
import UserMobileMenu from "@/components/menu/UserMobileMenu";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WelcomeContextProvider>
      <MenuContextProvider>
        <div className="min-h-screen flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <UserSidebar />
          </div>

          {/* Mobile Menu */}
          <UserMobileMenu />
          {/* Main content for desktop */}
          <main className="flex-1 overflow-auto lg:mt-0 mt-12">{children}</main>
          <Auth />
        </div>
      </MenuContextProvider>
    </WelcomeContextProvider>
  );
}
