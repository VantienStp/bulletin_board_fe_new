"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaArrowLeft, FaLayerGroup, FaPen, FaCheck, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { useToast } from "@/context/ToastContext";

export default function LayoutDetailHeader({ layout, onUpdateSuccess }) {
    const { addToast } = useToast();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(layout?.title || "");
    const inputRef = useRef(null);

    useEffect(() => {
        if (layout) setTempTitle(layout.title);
    }, [layout]);

    useEffect(() => {
        if (isEditingTitle && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleSaveTitle = async () => {
        if (!tempTitle.trim() || tempTitle === layout.title) {
            handleCancelEdit();
            return;
        }

        try {
            const res = await authFetch(`${API_BASE_URL}/gridlayouts/${layout._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: tempTitle }),
            });

            if (!res.ok) throw new Error("Cập nhật thất bại");

            addToast("success", "Đã đổi tên bố cục thành công!");
            setIsEditingTitle(false);

            if (onUpdateSuccess) onUpdateSuccess();

        } catch (error) {
            addToast("error", "Lỗi khi đổi tên. Vui lòng thử lại.");
            setTempTitle(layout.title);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingTitle(false);
        setTempTitle(layout.title);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSaveTitle();
        if (e.key === "Escape") handleCancelEdit();
    };

    return (
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div>
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center flex-shrink-0">
                        <FaLayerGroup size={24} className="text-indigo-600" />
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 h-9 min-w-[200px]">
                            {isEditingTitle ? (
                                <div className="flex items-center gap-2 animate-fadeIn">
                                    <input
                                        ref={inputRef}
                                        value={tempTitle}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 outline-none bg-transparent px-1 min-w-[250px]"
                                        placeholder="Nhập tên bố cục..."
                                    />
                                    <div className="flex items-center gap-1">
                                        <button
                                            onMouseDown={handleSaveTitle}
                                            className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                            title="Lưu (Enter)"
                                        >
                                            <FaCheck size={14} />
                                        </button>
                                        <button
                                            onMouseDown={handleCancelEdit}
                                            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Hủy (Esc)"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="flex items-center gap-3 group cursor-pointer py-1"
                                    onClick={() => setIsEditingTitle(true)}
                                >
                                    <h1 className="text-2xl font-bold text-gray-900 leading-none group-hover:text-indigo-700 transition-colors select-none">
                                        {layout.title}
                                    </h1>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                        title="Bấm để đổi tên"
                                    >
                                        <FaPen size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono text-xs">
                                {layout.slug || layout.code}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500 flex items-center">
                                Thiết lập: <span className="font-bold text-gray-800 ml-1">{layout.config?.positions?.length || 0}</span> vị trí
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Link
                href="/admin/layouts"
                className="
                    px-6 py-2.5 h-fit 
                    rounded-xl border-2 border-gray-100 bg-white 
                    text-gray-500 font-bold text-sm 
                    flex items-center gap-2 
                    transition-all duration-200
                    hover:border-gray-300 hover:text-gray-900 hover:shadow-md 
                    active:scale-95
                "
            >
                <FaArrowLeft /> <span>Quay lại</span>
            </Link>
        </div>
    );
}