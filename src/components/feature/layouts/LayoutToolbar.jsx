"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import { FaPlusSquare } from "react-icons/fa";

export default function LayoutToolbar({
    searchText,
    setSearchText,
    onAdd
}) {
    return (
        <div className="flex items-center gap-3">
            {/* Ô tìm kiếm */}
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm kiếm bố cục (tên, slug)..."
                className="w-80"
            />

            {/* Nút thêm mới */}
            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition shadow-sm"
            >
                <FaPlusSquare />
                Thêm mới
            </button>
        </div>
    );
}