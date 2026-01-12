"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import FilterOption from "@/components/ui/FilterOption";
import { FaUserPlus } from "react-icons/fa";

// 1. Nhận thêm prop onSearchFocusChange
export default function UserToolbar({
    searchText,
    setSearchText,
    filters,
    toggleFilter,
    clearFilters,
    onAdd,
    onSearchFocusChange
}) {
    const activeFilterCount = filters.role?.length || 0;

    return (
        <div className="flex items-center gap-3">
            <SearchInput
                value={searchText}
                onChange={setSearchText}
                placeholder="Tìm user, email..."
                className="w-80"

                // 2. Gắn sự kiện báo trạng thái Focus
                onFocus={() => onSearchFocusChange(true)}
                onBlur={() => onSearchFocusChange(false)}
            />

            <FilterDropdown count={activeFilterCount} label="Filter">
                <div className="mb-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Role</p>
                    {["admin", "editor", "user", "viewer"].map(role => (
                        <FilterOption
                            key={role}
                            label={role.charAt(0).toUpperCase() + role.slice(1)}
                            checked={filters.role?.includes(role)}
                            onChange={() => toggleFilter("role", role)}
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
                <FaUserPlus />
                Thêm User
            </button>
        </div>
    );
}