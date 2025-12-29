"use client";

import React from "react";

/**
 * FilterOption - Thành phần nguyên tử cho các bộ lọc
 * @param {string} label - Nhãn hiển thị
 * @param {boolean} checked - Trạng thái chọn
 * @param {function} onChange - Hàm xử lý khi thay đổi
 * @param {string} color - (Tùy chọn) Màu sắc đại diện cho Team
 * @param {boolean} capitalize - (Tùy chọn) Tự động viết hoa chữ cái đầu
 */
export default function FilterOption({ label, checked, onChange, color, capitalize = false }) {
    return (
        <label className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 text-[13px] transition group">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden peer"
            />

            {/* Custom Checkbox */}
            <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-white text-[10px] peer-checked:bg-black peer-checked:border-black transition">
                ✓
            </div>

            {/* Label text */}
            <span className={`flex-1 truncate text-gray-700 ${capitalize ? 'capitalize' : ''}`}>
                {label}
            </span>

            {/* Màu sắc định danh (nếu có - dùng cho Team) */}
            {color && (
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: color }} />
            )}
        </label>
    );
}