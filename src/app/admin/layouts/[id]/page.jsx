"use client";
import React, { useState, useEffect } from "react";
import LayoutEditor from "../LayoutEditor";
import "./layout-detail.css";
import { API_BASE_URL } from "@/lib/api";

export default function LayoutDetailPage({ params }) {
  const id = React.use(params).id; // ✅ Sửa theo Next.js 15
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    async function fetchLayout() {
      try {
        const res = await fetch(`${API_BASE_URL}/gridLayouts/${id}`);
        const data = await res.json();
        console.log("📦 Layout data:", data);
        setLayout(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải layout:", err);
      }
    }
    fetchLayout();
  }, [id]);

  return (
    <div className="layout-detail-page">
      {layout ? (
        <>
          <div className="layout-info">
            <h2 className="layout-title">{layout.title}</h2>
            <p>
              <strong>Mã code:</strong> {layout.code} <br />
              <strong>Số card hiển thị:</strong>{" "}
              {layout.cards?.length || 0}
            </p>
          </div>

          <LayoutEditor layoutId={layout._id} initialConfig={layout.config} />
        </>
      ) : (
        <p>Đang tải thông tin bố cục...</p>
      )}
    </div>
  );
}
