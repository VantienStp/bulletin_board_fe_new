"use client";
import { useEffect, useState } from "react";
import "./admin.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaTachometerAlt, FaList, FaClone, FaThLarge, FaUsers } from "react-icons/fa";
import { BASE_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { getValidToken, clearToken } from "@/lib/auth";
import AdminHeader from "@/components/admin/Header";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/admin/categories", label: "Categories", icon: <FaList /> },
    { href: "/admin/cards", label: "Cards", icon: <FaClone /> },
    { href: "/admin/layouts", label: "Layouts", icon: <FaThLarge /> },
    { href: "/admin/users", label: "Users", icon: <FaUsers /> },
  ];

  useEffect(() => {
    (async () => {
      const token = await getValidToken();
      if (!token) {
        clearToken();
        router.push("/login");
      }
    })();
  }, [pathname, router]);


  return (
    <div className="admin-grid">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <a href="#">
            <img src={`${BASE_URL}/uploads/logo2.png`} alt="Dashboard Logo" />
          </a>
        </div>
        <ul>
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="setting">
            <Link
              href="/admin/settings"
              className={pathname === "/admin/settings" ? "active" : ""}
            >
              <span className="icon"><FaUsers /></span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* HEADER */}
      <AdminHeader />

      {/* MAIN CONTENT */}
      <main className="main-content">{children}</main>
    </div>
  );
}
