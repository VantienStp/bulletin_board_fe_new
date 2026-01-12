"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import FilterOption from "@/components/ui/FilterOption";
import { FaPlusSquare } from "react-icons/fa";

// 1. Nhận thêm prop onSearchFocusChange
export default function CategoryToolbar({
    searchText,
    setSearchText,
    filters,
    toggleFilter,
    clearFilters,
    layouts,
    onAdd,
    onSearchFocusChange
}) {
    const activeFilterCount = filters.layout?.length || 0;

    return (
        <div className="flex items-center gap-3">
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm kiếm danh mục..."
                className="w-80"

                // 2. Báo cáo trạng thái Focus
                onFocus={() => onSearchFocusChange(true)}
                onBlur={() => onSearchFocusChange(false)}
            />

            <FilterDropdown count={activeFilterCount} label="Filter">
                {/* LỌC THEO LAYOUT */}
                <div className="mb-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Grid Layout</p>
                    <div className="max-h-48 overflow-y-auto pr-1">
                        {layouts.map(l => (
                            <FilterOption
                                key={l._id}
                                label={l.title}
                                checked={filters.layout?.includes(l._id)}
                                onChange={() => toggleFilter("layout", l._id)}
                            />
                        ))}
                    </div>
                </div>

                {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="mt-2 pt-2 border-t w-full text-left text-xs text-red-500 hover:underline">
                        Xóa bộ lọc
                    </button>
                )}
            </FilterDropdown>

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