"use client";

import { FaLink } from "react-icons/fa6";
import TrendChart from "./TrendChart";
import DistributionChart from "./DistributionChart";

export default function AnalyticsCard({ data, label, onFilterChange }) {
    const trendData = data?.trend || [];
    const distributionData = data?.distribution || [];

    return (
        <div className="relative h-full group">
            {/* Bố cục Grid: 1 cột cho mobile, 3 cột cho desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                {/* Chiếm 2 phần bên trái trên desktop */}
                <div className="lg:col-span-2">
                    <TrendChart
                        data={trendData}
                        label={label}
                        onFilterChange={onFilterChange}
                    />
                </div>

                {/* Chiếm 1 phần bên phải */}
                <div className="lg:col-span-1">
                    <DistributionChart
                        data={distributionData}
                        filter="custom"
                    />
                </div>
            </div>

            {/* Icon cầu nối: Thông minh theo breakpoint */}
            <div
                className="absolute z-10 flex items-center justify-center text-purple-500 transition-all duration-300
                    top-[53.25%] left-10 -translate-x-1/2 -translate-y-1/2 rotate-90 lg:rotate-45

                    lg:top-10 lg:left-[67%] 
                    w-16 h-16 lg:w-16 lg:h-16"
                title="Dữ liệu đồng bộ"
            >
                <div className="">
                    <FaLink className="text-3xl" />
                </div>
            </div>
        </div>
    );
}