import { format, eachDayOfInterval, eachMonthOfInterval } from "date-fns";
import { vi } from "date-fns/locale";

// Hàm bổ trợ lấp đầy dữ liệu trống cho biểu đồ
const fillTrendData = (rawData, meta) => {
    const data = (rawData || []).map(item => ({
        dateId: item._id,
        count: item.count
    }));

    const start = meta?.start ? new Date(meta.start) : new Date();
    const end = meta?.end ? new Date(meta.end) : new Date();
    const viewType = meta?.viewType || 'day';

    let filledData = [];

    if (viewType === 'month') {
        const months = eachMonthOfInterval({ start, end });
        filledData = months.map(date => {
            const apiDateKey = format(date, "yyyy-MM");
            const match = data.find(d => d.dateId === apiDateKey);
            return {
                name: `T${format(date, "M")}`,
                fullDate: format(date, "MMMM yyyy", { locale: vi }),
                value: match ? match.count : 0
            };
        });
    } else {
        const days = eachDayOfInterval({ start, end });
        filledData = days.map(date => {
            const displayDate = format(date, "dd/MM");
            const apiDateKey = format(date, "yyyy-MM-dd");
            const match = data.find(d => d.dateId === apiDateKey);
            return {
                name: displayDate,
                fullDate: format(date, "dd 'thg' MM, yyyy", { locale: vi }),
                value: match ? match.count : 0
            };
        });
    }
    return filledData;
};

export const dashboardAdapter = (data) => {
    if (!data) return defaultStats;

    return {
        overview: {
            devices: {
                total: data.overview?.devices?.total || 0,
                online: data.overview?.devices?.online || 0
            },
            cards: {
                total: data.overview?.cards?.total || 0,
                active: data.overview?.cards?.active || 0,
                expired: data.overview?.cards?.expired || 0
            },
            // 🔥 Map dữ liệu tổng kho từ chi tiết chi tiết (details)
            files: {
                total: data.overview?.files?.total || 0,
                image: data.overview?.files?.details?.image || 0,
                video: data.overview?.files?.details?.video || 0,
                pdf: data.overview?.files?.details?.pdf || 0,
                other: data.overview?.files?.details?.other || 0,
            },
            totalDownloads: data.overview?.totalDownloads || 0,
        },
        charts: {
            // Trend và Distribution vẫn nhận dữ liệu tương ứng từ data.charts
            trend: fillTrendData(data.charts?.cardTrend, data.meta),
            distribution: data.charts?.fileDistribution
                ? [
                    { name: 'Hình ảnh', value: data.charts.fileDistribution.image || 0 },
                    { name: 'Video', value: data.charts.fileDistribution.video || 0 },
                    { name: 'PDF', value: data.charts.fileDistribution.pdf || 0 },
                    { name: 'Khác', value: data.charts.fileDistribution.other || 0 },
                ].filter(item => item.value > 0)
                : []
        },
        topDevices: data.topDevices?.map(d => ({ ...d })) || []
    };
};

export const defaultStats = {
    overview: {
        devices: { total: 0, online: 0 },
        cards: { total: 0, active: 0, expired: 0 },
        files: { total: 0, image: 0, video: 0, pdf: 0, other: 0 },
        expiredCards: 0,
        totalDownloads: 0
    },
    charts: { trend: [], distribution: [] },
    topDevices: []
};