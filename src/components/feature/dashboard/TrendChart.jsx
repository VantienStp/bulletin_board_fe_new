"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import TimeFilter from "./TimeFilter"; // 🔥 Import cái mới

export default function TrendChart({ data = [], label, onFilterChange }) {
    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-gray-800">Xu hướng đăng bài</h3>
                    {/* Hiển thị Label động */}
                    <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded">
                        {label || "Đang tải..."}
                    </p>
                </div>

                <div className="z-10">
                    <TimeFilter onFilterChange={onFilterChange} />
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
                            axisLine={false} tickLine={false}
                            tick={{ fontSize: 11, fill: '#9CA3AF' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false} tickLine={false}
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
                            type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3}
                            fillOpacity={1} fill="url(#colorCards)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}