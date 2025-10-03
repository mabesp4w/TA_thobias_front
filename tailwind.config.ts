/** @format */

import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        linear:
          "linear-gradient(77deg, rgba(10,38,64,1) 16%, rgba(28,61,91,1) 79%)",
        "1": "url('/images/bg/2.jpg')",
      },
      fontFamily: {
        cabin: ["Cabin", "sans-serif"],
        "comic-neue": ["Comic Neue", "sans-serif"],
        arvo: ["Arvo", "serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#7c3aed",
          "primary-content": "#ffffff",
          "secondary": "#64748b",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-content": "#ffffff",
          "neutral": "#1f2937",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          "base-content": "#1f2937",
          "info": "#3b82f6",
          "info-content": "#ffffff",
          "success": "#10b981",
          "success-content": "#ffffff",
          "warning": "#f59e0b",
          "warning-content": "#ffffff",
          "error": "#ef4444",
          "error-content": "#ffffff",
        },
      },
      {
        dark: {
          "primary": "#8b5cf6",
          "primary-content": "#ffffff",
          "secondary": "#94a3b8",
          "secondary-content": "#ffffff",
          "accent": "#fbbf24",
          "accent-content": "#000000",
          "neutral": "#374151",
          "neutral-content": "#ffffff",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f1f5f9",
          "info": "#60a5fa",
          "info-content": "#ffffff",
          "success": "#34d399",
          "success-content": "#000000",
          "warning": "#fbbf24",
          "warning-content": "#000000",
          "error": "#f87171",
          "error-content": "#ffffff",
        },
      },
      "fantasy",
    ],
  },
};
export default config;
