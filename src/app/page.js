"use client";

import { useState, useEffect, useRef } from "react";
import Clock from "@/components/share/Clock";
import Weather from "@/components/share/Weather";
import Card from "@/components/user/Card";

import "@/styles/core.css";
import "@/styles/tokens.css";
import "@/styles/globals.css"

import { API_BASE_URL, BASE_URL } from "../lib/api";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(null);
  const intervalRef = useRef(null);
  const [autoSwitch, setAutoSwitch] = useState(() => {
    const saved = localStorage.getItem("autoSwitch");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const el = document.getElementById('devtools-indicator');
    if (el) el.style.display = 'none';
  }, []);

  useEffect(() => {
    localStorage.setItem("autoSwitch", JSON.stringify(autoSwitch));
  }, [autoSwitch]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          const saved = localStorage.getItem("selectedCategory");

          if (saved) {
            const found = data.find(c => c._id === saved);
            if (found) {
              setSelectedCategory(found._id);
              setLayoutConfig(found.gridLayoutId?.config || null);
              return;
            }
          }
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


  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat._id);
    setLayoutConfig(cat.gridLayoutId?.config || null);
    localStorage.setItem("selectedCategory", cat._id);
  };

  useEffect(() => {
    if (!autoSwitch) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (categories.length === 0 || !selectedCategory) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const others = categories.filter(cat => cat._id !== selectedCategory);
      if (others.length === 0) return;

      const randomCat = others[Math.floor(Math.random() * others.length)];
      handleSelectCategory(randomCat);
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalRef.current);

  }, [selectedCategory, categories, autoSwitch]);


  useEffect(() => {
    if (!categories.length || !selectedCategory) return;

    const index = categories.findIndex(cat => cat._id === selectedCategory);
    if (index < 0) return;

    const highlight = document.getElementById("sidebar-highlight");
    const items = document.querySelectorAll(".sidebar ul li a");

    if (!highlight || !items.length) return;

    const item = items[index];
    const itemHeightPx = item.offsetHeight;
    const itemTopPx = item.offsetTop;

    const vhTop = (itemTopPx / window.innerHeight) * 100;
    const vhHeight = (itemHeightPx / window.innerHeight) * 100;

    highlight.style.transform = `translateY(${vhTop}vh)`;
    highlight.style.height = `${vhHeight}vh`;

  }, [selectedCategory, categories]);


  return (
    <>
      <nav className="sidebar">
        <a
          href="#"
          className="flex max-w-[7vw] max-h-[7vw] mb-[3vh] box-border z"
        >
          <img src={`${BASE_URL}/uploads/logo2.png`} alt="Dashboard Logo"
            className=" w-[5vw] mt-[var(--margin-medium)]"
          />
        </a>

        {/* BONG BÓNG ACTIVE */}
        <div id="sidebar-highlight">
          <div className="corner-bottom"></div>
        </div>
        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>
              <a
                onClick={() => handleSelectCategory(cat)}
                className={selectedCategory === cat._id ? "active" : ""}
              >
                <i className={cat.icon || "fas fa-folder"}></i>
                <span className="nav-text">{cat.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="content-wrapper">
        <header className="main-header">
          <div className="header-content">
            <div className="header-left">
              <div className="title-block">
                <span className="main-title">
                  {/* <span className="highlight">Bản Tin Hoạt Động</span> Toà Án Nhân Dân Khu Vực 1 - TP.HCM */}
                  <span className="highlight">Bản Tin Hoạt Động</span>
                  {" "}Toà Án Nhân Dân Khu Vực 1 - TP.HCM

                </span>
                <div className="time-line">
                  {(() => {
                    const d = new Date();

                    const weekdays = [
                      "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư",
                      "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
                    ];

                    const dayName = weekdays[d.getDay()];
                    const day = d.getDate();
                    const month = d.getMonth() + 1;
                    const year = d.getFullYear();

                    return `${dayName} ngày ${day} tháng ${month} năm ${year}`;
                  })()}
                </div>
              </div>
            </div>
            <div className="header-right">
              <div onClick={() => setAutoSwitch(prev => !prev)} style={{ cursor: "pointer", width: "100%" }}>
                <Weather />
              </div>
              {/* <Weather /> */}
              <Clock />
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: layoutConfig
                ? layoutConfig.columns.map((c) => `${c}fr`).join(" ")
                : "1fr 1fr 1fr",
              gridTemplateRows: layoutConfig
                ? `repeat(${layoutConfig.rows || 1}, auto)`
                : "auto",
            }}
          >
            {categories
              .filter((cat) => selectedCategory === cat._id)
              .flatMap((cat) => {
                const layoutCardCount = layoutConfig?.positions?.length || 0;
                const maxCards =
                  layoutCardCount > 0
                    ? layoutCardCount
                    : (layoutConfig?.rows || 1) * (layoutConfig?.columns?.length || 1);
                const visibleMappings = cat.mappings.slice(0, maxCards);

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
      </div>

      <div
        className="
                fixed bottom-0 right-0
                w-[40vw] max-w-[600px] h-[66px]
                bg-[rgba(234,17,17,0.8)]
                text-slate-50
                text-[26px] font-medium tracking-[0.3px]
                flex items-center justify-center
                rounded-tl-[20px]
                shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                select-none pointer-events-none
                z-[9999]
              "
      >
        Vui lòng không chạm vào màn hình
      </div>

    </>
  );
}
