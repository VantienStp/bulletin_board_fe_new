"use client";

import {
    PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6B7280'];

const FILTER_LABELS = {
    week: "7 ngày qua",
    month: "Tháng này",
    quarter: "Quý này",
    year: "Năm nay"
};

export default function DistributionChart({ data = [], filter }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">
                    Tỷ lệ nội dung <span className="font-normal text-gray-400 text-xs ml-1">({FILTER_LABELS[filter]})</span>
                </h3>
            </div>

            <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
                {data.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                        <span className="text-4xl">∅</span>
                        <span className="text-xs mt-2">Chưa có dữ liệu</span>
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%" cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                            labelLine={true}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}