"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { dashboardAdapter, defaultStats } from "@/data/adapters/dashboardAdapter";

// Icons (Chỉ giữ lại những icon dùng cho StatCard)
import { FaDesktop, FaNewspaper, FaPhotoFilm, FaUsers } from "react-icons/fa6";

// Components (Import các file vừa tách)
import StatCard from "@/components/feature/dashboard/StatCard";
import DeviceActivityTable from "@/components/feature/dashboard/DeviceActivityTable"; // 🔥 Mới
import SystemStatus from "@/components/feature/dashboard/SystemStatus";           // 🔥 Mới

// Chart load động
const AnalyticsCard = dynamic(
    () => import("@/components/feature/dashboard/AnalyticsCard"),
    { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div> }
);

const fetcher = (url) => authFetch(url).then((res) => res.json());

export default function AdminHomePage() {
    const [filter, setFilter] = useState("week");

    const { data: rawData, isLoading } = useSWR(
        `${API_BASE_URL}/dashboard/stats?range=${filter}`,
        fetcher,
        { refreshInterval: 30000 }
    );

    const stats = rawData ? dashboardAdapter(rawData, filter) : defaultStats;
    const { overview, charts, topDevices } = stats;

    return (
        <div className="mx-auto w-full animate-fadeIn pb-10">

            {/* --- HEADER --- */}
            <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trung tâm điều khiển</h1>
                    <p className="text-sm text-gray-500 mt-1">Xin chào, chúc bạn một ngày làm việc hiệu quả!</p>
                </div>
                <div>
                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </section>

            {/* --- SECTION 1: STATS CARDS --- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title="Thiết bị Kiosk" value={isLoading ? "..." : overview.devices} note="Đang hoạt động" accent="green" icon={<FaDesktop />} />
                <StatCard title="Bản tin hoạt động" value={isLoading ? "..." : overview.cards} note="Đang hiển thị" accent="blue" icon={<FaNewspaper />} />
                <StatCard title="Tài nguyên Media" value={isLoading ? "..." : overview.files} note={`${overview.totalDownloads} lượt tải`} accent="orange" icon={<FaPhotoFilm />} />
                <StatCard title="Người dùng" value={isLoading ? "..." : overview.users} note="Quản trị viên" accent="purple" icon={<FaUsers />} />
            </section>

            {/* --- SECTION 2: CHARTS --- */}
            <section className="mb-8">
                <AnalyticsCard
                    data={charts}
                    filter={filter}
                    onFilterChange={setFilter}
                />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-full">
                    <DeviceActivityTable devices={topDevices} />
                </div>

                <div className="h-full">
                    <SystemStatus />
                </div>

            </section>
        </div>
    );
}