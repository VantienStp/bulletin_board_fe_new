"use client";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const [avatarError, setAvatarError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [theme, setTheme] = useState("light");
  const menuRef = useRef(null);
  const avatarUrl = "/uploads/avatar-admin.png";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        // Khi click ra ngoài — đóng dropdown có animation
        if (open) {
          setIsClosing(true);
          setTimeout(() => {
            setOpen(false);
            setIsClosing(false);
          }, 600); // thời gian trùng với transition trong CSS (0.6-0.8s)
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (open) {
      // Nếu đang mở → chuyển sang “đang đóng” (có animation)
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 600);
    } else {
      // Nếu đang tắt → bật ngay
      setOpen(true);
    }
  };

  return (
    <header className="main-header">
      {/* LEFT */}
      <div className="header-left">
        <span className="court-name">TÒA ÁN NHÂN DÂN TP.HỒ CHÍ MINH</span>
      </div>

      {/* CENTER */}
      <div className="header-center">
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input type="text" className="search-input" placeholder="Tìm kiếm..." />
        </div>
      </div>

      {/* RIGHT */}
      <div className="header-right" ref={menuRef}>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="user-menu">
          Chào mừng
          <FaUserCircle className="user-avatar-icon" />
          <button className="user-name" onClick={handleToggle}>
            Admin Kincharna <i className="fas fa-chevron-down"></i>
          </button>
        </div>

        <div className={`dropdown ${open ? "show" : "hide"}`}>
          <a href="#">Hồ sơ</a>
          <a href="/admin/settings">Cài đặt</a>
          <hr />
          <a href="#">Đăng xuất</a>
        </div>
      </div>
    </header>
  );
}
