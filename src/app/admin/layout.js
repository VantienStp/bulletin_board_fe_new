"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getValidToken, clearToken } from "@/lib/auth";
import AdminHeader from "@/components/admin/Header";
import { BASE_URL } from "@/lib/api";
import {
  FaTachometerAlt, FaFolderOpen, FaClone, FaThLarge, FaUsers, FaCogs
} from "react-icons/fa";
import Link from "next/link";
import "./admin.css";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { href: "/admin/dashboard", label: "Tổng Quan", icon: <FaTachometerAlt /> },
    { href: "/admin/categories", label: "Danh mục", icon: <FaFolderOpen /> },
    { href: "/admin/cards", label: "Nội dung", icon: <FaClone /> },
    { href: "/admin/layouts", label: "Bố cục", icon: <FaThLarge /> },
    { href: "/admin/users", label: "Người dùng", icon: <FaUsers /> },
  ];

  useEffect(() => {
    (async () => {
      const token = await getValidToken();
      if (!token) {
        clearToken();
        setSessionExpired(true); // 👈 Hiện thông báo
        setTimeout(() => {
          router.replace("/login");
        }, 2000); // ⏳ Đợi 2s rồi mới chuyển trang
      } else {
        setLoading(false);
      }
    })();
  }, [pathname]);

  if (loading) {
    return <div className="checking">Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="admin-grid">
      {/* 🔔 Thông báo session hết hạn */}
      {sessionExpired && (
        <div className="session-toast">
          Phiên đăng nhập đã kết thúc, vui lòng đăng nhập lại.
        </div>
      )}

      <aside className="sidebar">
        <div className="logo">
          <Link href="/admin/dashboard">
            <img src={`${BASE_URL}/uploads/logo2.png`} alt="Dashboard Logo" />
          </Link>
        </div>
        <ul>
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span className="icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="setting">
            <Link
              href="/admin/settings"
              className={pathname === "/admin/settings" ? "active" : ""}
            >
              <span className="icon"><FaCogs /></span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </aside>

      <AdminHeader />
      <main className="main-content">{children}</main>
    </div>
  );
}
