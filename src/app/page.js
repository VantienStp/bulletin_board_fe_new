"use client";

import { useEffect } from "react";
import "@/styles/tokens.css";
import "@/styles/globals.css";

// Imports từ các file đã tách
import { useKioskData } from "@/hooks/useKioskData";
import Sidebar from "@/components/layout/user/Sidebar";
import KioskHeader from "@/components/layout/user/KioskHeader";
import ContentGrid from "@/components/layout/user/ContentGrid";

export default function HomePage() {
  // Lấy dữ liệu và logic từ Hook
  const {
    categories,
    selectedCategory,
    layoutConfig,
    setAutoSwitch,
    handleSelectCategory
  } = useKioskData();

  // Ẩn devtools indicator (Visual Effect)
  useEffect(() => {
    const el = document.getElementById("devtools-indicator");
    if (el) el.style.display = "none";
  }, []);

  return (
    <>
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleSelectCategory}
      />

      <div className="content-wrapper">
        <KioskHeader toggleAutoSwitch={() => setAutoSwitch((prev) => !prev)} />

        <main className="main-content">
          <ContentGrid
            categories={categories}
            selectedCategory={selectedCategory}
            layoutConfig={layoutConfig}
          />
        </main>
      </div>

      {/* Footer / Overlay */}
      <div className="fixed bottom-0 right-0 w-[40vw] max-w-[600px] h-[54px] bg-[rgba(234,17,17,0.8)] text-slate-50 text-[26px] font-medium flex items-center justify-center rounded-tl-[20px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] select-none pointer-events-none z-[9999]">
        Vui lòng không chạm vào màn hình
      </div>
    </>
  );
}