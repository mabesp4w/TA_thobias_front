/** @format */
"use client";
import { useEffect } from "react";

const DeviceTheme = () => {
  useEffect(() => {
    const applyTheme = () => {
      const userPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const root = window.document.documentElement;

      if (userPrefersDark) {
        root.setAttribute("data-theme", "dark");
        root.classList.add("dark");
      } else {
        root.setAttribute("data-theme", "light");
        root.classList.remove("dark");
      }
    };

    // Apply theme on mount
    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme();
    
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return null;
};

export default DeviceTheme;
