"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { dashboardAdapter, defaultStats } from "@/data/adapters/dashboardAdapter";

import { FaDesktop, FaNewspaper, FaPhotoFilm, FaCalendarXmark } from "react-icons/fa6";

import StatCard from "@/components/feature/dashboard/StatCard";
import DeviceActivityTable from "@/components/feature/dashboard/DeviceActivityTable";
import SystemStatus from "@/components/feature/dashboard/SystemStatus";

const AnalyticsCard = dynamic(
    () => import("@/components/feature/dashboard/AnalyticsCard"),
    { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div> }
);

const fetcher = (url) => authFetch(url).then((res) => res.json());

export default function AdminHomePage() {
    const router = useRouter();
    const [dateFilter, setDateFilter] = useState({ from: '', to: '', label: '' });

    const { data: rawData, isLoading } = useSWR(
        dateFilter.from
            ? `${API_BASE_URL}/dashboard/stats?from=${dateFilter.from}&to=${dateFilter.to}`
            : null,
        fetcher,
        { refreshInterval: 60000 }
    );

    const stats = rawData ? dashboardAdapter(rawData) : defaultStats;
    const { overview, charts, topDevices } = stats;

    return (
        <div className="mx-auto w-full animate-fadeIn pb-10">
            <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trung tâm điều khiển</h1>
                    <p className="text-sm text-gray-500 mt-1">Xin chào, chúc bạn một ngày làm việc hiệu quả!</p>
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Thiết bị Online"
                    value={isLoading ? "..." : overview.devices.online}
                    note={`trên tổng số ${overview.devices.total} máy`}
                    accent="green"
                    icon={<FaDesktop />}
                    onClick={() => router.push('/admin/settings')}
                />
                <StatCard
                    title="Bản tin đang chạy"
                    value={isLoading ? "..." : overview.cards.active}
                    note={`Tổng ${overview.cards.total}`}
                    accent="blue"
                    icon={<FaNewspaper />}
                    onClick={() => router.push('/admin/categories')}
                />
                <StatCard
                    title="Tài nguyên Media"
                    value={isLoading ? "..." : overview.files.total}
                    note={`${overview.files.image} ảnh, ${overview.files.video} video`}
                    accent="orange"
                    icon={<FaPhotoFilm />}
                    onClick={() => router.push('/admin/cards')}
                />
                <StatCard
                    title="Bản tin cần xử lý"
                    value={isLoading ? "..." : overview.cards.expired}
                    note="Nội dung đã quá hạn hiển thị"
                    accent={overview.cards.expired > 0 ? "red" : "slate"}
                    icon={<FaCalendarXmark />}
                    onClick={() => router.push('/admin/cards?status=expired')}
                />
            </section>

            <section className="mb-8">
                <AnalyticsCard
                    data={charts}
                    label={dateFilter.label}
                    onFilterChange={setDateFilter}
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