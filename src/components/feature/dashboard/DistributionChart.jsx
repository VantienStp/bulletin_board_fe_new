"use client";

import { useState } from "react";
import {
    PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList
} from "recharts";
import { FaChartPie, FaChartSimple } from "react-icons/fa6";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6B7280'];

const FILTER_LABELS = {
    week: "7 ngày qua",
    month: "Tháng này",
    quarter: "Quý này",
    year: "Năm nay"
};

export default function DistributionChart({ data = [], filter }) {
    const [chartType, setChartType] = useState('pie');

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">
                    Tỷ lệ nội dung <span className="font-normal text-gray-400 text-xs ml-1">({FILTER_LABELS[filter]})</span>
                </h3>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setChartType('pie')}
                        className={`p-1.5 rounded-md transition-all ${chartType === 'pie' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Biểu đồ tròn"
                    >
                        <FaChartPie />
                    </button>
                    <button
                        onClick={() => setChartType('bar')}
                        className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Biểu đồ cột"
                    >
                        <FaChartSimple />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
                {data.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 z-10">
                        <span className="text-4xl">∅</span>
                        <span className="text-xs mt-2">Chưa có dữ liệu</span>
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'pie' ? (
                        /* --- 1. BIỂU ĐỒ TRÒN --- */
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
                    ) : (
                        /* --- 2. BIỂU ĐỒ CỘT ĐỨNG (Vertical Columns) --- */
                        <BarChart
                            data={data}
                            // Bỏ layout="vertical" -> Mặc định là horizontal (cột đứng)
                            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                            barSize={40} // Độ rộng cột
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />

                            {/* Trục X hiện tên (Category) */}
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280', dy: 10 }} // dy: đẩy chữ xuống dưới chút
                            />

                            {/* Trục Y ẩn số đi cho đỡ rối (vì đã hiện số trên đầu cột) */}
                            <YAxis hide />

                            <Tooltip
                                cursor={{ fill: '#F9FAFB' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            />

                            <Bar dataKey="value" radius={[6, 6, 0, 0]}> {/* Bo tròn 2 góc trên */}
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}

                                {/* Số liệu nằm TRÊN ĐẦU cột */}
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    fill="#6B7280"
                                    fontSize={12}
                                    fontWeight={600}
                                />
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}