"use client";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/api";

export function useKioskData() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [layoutConfig, setLayoutConfig] = useState(null);
    const [autoSwitch, setAutoSwitch] = useState(true);
    const intervalRef = useRef(null);

    // 1. Load AutoSwitch setting từ LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("autoSwitch");
        if (saved !== null) setAutoSwitch(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("autoSwitch", JSON.stringify(autoSwitch));
    }, [autoSwitch]);

    // 2. Hàm Fetch & Sort Data
    async function fetchCategories() {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            const data = await res.json();

            const order = ["Nổi Bật", "Tin Tức Mới", "Niêm Yết", "Lịch Xét Xử", "Ảnh Hoạt Động"];
            const sortedData = data.sort((a, b) => {
                let indexA = order.indexOf(a.title);
                let indexB = order.indexOf(b.title);
                if (indexA === -1) indexA = 99;
                if (indexB === -1) indexB = 99;
                return indexA - indexB;
            });

            setCategories(sortedData);

            // Logic chọn category mặc định hoặc giữ nguyên category đang chọn
            if (sortedData.length > 0) {
                const saved = localStorage.getItem("selectedCategory");
                // Nếu đang có selectedCategory thì tìm lại trong data mới để update layout
                // Nếu không thì lấy cái đầu tiên
                const currentId = selectedCategory || saved;
                const found = sortedData.find((c) => c._id === currentId) || sortedData[0];

                // Chỉ set nếu chưa có selectedCategory hoặc cần update lại
                if (!selectedCategory || found._id === selectedCategory) {
                    handleSelectCategory(found);
                }
            }
        } catch (err) {
            console.error("Lỗi fetch categories:", err);
        }
    }

    const handleSelectCategory = (cat) => {
        if (!cat) return;
        setSelectedCategory(cat._id);
        setLayoutConfig(cat.gridLayoutId?.config || null);
        localStorage.setItem("selectedCategory", cat._id);
    };

    // 3. Auto Refresh Data & Init
    useEffect(() => {
        fetchCategories();
        const refreshDataInterval = setInterval(fetchCategories, 30 * 60 * 1000);
        return () => clearInterval(refreshDataInterval);
    }, []);

    // 4. Auto Switch Logic
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
        }, 30 * 60 * 1000);

        return () => clearInterval(intervalRef.current);
    }, [selectedCategory, categories, autoSwitch]);

    // 5. Device Sync Heartbeat
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
                    const deviceData = await res.json();

                    if (deviceData.config?.defaultCategoryId) {
                        const cat = deviceData.config.defaultCategoryId;
                        if (cat._id !== selectedCategory) {
                            handleSelectCategory(cat);
                        }
                    }
                } catch (err) {
                    console.error("Lỗi đồng bộ thiết bị:", err);
                }
            };

            sendHeartbeat();
            const timer = setInterval(sendHeartbeat, 60000);
            return () => clearInterval(timer);
        };

        syncDevice();
    }, [selectedCategory]);

    return {
        categories,
        selectedCategory,
        layoutConfig,
        autoSwitch,
        setAutoSwitch,
        handleSelectCategory
    };
}