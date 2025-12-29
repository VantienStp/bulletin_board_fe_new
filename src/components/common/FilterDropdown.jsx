"use client";
import { useState, useRef } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function FilterDropdown({ count, children, label = "Filter" }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useOutsideClick(ref, () => setIsOpen(false), isOpen);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm hover:bg-gray-50 gap-2"
            >
                <span className="material-symbols-outlined text-base">filter_list</span>
                {label}
                {count > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-black text-white">
                        {count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded-2xl shadow-xl p-4 z-50">
                    {children}
                </div>
            )}
        </div>
    );
}