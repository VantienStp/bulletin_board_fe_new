"use client";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";

export default function TimeFilter({ onFilterChange }) {
    const [mode, setMode] = useState('month'); // 'month' | 'quarter' | 'year'
    const [year, setYear] = useState(new Date().getFullYear());
    const [value, setValue] = useState(new Date().getMonth()); // Index 0-11 (Tháng) hoặc 0-3 (Quý)

    // Logic tính ngày start/end gửi ra ngoài
    const applyFilter = (newMode, newYear, newValue) => {
        let start, end;

        if (newMode === 'month') {
            start = startOfMonth(new Date(newYear, newValue));
            end = endOfMonth(new Date(newYear, newValue));
        } else if (newMode === 'quarter') {
            const qMonth = newValue * 3;
            start = startOfQuarter(new Date(newYear, qMonth));
            end = endOfQuarter(new Date(newYear, qMonth));
        } else {
            start = startOfYear(new Date(newYear, 0));
            end = endOfYear(new Date(newYear, 0));
        }

        onFilterChange({
            from: format(start, 'yyyy-MM-dd'),
            to: format(end, 'yyyy-MM-dd'),
            label: `${newMode === 'month' ? 'Tháng ' + (newValue + 1) : newMode === 'quarter' ? 'Quý ' + (newValue + 1) : 'Năm'} - ${newYear}`
        });
    };

    // Chạy mặc định lần đầu
    useEffect(() => {
        applyFilter('month', year, new Date().getMonth());
    }, []);

    const handleChangeMode = (m) => {
        setMode(m);
        const newVal = m === 'quarter' ? 0 : 0; // Reset về giá trị đầu tiên cho an toàn
        setValue(newVal);
        applyFilter(m, year, newVal);
    };

    return (
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm text-sm">
            {/* 1. Chọn Năm */}
            <select
                value={year}
                onChange={(e) => {
                    const y = Number(e.target.value);
                    setYear(y);
                    applyFilter(mode, y, value);
                }}
                className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer hover:bg-gray-50 rounded px-1"
            >
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <div className="w-[1px] bg-gray-200 my-1"></div>

            {/* 2. Chọn Loại */}
            <div className="flex bg-gray-100 rounded p-0.5">
                {['month', 'quarter', 'year'].map(m => (
                    <button
                        key={m}
                        onClick={() => handleChangeMode(m)}
                        className={`px-2 py-0.5 rounded capitalize transition-all ${mode === m ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {m === 'month' ? 'Tháng' : m === 'quarter' ? 'Quý' : 'Năm'}
                    </button>
                ))}
            </div>

            {/* 3. Chọn Giá trị (ẩn nếu xem cả năm) */}
            {mode !== 'year' && (
                <select
                    value={value}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        setValue(v);
                        applyFilter(mode, year, v);
                    }}
                    className="bg-transparent text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-50 rounded px-1 min-w-[60px]"
                >
                    {mode === 'month'
                        ? Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>Tháng {i + 1}</option>)
                        : Array.from({ length: 4 }, (_, i) => <option key={i} value={i}>Quý {i + 1}</option>)
                    }
                </select>
            )}
        </div>
    );
}