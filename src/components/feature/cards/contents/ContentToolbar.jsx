"use client";

import React from "react";
import Link from "next/link";
import SearchInput from "@/components/common/SearchInput";
import { FaPlusSquare, FaArrowLeft } from "react-icons/fa";

// 1. Đổi tên component cho đúng ngữ cảnh
export default function ContentToolbar({
    searchText,
    setSearchText,
    onAdd,
    onSearchFocusChange // 2. Nhận prop báo cáo focus
}) {
    return (
        <div className="flex items-center gap-3">
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm kiếm nội dung..."
                className="w-72"

                // 3. Gắn sự kiện báo cáo trạng thái Focus
                onFocus={() => onSearchFocusChange(true)}
                onBlur={() => onSearchFocusChange(false)}
            />

            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-5 py-2 bg-gray-800 text-white text-sm font-medium rounded-full hover:bg-black transition shadow-sm"
            >
                <FaPlusSquare />
                Thêm nội dung
            </button>

            {/* 4. Sửa Link quay lại trang Cards */}
            <Link
                href="/admin/cards"
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-2 transition"
            >
                <FaArrowLeft /> Quay lại
            </Link>
        </div>
    );
}