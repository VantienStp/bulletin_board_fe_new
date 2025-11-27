"use client";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api"; // nhớ là có file này nhé
import { authFetch, clearToken } from "@/lib/auth";
import "./Header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [theme, setTheme] = useState("light");
  const menuRef = useRef(null);
  const router = useRouter();
  const [userName, setUserName] = useState("Admin Kincharna");

  // 🌙 toggle theme
  // useEffect(() => {
  //   const handleUpdate = () => {
  //     const storedName = localStorage.getItem("user_name");
  //     console.log(storedName);
  //     setUserName(storedName?.trim() || " Admin Kincharna");
  //   };
  //   document.documentElement.setAttribute("data-theme", theme);
  //   window.addEventListener("userNameUpdated", handleUpdate);

  //   const storedName = localStorage.getItem("user_name");
  //   // if (storedName) {
  //   //   setUserName(storedName.trim());
  //   // }

  //   return () => window.removeEventListener("userNameUpdated", handleUpdate);


  // }, [theme]);


  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);

    const handleUpdate = () => {
      const updatedName = localStorage.getItem("user_name");
      setUserName(updatedName || "Admin Kincharna");
    };

    window.addEventListener("userNameUpdated", handleUpdate);
    document.documentElement.setAttribute("data-theme", theme);
    return () => window.removeEventListener("userNameUpdated", handleUpdate);
  }, [theme]);

  // 📦 đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (open) {
          setIsClosing(true);
          setTimeout(() => {
            setOpen(false);
            setIsClosing(false);
          }, 600);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ⚙️ Toggle dropdown
  const handleToggle = () => {
    if (open) {
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      setOpen(true);
    }
  };

  // 🚪 Xử lý Đăng xuất
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const res = await authFetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // rất quan trọng để gửi cookie refresh_token
      });

      if (res.ok) {
        clearToken();
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
        router.push("/login");
      } else {
        console.error("Logout failed:", await res.json());
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <span className="court-name">TÒA ÁN NHÂN DÂN TP.HỒ CHÍ MINH</span>
      </div>

      <div className="header-center">
        <div className="search-wrapper">
          {/* <i className="fas fa-search search-icon"></i> */}
          {/* <input type="text" className="search-input" placeholder="Tìm kiếm..." /> */}
        </div>
      </div>

      <div className="header-right" ref={menuRef}>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="user-menu">
          Chào mừng
          {/* <FaUserCircle className="user-avatar-icon" /> */}
          <button className="user-name" onClick={handleToggle}>
            {userName}
            {/* <i className="fas fa-chevron-down"></i> */}
          </button>
        </div>

        <div className={`dropdown ${open ? "show" : "hide"}`}>
          <Link href="#">Hồ sơ</Link>
          <Link href="/admin/settings">Cài đặt</Link>
          <hr />
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Đăng xuất</a>
        </div>
      </div>
    </header>
  );
}
