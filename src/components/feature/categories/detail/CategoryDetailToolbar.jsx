"use client";

import React from "react";
import Link from "next/link";
import SearchInput from "@/components/common/SearchInput";
import { FaPlusSquare } from "react-icons/fa";
import { FaArrowLeft, FaFolderOpen } from "react-icons/fa";

export default function CategoryDetailToolbar({
    searchText,
    setSearchText,
    onAdd
}) {
    return (
        <div className="flex items-center gap-3">
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm kiếm thẻ trong danh mục..."
                className="w-72"
            />

            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-5 py-2 bg-gray-800 text-white text-sm font-medium rounded-full hover:bg-black transition shadow-sm"
            >
                <FaPlusSquare />
                Thêm thẻ
            </button>

            <Link
                href="/admin/categories"
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-2 transition"
            >
                <FaArrowLeft /> Quay lại
            </Link>
        </div>
    );
}