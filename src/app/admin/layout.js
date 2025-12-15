"use client";

import { useAuth } from "@/context/AuthContext";
import AdminHeader from "@/components/admin/Header";
import { BASE_URL } from "@/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/core.css";
import "@/styles/tokens.css";
import "@/styles/admin.css";

import {
  FaTachometerAlt,
  FaFolderOpen,
  FaClone,
  FaThLarge,
  FaUsers,
  FaCogs,
} from "react-icons/fa";


export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return <div className="checking">Đang kiểm tra quyền truy cập...</div>;

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const menu = [
    { href: "/admin", label: "Tổng Quan", icon: <FaTachometerAlt /> },
    { href: "/admin/categories", label: "Danh mục", icon: <FaFolderOpen /> },
    { href: "/admin/cards", label: "Nội dung", icon: <FaClone /> },
    { href: "/admin/layouts", label: "Bố cục", icon: <FaThLarge /> },
    { href: "/admin/users", label: "Người dùng", icon: <FaUsers /> },
  ];

  return (
    <div className="admin-grid">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <Link href="/admin/dashboard">
            <img src={`${BASE_URL}/uploads/logo2.png`} alt="Dashboard Logo" />
          </Link>
        </div>

        <ul>
          {/* MENU CHÍNH */}
          {menu.map((item) => {
            let isActive = false;

            if (item.href === "/admin") {
              // Dashboard (root) chỉ active khi đang đúng tại /admin
              isActive = pathname === "/admin";
            } else {
              // Các trang khác dùng startsWith đúng chuẩn
              isActive = pathname.startsWith(item.href);
            }

            return (
              <li key={item.href}>
                <Link href={item.href} className={isActive ? "active" : ""}>
                  <span className="icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  <div className="corner-bottom"></div>
                </Link>
              </li>
            );
          })}


          <li className="setting">
            <Link
              href="/admin/settings"
              className={pathname.startsWith("/admin/settings") ? "active" : ""}
            >
              <span className="icon"><FaCogs /></span>
              <span>Settings</span>
              <div className="corner-bottom"></div>
            </Link>
          </li>
        </ul>
      </aside>

      <AdminHeader />

      <main className="main-content">{children}</main>

    </div>
  );
}
