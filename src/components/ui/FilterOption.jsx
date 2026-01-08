// components/ui/FilterOption.jsx
"use client";

import React from "react";

export default function FilterOption({ 
    label, 
    checked, 
    onChange, 
    color, 
    capitalize = false, 
    type = "checkbox" // Thêm prop này (mặc định là checkbox)
}) {
    return (
        <label className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 text-[13px] transition group select-none">
            <input
                type={type}
                checked={checked}
                onChange={onChange}
                className="hidden peer"
            />

            {/* Custom Visual Input */}
            <div className={`
                w-4 h-4 border border-gray-300 flex items-center justify-center transition
                peer-checked:bg-black peer-checked:border-black
                ${type === 'radio' ? 'rounded-full' : 'rounded'} 
            `}>
                {/* Logic hiển thị icon bên trong */}
                {checked && (
                    type === 'radio' 
                        ? <div className="w-2 h-2 bg-white rounded-full" /> // Dấu chấm tròn cho Radio
                        : <span className="text-white text-[10px]">✓</span>      // Dấu tích cho Checkbox
                )}
            </div>

            <span className={`flex-1 truncate text-gray-700 ${capitalize ? 'capitalize' : ''}`}>
                {label}
            </span>

            {color && (
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: color }} />
            )}
        </label>
    );
}