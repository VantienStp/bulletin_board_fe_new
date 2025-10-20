"use client";
import "./admin.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaList, FaClone, FaThLarge, FaUsers} from "react-icons/fa";
import { BASE_URL } from "@/lib/api";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { href: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/admin/categories", label: "Categories", icon: <FaList /> },
    { href: "/admin/cards", label: "Cards", icon: <FaClone /> },
    { href: "/admin/layouts", label: "Layouts", icon: <FaThLarge /> },
    { href: "/admin/users", label: "Users", icon: <FaUsers /> },
    { href: "/admin/users", label: "Settings", icon: <FaUsers /> },
    
  ];

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
          {menu
            .filter((item) => item.label !== "Settings") // các item bình thường
            .map((item) => (
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

          {/* SETTINGS nằm dưới cùng */}
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
      <header className="main-header">
        <div className="header-content">
          <h1 className="header-title">Trang Quản Trị Toà Án</h1>
          <div className="header-info">
            <span>{new Date().toLocaleDateString("vi-VN")}</span>
            <span className="admin-role">Admin</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">{children}</main>
    </div>
  );
}
