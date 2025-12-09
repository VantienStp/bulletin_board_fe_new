"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { authFetch, clearToken } from "@/lib/auth";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [userName, setUserName] = useState("Admin Kincharna");
  const menuRef = useRef(null);
  const router = useRouter();

  // Load username
  // Tailwind dark mode OFF – dùng theme bằng CSS variables
  useEffect(() => {
    const stored = localStorage.getItem("user_name");
    if (stored) setUserName(stored);

    const handleUpdate = () => {
      const updated = localStorage.getItem("user_name");
      setUserName(updated || "Admin Kincharna");
    };

    window.addEventListener("userNameUpdated", handleUpdate);

    // Apply theme
    document.documentElement.setAttribute("data-theme", theme);

    return () => window.removeEventListener("userNameUpdated", handleUpdate);
  }, [theme]);


  // Click outside dropdown
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        clearToken();
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header
      className="
        grid grid-cols-[2fr_1fr_1fr]
        items-center
        mt-[var(--margin-small)]
        mr-[var(--margin-small)]
        radi
        bg-white/80 dark:bg-[var(--color-bg-content)]
        px-8 pt-4
        text-gray-900 dark:text-[--color-text-primary]
        z-50 relative
        rounded-t-[var(--radius-medium)]
      "
    >
      {/* LEFT */}
      <div className="text-left font-bold text-2xl">
        TÒA ÁN NHÂN DÂN TP.HỒ CHÍ MINH
      </div>

      {/* CENTER */}
      <div className="flex justify-center"></div>

      {/* RIGHT */}
      <div ref={menuRef} className="flex items-center gap-4 justify-end relative">

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="
            w-8 h-8 rounded-full flex items-center justify-center
            shadow-inner hover:scale-110 transition
            bg-gray-200 dark:bg-gray-700
          "
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2 text-lg">
          Chào mừng
          <button
            onClick={() => setOpen(!open)}
            className="
              bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100
              px-4 py-1 rounded-md
              hover:bg-gray-300 dark:hover:bg-gray-600
              transition text-base capitalize
            "
          >
            {userName}
          </button>
        </div>

        {/* DROPDOWN */}
        <div
          className={`
            absolute right-0 top-14
            bg-white dark:bg-gray-800
            shadow-lg rounded-md border border-gray-200 dark:border-gray-700
            flex flex-col min-w-[160px] py-2
            transition-all duration-300 origin-top
            ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
          `}
        >
          <Link
            href="#"
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Hồ sơ
          </Link>

          <Link
            href="/admin/settings"
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cài đặt
          </Link>

          <hr className="border-gray-200 dark:border-gray-700 my-1" />

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
