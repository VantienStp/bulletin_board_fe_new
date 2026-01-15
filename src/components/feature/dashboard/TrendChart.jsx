"use client";

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import FilterDropdown from "@/components/common/FilterDropdown";
import FilterOption from "@/components/ui/FilterOption";

const FILTER_LABELS = {
    week: "7 ngày qua",
    month: "Tháng này",
    quarter: "Quý này",
    year: "Năm nay"
};

export default function TrendChart({ data = [], filter, onFilterChange }) {
    const options = [
        { value: "week", label: "7 ngày qua" },
        { value: "month", label: "Tháng này" },
        { value: "quarter", label: "Quý này" },
        { value: "year", label: "Năm nay" },
    ];

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-gray-800">Xu hướng đăng bài</h3>
                    <p className="text-xs text-gray-400 mt-1">Số lượng thẻ nội dung được tạo mới</p>
                </div>

                <div className="z-10">
                    <FilterDropdown label={FILTER_LABELS[filter] || "Lọc thời gian"}>
                        <div className="flex flex-col gap-1">
                            {options.map((opt) => (
                                <FilterOption
                                    key={opt.value}
                                    type="radio"
                                    label={opt.label}
                                    checked={filter === opt.value}
                                    onChange={() => onFilterChange(opt.value)}
                                />
                            ))}
                        </div>
                    </FilterDropdown>
                </div>
            </div>

            <div className="flex-1 min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#9CA3AF' }}
                            dy={10}
                            interval={filter === 'year' ? 0 : 'preserveStartEnd'}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#9CA3AF' }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                            labelStyle={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px' }}
                            formatter={(value) => [<span className="font-bold text-indigo-600">{value} bài</span>, ""]}
                            labelFormatter={(label, payload) => {
                                if (payload && payload[0]) return payload[0].payload.fullDate;
                                return label;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCards)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}