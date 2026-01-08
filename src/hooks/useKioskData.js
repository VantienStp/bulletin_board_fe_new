"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/api";

export function useKioskData() {
    const { data: rawCategories } = useSWR(`${API_BASE_URL}/categories?mode=kiosk`, fetcher, {
        refreshInterval: 10 * 60 * 1000,
        revalidateOnFocus: false,
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [layoutConfig, setLayoutConfig] = useState(null);
    const [autoSwitch, setAutoSwitch] = useState(true);
    const intervalRef = useRef(null);

    // 2. Xử lý dữ liệu (Sort) mỗi khi rawCategories thay đổi
    const categories = useMemo(() => {
        if (!rawCategories) return [];

        const order = ["Nổi Bật", "Tin Tức Mới", "Niêm Yết", "Lịch Xét Xử", "Ảnh Hoạt Động"];
        return [...rawCategories].sort((a, b) => {
            let indexA = order.indexOf(a.title);
            let indexB = order.indexOf(b.title);
            if (indexA === -1) indexA = 99;
            if (indexB === -1) indexB = 99;
            return indexA - indexB;
        });
    }, [rawCategories]);

    // 3. Logic chọn Category mặc định lần đầu tiên
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            const saved = localStorage.getItem("selectedCategory");
            // Ưu tiên saved, nếu không có thì lấy cái đầu tiên
            const found = categories.find((c) => c._id === saved) || categories[0];
            handleSelectCategory(found);
        }
    }, [categories]);

    // 4. Các logic phụ (AutoSwitch, Heartbeat) giữ nguyên
    useEffect(() => {
        const saved = localStorage.getItem("autoSwitch");
        if (saved !== null) setAutoSwitch(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("autoSwitch", JSON.stringify(autoSwitch));
    }, [autoSwitch]);

    const handleSelectCategory = (cat) => {
        if (!cat) return;
        setSelectedCategory(cat._id);
        // Backend trả về layoutTitle hoặc populate gridLayoutId, kiểm tra kỹ structure
        // Ở đây giả sử structure đã chuẩn qua Adapter hoặc populate backend
        const config = typeof cat.gridLayoutId === 'object' ? cat.gridLayoutId?.config : null;
        setLayoutConfig(config);

        localStorage.setItem("selectedCategory", cat._id);
    };

    // Logic Auto Switch
    useEffect(() => {
        if (!autoSwitch || categories.length === 0 || !selectedCategory) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            const others = categories.filter((cat) => cat._id !== selectedCategory);
            if (others.length === 0) return;
            const randomCat = others[Math.floor(Math.random() * others.length)];
            handleSelectCategory(randomCat);
        }, 2 * 60 * 1000); // 30 phút đổi tab 1 lần

        return () => clearInterval(intervalRef.current);
    }, [selectedCategory, categories, autoSwitch]);

    // Logic Device Heartbeat (Giữ nguyên)
    useEffect(() => {
        const syncDevice = async () => {
            let deviceId = localStorage.getItem("kiosk_id");
            if (!deviceId) {
                deviceId = `ks-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem("kiosk_id", deviceId);
            }

            const sendHeartbeat = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/devices/heartbeat`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            deviceId,
                            name: `Máy Kiosk ${window.location.hostname}`,
                        }),
                    });
                    // Logic nhận lệnh điều khiển từ xa (nếu có)
                    const deviceData = await res.json();
                    if (deviceData.config?.defaultCategoryId) {
                        // ... logic ép chuyển trang từ xa
                    }
                } catch (err) {
                    console.error("Heartbeat error:", err);
                }
            };

            sendHeartbeat();
            const timer = setInterval(sendHeartbeat, 60 * 1000); // 1 phút heartbeat
            return () => clearInterval(timer);
        };

        syncDevice();
    }, []);

    return {
        categories,
        selectedCategory,
        layoutConfig,
        autoSwitch,
        setAutoSwitch,
        handleSelectCategory
    };
}