"use client";

import React from "react";
import { FaSyncAlt } from "react-icons/fa";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import FilterOption from "@/components/ui/FilterOption";

export default function DeviceToolbar({
    searchText,
    setSearchText,
    filters,
    toggleStatusFilter,
    onSearchFocusChange,
    clearFilters,
    onRefresh,
    loading
}) {
    const activeFilterCount = filters.status.length;

    return (
        <div className="flex items-center gap-3">
            {/* Search Input */}
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm tên, ID..."
                className="w-64"
                onFocus={() => onSearchFocusChange && onSearchFocusChange(true)}
                onBlur={() => onSearchFocusChange && onSearchFocusChange(false)}
            />

            {/* Filter Dropdown */}
            <FilterDropdown count={activeFilterCount} label="Trạng thái">
                <div className="mb-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Kết nối</p>
                    <FilterOption
                        type="radio"
                        label="Online (Live)"
                        checked={filters.status.includes("online")}
                        onChange={() => toggleStatusFilter("online")}
                        color="#22c55e"
                    />
                    <FilterOption
                        type="radio"
                        label="Offline"
                        checked={filters.status.includes("offline")}
                        onChange={() => toggleStatusFilter("offline")}
                        color="#9ca3af"
                    />
                </div>

                {activeFilterCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="mt-2 pt-2 border-t w-full text-left text-xs text-red-500 hover:underline font-medium"
                    >
                        Xóa bộ lọc
                    </button>
                )}
            </FilterDropdown>

            {/* Refresh Button */}
            <button
                onClick={onRefresh}
                className="p-2.5 bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 rounded-full transition-all active:rotate-180 shadow-sm"
                title="Làm mới dữ liệu"
            >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
        </div>
    );
}