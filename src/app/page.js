"use client";

import { useState, useEffect } from "react";
import Clock from "@/components/Clock";
import Weather from "@/components/Weather";
import Card from "@/components/Card";
import "./globals.css";
import { API_BASE_URL, BASE_URL } from "../lib/api";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(null);

  // 🧩 Lấy danh sách category (mỗi category có gridLayoutId kèm config)
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        console.log("Fetched categories:", data);

        setCategories(data);

        if (data.length > 0) {
          const firstCat = data[0];
          setSelectedCategory(firstCat._id);
          setLayoutConfig(firstCat.gridLayoutId?.config || null);
        }
      } catch (err) {
        console.error("Lỗi fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // 🧭 Khi đổi category
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat._id);
    setLayoutConfig(cat.gridLayoutId?.config || null);
    console.log("Selected layout config:", cat.gridLayoutId?.config);
  };

  return (
    <>
      {/* Sidebar */}
      <nav className="sidebar">
        <a href="#" className="nav-logo">
          <img src={`${BASE_URL}/uploads/logo2.png`} alt="Dashboard Logo" />
        </a>
        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>
              <a
                onClick={() => handleSelectCategory(cat)}
                className={selectedCategory === cat._id ? "active" : ""}
              >
                <i className={cat.icon || "fas fa-folder"}></i>
                <span className="nav-text">{cat.title}</span>
                <div className="corner-bottom"></div>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <span className="main-title">
              <span className="highlight">Bản Tin Hoạt Động</span> Toà Án Nhân Dân
            </span>
            <div className="time-line">
              {new Date().toISOString().split("T")[0]}
            </div>
          </div>
          <div className="header-right">
            <Weather />
            <Clock />
          </div>
        </div>
      </header>

      <main className="main-content">
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: layoutConfig
              ? layoutConfig.columns.map((c) => `${c}fr`).join(" ")
              : "1fr 1fr 1fr",
            gridTemplateRows: layoutConfig
              ? `repeat(${layoutConfig.rows || 1}, auto)`
              : "auto",
            gap: "2vw",
            padding: "1vw 2vw 2vw 2.5vw",
          }}
        >
          {categories
  .filter((cat) => selectedCategory === cat._id)
  .flatMap((cat) => {
    // 🧩 Ưu tiên số lượng card do layout quy định
    const layoutCardCount = layoutConfig?.positions?.length || 0;
    console.log("layoutCardCount:", layoutCardCount);
    // 🧩 Nếu layout.cards có giá trị > 0 → dùng nó
    // ngược lại → fallback sang rows * columns
    console.log("cat:", cat);
    const maxCards =
      layoutCardCount > 0
        ? layoutCardCount
        : (layoutConfig?.rows || 1) * (layoutConfig?.columns?.length || 1);

    // 🧩 Lấy đúng số lượng card được phép hiển thị
    const visibleMappings = cat.mappings.slice(0, maxCards);
    console.log("visibleMappings:", visibleMappings);

    return visibleMappings.map((map, index) => {
      if (!map.cardId) return null;

      const pos = layoutConfig?.positions?.[index];
      const style = pos
        ? {
            gridColumn: `${(pos.x || 0) + 1} / span ${pos.w || 1}`,
            gridRow: `${(pos.y || 0) + 1} / span ${pos.h || 1}`,
          }
        : {};

      return <Card key={map.cardId._id} {...map.cardId} style={style} />;
    });
  })}

        </div>
      </main>
    </>
  );
}
