"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import FilterOption from "@/components/ui/FilterOption";
import { FaPlusSquare } from "react-icons/fa";

export default function ContentToolbar({
    searchText,
    setSearchText,
    filters,
    toggleFilter,
    clearFilters,
    onAdd
}) {
    const activeFilterCount = filters.type?.length || 0;

    return (
        <div className="flex items-center gap-3">
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm nội dung (mô tả, tên file)..."
                className="w-80"
            />

            <FilterDropdown count={activeFilterCount} label="Filter">
                <div className="mb-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Loại file</p>
                    {["image", "video", "pdf"].map(t => (
                        <FilterOption
                            key={t}
                            label={t.charAt(0).toUpperCase() + t.slice(1)}
                            checked={filters.type?.includes(t)}
                            onChange={() => toggleFilter("type", t)}
                        />
                    ))}
                </div>

                {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="mt-2 pt-2 border-t w-full text-left text-xs text-red-500 hover:underline">
                        Xóa bộ lọc
                    </button>
                )}
            </FilterDropdown>

            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-full hover:bg-black transition shadow-sm"
            >
                <FaPlusSquare />
                Thêm nội dung
            </button>
        </div>
    );
}