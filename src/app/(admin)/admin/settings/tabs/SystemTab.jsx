"use client";
import { useState } from "react";
import { FaCogs, FaSave } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";

export default function SystemTab() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm"><FaCogs /></span>
                Cấu hình hệ thống
            </h3>
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">Tên bảng tin</label>
                    <input
                        type="text"
                        defaultValue="Bảng tin Tòa Án Nhân Dân"
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">API Endpoint</label>
                    <input
                        type="text"
                        defaultValue={API_BASE_URL}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-xs"
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200 mt-4 font-medium"
                >
                    {isSaving ? <span className="animate-spin mr-2">◌</span> : <FaSave />}
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </div>
    );
}