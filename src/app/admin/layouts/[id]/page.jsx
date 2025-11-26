"use client";
import React, { useState, useEffect } from "react";
import LayoutEditor from "../LayoutEditor";
import "./layout-detail.css";
import { API_BASE_URL } from "@/lib/api";
import { getToken, authFetch } from '@/lib/auth';
export default function LayoutDetailPage({ params }) {
  const id = React.use(params).id; // 
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    async function fetchLayout() {
      try {
        const res = await authFetch(`${API_BASE_URL}/gridLayouts/${id}`, {
          method: "GET",
        });

        if (!res.ok) {
          console.error("❌ Lỗi HTTP:", res.status);
          return;
        }

        const data = await res.json();
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
