"use client";
import React from "react";

// Component Input chuẩn, dùng chung cho cả App
export default function FormInput({
    label,
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    note,
    disabled = false,
    className = "" // Cho phép truyền thêm class tùy biến
}) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {/* Nếu có Icon thì hiện, không thì thôi */}
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icon className="text-lg" />
                    </div>
                )}

                <input
                    type={type}
                    disabled={disabled}
                    className={`
                        w-full pr-4 py-2.5 border border-gray-300 rounded-lg text-sm 
                        focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all
                        ${Icon ? "!pl-12" : "pl-3"} /* Tự động chỉnh padding nếu có icon hoặc không */
                        ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
                    `}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
            </div>
            {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
        </div>
    );
}