"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaList, FaClone, FaThLarge, FaUsers } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    cards: 0,
    layouts: 0,
    users: 0,
  });

  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("jwt_token");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("jwt_token");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        router.push("/login");
      }
    }

    fetchStats();
  }, [router]);

  return (
    <>
      <h1 className="dashboard-title">Bảng điều khiển quản trị</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <FaList/>
          <h2>Danh mục</h2>
          <p>{stats.categories}</p>
        </div>

        <div className="stat-card">
          <FaClone/>
          <h2>Thẻ nội dung</h2>
          <p>{stats.cards}</p>
        </div>

        <div className="stat-card">
          <FaThLarge/>
          <h2>Bố cục</h2>
          <p>{stats.layouts}</p>
        </div>

        <div className="stat-card">
          <FaUsers/>
          <h2>Người dùng</h2>
          <p>{stats.users}</p>
        </div>
      </div>
    </>
  );
}
