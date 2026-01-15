"use client";

import { FaLink } from "react-icons/fa6"; // 🔥 Import icon mắt xích
import TrendChart from "./TrendChart";
import DistributionChart from "./DistributionChart";

export default function AnalyticsCard({ data, filter, onFilterChange }) {
    const trendData = data?.trend || [];
    const distributionData = data?.distribution || [];

    return (
        // Thêm relative để làm điểm neo cho icon 'link'
        <div className="relative h-full group">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <TrendChart
                    data={trendData}
                    filter={filter}
                    onFilterChange={onFilterChange}
                />
                <DistributionChart
                    data={distributionData}
                    filter={filter}
                />
            </div>

            <div className="hidden lg:flex absolute top-2 left-[67%] -translate-x-1/2 z-10 
                            items-center justify-center w-16 h-16 
                            text-purple-500 rotate-12"
                title="Dữ liệu được đồng bộ theo bộ lọc thời gian"
            >
                <FaLink className="text-4xl" />
            </div>

        </div>
    );
}