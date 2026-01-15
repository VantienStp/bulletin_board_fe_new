"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FaBell, FaCalendarXmark, FaCircleInfo } from "react-icons/fa6";
import useSWR, { useSWRConfig } from "swr"; // 🔥 Thêm useSWRConfig để mutate dữ liệu
import { fetcher } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/api";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function NotificationCenter() {
    const { mutate } = useSWRConfig(); // Dùng để làm tươi (refresh) dữ liệu ngay lập tức
    const [isOpen, setIsOpen] = useState(false);
    const notiRef = useRef(null);

    useOutsideClick(notiRef, () => setIsOpen(false));

    // Lấy danh sách thông báo chưa đọc
    const { data: notifications = [] } = useSWR(`${API_BASE_URL}/cards/notifications`, fetcher, {
        refreshInterval: 60000 // Tự động cập nhật mỗi phút
    });

    // 🔥 Hàm xử lý đánh dấu đã đọc khi người dùng click
    const handleMarkAsRead = async (notiId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cards/notifications/${notiId}/read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                // Mutate để SWR gọi lại API và xóa thông báo đó khỏi danh sách hiển thị
                mutate(`${API_BASE_URL}/cards/notifications`);
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu đã đọc:", error);
        }
    };

    return (
        <div className="relative" ref={notiRef}>
            {/* BUTTON CHUÔNG */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full transition relative group ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
            >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-black animate-bounce">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* DROPDOWN MENU */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                        <h4 className="text-sm font-bold text-gray-800">Thông báo hệ thống</h4>
                        {notifications.length > 0 && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                                {notifications.length} Mới
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((noti) => (
                                <Link
                                    key={noti._id} // MongoDB dùng _id
                                    href={`/admin/cards?status=expired`}
                                    onClick={() => {
                                        handleMarkAsRead(noti._id); // 🔥 Đánh dấu đã đọc khi click
                                        setIsOpen(false);
                                    }}
                                    className="flex gap-4 px-5 py-4 hover:bg-indigo-50/30 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                                        <FaCalendarXmark className="text-orange-600 text-lg" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs font-bold text-gray-800 truncate">{noti.title}</p>
                                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                                            Bản tin đã quá hạn hiển thị. Vui lòng kiểm tra hoặc gỡ bỏ.
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
                                    <FaCircleInfo className="text-2xl" />
                                </div>
                                <p className="text-xs text-gray-400">Hiện tại không có thông báo mới.</p>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/admin/cards?status=expired"
                        className="block py-3 text-center text-[11px] font-bold text-indigo-600 bg-gray-50 hover:bg-indigo-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Xem tất cả bản tin quá hạn
                    </Link>
                </div>
            )}
        </div>
    );
}