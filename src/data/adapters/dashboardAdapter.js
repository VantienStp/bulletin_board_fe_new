import {
    format, subDays, startOfYear, endOfYear, startOfMonth, startOfQuarter,
    eachDayOfInterval, eachMonthOfInterval
} from "date-fns";
import { vi } from "date-fns/locale";

// Hàm logic: Lấp đầy khoảng trống ngày tháng
const fillTrendData = (rawData, filter) => {
    // 🔥 BƯỚC 1: Chuẩn hóa dữ liệu API trước khi xử lý
    // API trả về: { _id: "2026-01-15", count: 5 }
    // Ta map lại để dễ tìm kiếm
    const data = (rawData || []).map(item => ({
        dateId: item._id, // Giữ nguyên format YYYY-MM-DD hoặc YYYY-MM
        count: item.count
    }));

    const now = new Date();
    let filledData = [];

    // 1. LOGIC CHO NĂM (Lấy 12 tháng từ đầu năm)
    if (filter === 'year') {
        const months = eachMonthOfInterval({
            start: startOfYear(now),
            end: endOfYear(now)
        });
        filledData = months.map(date => {
            // Backend trả về group theo tháng: "2026-01"
            const apiDateKey = format(date, "yyyy-MM");

            const match = data.find(d => d.dateId === apiDateKey);

            return {
                name: `T${format(date, "M")}`,
                fullDate: format(date, "MMMM yyyy", { locale: vi }),
                value: match ? match.count : 0
            };
        });
    }
    // 2. LOGIC CHO TUẦN / THÁNG / QUÝ
    else {
        let startDate;
        if (filter === 'month') startDate = startOfMonth(now);
        else if (filter === 'quarter') startDate = startOfQuarter(now);
        else startDate = subDays(now, 6); // Tuần (mặc định)

        const days = eachDayOfInterval({
            start: startDate,
            end: now
        });

        filledData = days.map(date => {
            // Format để hiển thị trục X (VD: 15/01)
            const displayDate = format(date, "dd/MM");

            // Format chuẩn để so sánh với API (VD: 2026-01-15)
            const apiDateKey = format(date, "yyyy-MM-dd");

            // 🔥 Tìm kiếm chính xác
            const match = data.find(d => d.dateId === apiDateKey);

            return {
                name: displayDate,
                fullDate: format(date, "dd 'thg' MM", { locale: vi }),
                value: match ? match.count : 0
            };
        });
    }
    return filledData;
};

export const dashboardAdapter = (data, filter = 'week') => {
    if (!data) return defaultStats;

    return {
        overview: {
            devices: data.overview?.devices || 0,
            cards: data.overview?.cards || 0,
            files: data.overview?.files || 0,
            users: data.overview?.users || 0,
            totalDownloads: data.overview?.totalDownloads || 0,
        },

        charts: {
            // Gọi hàm xử lý và truyền filter vào
            trend: fillTrendData(data.charts?.cardTrend, filter),

            distribution: data.charts?.fileDistribution
                ? [
                    { name: 'Hình ảnh', value: data.charts.fileDistribution.image || 0 },
                    { name: 'Video', value: data.charts.fileDistribution.video || 0 },
                    { name: 'PDF', value: data.charts.fileDistribution.pdf || 0 },
                    { name: 'Khác', value: data.charts.fileDistribution.other || 0 },
                ].filter(item => item.value > 0)
                : []
        },

        topDevices: Array.isArray(data.topDevices)
            ? data.topDevices.map(d => ({
                id: d._id,
                name: d.name,
                status: d.status,
                currentContent: d.config?.defaultCategoryId?.title || "Mặc định",
                lastSeen: d.lastSeen ? new Date(d.lastSeen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Chưa online'
            }))
            : []
    };
};

export const defaultStats = {
    overview: { devices: 0, cards: 0, files: 0, users: 0, totalDownloads: 0 },
    charts: { trend: [], distribution: [] },
    topDevices: []
};