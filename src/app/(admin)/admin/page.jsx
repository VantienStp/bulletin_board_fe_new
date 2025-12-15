"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { FaList, FaClone, FaChartBar, FaThLarge, FaUsers } from "react-icons/fa";

export default function AdminPage() {
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
                const res = await authFetch(`${API_BASE_URL}/dashboard/stats`, {
                    credentials: "include",
                });

                if (res.status === 401 || res.status === 403) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                setStats(data);

            } catch (err) {
                router.push("/login");
            }
        }

        fetchStats();
    }, []);

    return (


        <div className="admin-page">  {/* vẫn dùng class cũ để bố cục không lỗi */}

            {/* HEADER TITLE */}
            <div className="flex items-center gap-3 text-2xl font-bold text-black mb-10">
                <FaChartBar className="text-gray-700" />
                <span>Tổng quan</span>
            </div>

            {/* GRID CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* CARD 1 */}
                <div className="
                    bg-white/70 backdrop-blur-md rounded-xl 
                    p-6 text-center shadow 
                    hover:shadow-lg transition duration-200 hover:-translate-y-1
                ">
                    <FaList className="text-gray-700 text-3xl mx-auto" />
                    <h2 className="text-lg font-semibold mt-2">Danh mục</h2>
                    <p className="text-2xl font-bold">{stats.categories}</p>
                </div>

                {/* CARD 2 */}
                <div className="
                    bg-white/70 backdrop-blur-md rounded-xl 
                    p-6 text-center shadow 
                    hover:shadow-lg transition duration-200 hover:-translate-y-1
                ">
                    <FaClone className="text-gray-700 text-3xl mx-auto" />
                    <h2 className="text-lg font-semibold mt-2">Thẻ nội dung</h2>
                    <p className="text-2xl font-bold">{stats.cards}</p>
                </div>

                {/* CARD 3 */}
                <div className="
                    bg-white/70 backdrop-blur-md rounded-xl 
                    p-6 text-center shadow 
                    hover:shadow-lg transition duration-200 hover:-translate-y-1
                ">
                    <FaThLarge className="text-gray-700 text-3xl mx-auto" />
                    <h2 className="text-lg font-semibold mt-2">Bố cục</h2>
                    <p className="text-2xl font-bold">{stats.layouts}</p>
                </div>

                {/* CARD 4 */}
                <div className="
                    bg-white/70 backdrop-blur-md rounded-xl 
                    p-6 text-center shadow 
                    hover:shadow-lg transition duration-200 hover:-translate-y-1
                ">
                    <FaUsers className="text-gray-700 text-3xl mx-auto" />
                    <h2 className="text-lg font-semibold mt-2">Người dùng</h2>
                    <p className="text-2xl font-bold">{stats.users}</p>
                </div>

            </div>
        </div>
    );
}
