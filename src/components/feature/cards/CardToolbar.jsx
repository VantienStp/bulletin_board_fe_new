"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import FilterOption from "@/components/ui/FilterOption";
import { FaPlusSquare } from "react-icons/fa";

// 1. Nhận prop onSearchFocusChange
export default function CardToolbar({
    searchText,
    setSearchText,
    filters,
    toggleFilter,
    clearFilters,
    onAdd,
    onSearchFocusChange
}) {
    const activeFilterCount = (filters.status?.length || 0) + (filters.type?.length || 0);

    return (
        <div className="flex items-center gap-3">
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm kiếm tiêu đề..."
                className="w-80"

                // 2. Báo cáo trạng thái Focus
                onFocus={() => onSearchFocusChange(true)}
                onBlur={() => onSearchFocusChange(false)}
            />

            <FilterDropdown count={activeFilterCount} label="Filter">
                {/* LỌC STATUS */}
                <div className="mb-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trạng thái</p>
                    {["active", "pending", "expired"].map(s => (
                        <FilterOption
                            key={s}
                            label={s === 'active' ? 'Live' : s === 'pending' ? 'Chờ' : 'Hết hạn'}
                            checked={filters.status?.includes(s)}
                            onChange={() => toggleFilter("status", s)}
                        />
                    ))}
                </div>

                {/* LỌC LOẠI */}
                <div className="mb-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Chế độ</p>
                    {["T2-T6", "Full"].map(t => (
                        <FilterOption
                            key={t}
                            label={t}
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
                className="flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition shadow-sm"
            >
                <FaPlusSquare />
                Thêm mới
            </button>
        </div>
    );
}