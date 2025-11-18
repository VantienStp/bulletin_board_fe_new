// admin/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaList, FaClone, FaChartBar, FaThLarge, FaUsers } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";
import "./dashboard.css";
import { getToken, authFetch } from "@/lib/auth";


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
        const token = getToken()
        if (!token) {
          console.warn("⚠️ No token found → redirecting to login");
          router.push("/login");
          return;
        }

        const res = await authFetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          console.warn("❌ Token expired or invalid");
          localStorage.removeItem("accessToken");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("🔥 Error fetching dashboard:", err);
        router.push("/login");
      }
    }

    fetchStats();
  }, [router]);

  return (
    <>
      <div className="page-header">
        <div className="show-header">
          <span className="icon"><FaChartBar /></span>
          <span>Tổng quan</span>
        </div>
        {/* <h2><FaChartBar /> Danh mục</h2> */}
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <FaList />
          <h2>Danh mục</h2>
          <p>{stats.categories}</p>
        </div>

        <div className="stat-card">
          <FaClone />
          <h2>Thẻ nội dung</h2>
          <p>{stats.cards}</p>
        </div>

        <div className="stat-card">
          <FaThLarge />
          <h2>Bố cục</h2>
          <p>{stats.layouts}</p>
        </div>

        <div className="stat-card">
          <FaUsers />
          <h2>Người dùng</h2>
          <p>{stats.users}</p>
        </div>
      </div>
    </>
  );
}
