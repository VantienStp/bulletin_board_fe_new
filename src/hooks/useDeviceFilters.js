import { useState, useMemo } from "react";

export function useDeviceFilters(devices) {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({
        status: [] // Vẫn giữ là mảng để tương thích code cũ, nhưng chỉ chứa tối đa 1 phần tử
    });

    // Helper check trạng thái
    const checkStatus = (lastSeen) => {
        if (!lastSeen) return "offline";
        const diff = (new Date() - new Date(lastSeen)) / 1000 / 60;
        return diff < 3 ? "online" : "offline";
    };

    // ✅ SỬA LẠI LOGIC NÀY CHO RADIO
    const setStatusFilter = (val) => {
        setFilters(prev => {
            // Nếu đang chọn đúng cái đó thì không làm gì (hoặc có thể cho phép toggle tắt)
            // Ở đây logic Radio chuẩn: Chọn cái nào thì set cái đó, bỏ các cái khác.
            return { ...prev, status: [val] }; 
        });
    };

    // ✅ THÊM HÀM CLEAR
    const clearFilters = () => {
        setFilters({ status: [] });
    };

    const filteredDevices = useMemo(() => {
        if (!devices) return [];

        return devices.filter(d => {
            const lowerSearch = searchText.toLowerCase();
            const matchSearch =
                (d.name || "").toLowerCase().includes(lowerSearch) ||
                (d.deviceId || "").toLowerCase().includes(lowerSearch);

            const status = checkStatus(d.lastSeen);
            const matchStatus = filters.status.length === 0 || filters.status.includes(status);

            return matchSearch && matchStatus;
        });
    }, [devices, searchText, filters]);

    return {
        searchText,
        setSearchText,
        filters,
        setStatusFilter, // Đổi tên hàm cho đúng ngữ nghĩa
        clearFilters,    // Xuất hàm này ra
        filteredDevices
    };
}