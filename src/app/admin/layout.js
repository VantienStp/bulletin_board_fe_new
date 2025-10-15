
"use client";
import "./admin.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaList,
  FaClone,
  FaThLarge,
  FaUsers,
  FaCogs,
  FaGavel,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { href: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/admin/categories", label: "Categories", icon: <FaList /> },
    { href: "/admin/cards", label: "Cards", icon: <FaClone /> },
    { href: "/admin/layouts", label: "Layouts", icon: <FaThLarge /> },
    { href: "/admin/users", label: "Users", icon: <FaUsers /> },
    // { href: "/admin/settings", label: "Settings", icon: <FaCogs /> },
  ];

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="logo">
          <a href="#" className="nav-logo">
            <img src="/logo.png" alt="Dashboard Logo" />
          </a>
          {/* <span>Toà Án Admin</span> */}
        </div>

        <ul>
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="help-box">
          <p>Hỗ trợ</p>
          <small>Vui lòng xem tài liệu hướng dẫn</small>
          <button>Documentation</button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
