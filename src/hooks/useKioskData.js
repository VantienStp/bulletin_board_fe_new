"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/api";

export function useKioskData() {
    // ==========================================
    // 1. DỮ LIỆU & STATE
    // ==========================================

    const { data: rawCategories } = useSWR(`${API_BASE_URL}/categories?mode=kiosk`, fetcher, {
        refreshInterval: 10 * 60 * 1000,
        revalidateOnFocus: false,
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [layoutConfig, setLayoutConfig] = useState(null);
    const [config, setConfig] = useState({ autoSwitch: true, switchInterval: 30 });
    const [avoidIds, setAvoidIds] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const intervalRef = useRef(null);
    const hasBooted = useRef(false);

    const latestStateRef = useRef({ selectedCategory, config });

    useEffect(() => {
        latestStateRef.current = { selectedCategory, config };
    }, [selectedCategory, config]);

    // Sắp xếp Categories
    const categories = useMemo(() => {
        if (!rawCategories || !Array.isArray(rawCategories)) return [];
        const order = ["Nổi Bật", "Tin Tức Mới", "Niêm Yết", "Lịch Xét Xử", "Ảnh Hoạt Động"];
        return [...rawCategories].sort((a, b) => {
            let indexA = order.indexOf(a.title);
            let indexB = order.indexOf(b.title);
            if (indexA === -1) indexA = 99;
            if (indexB === -1) indexB = 99;
            return indexA - indexB;
        });
    }, [rawCategories]);

    // ==========================================
    // 2. LOGIC HEARTBEAT (ĐÃ TỐI ƯU)
    // ==========================================
    useEffect(() => {
        const syncDevice = async () => {
            const currentData = latestStateRef.current;

            let deviceId = localStorage.getItem("kiosk_id");
            if (!deviceId) {
                deviceId = `ks-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem("kiosk_id", deviceId);
            }

            try {
                const res = await fetch(`${API_BASE_URL}/devices/heartbeat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        deviceId,
                        name: `Máy Kiosk ${window.location.hostname}`,
                        currentCategoryId: currentData.selectedCategory, // Đọc từ Ref
                        isAutoSwitch: currentData.config.autoSwitch      // Đọc từ Ref
                    }),
                });

                const data = await res.json();

                if (data.config) {
                    setConfig(prev => ({
                        ...prev,
                        autoSwitch: data.config.autoSwitch,
                        switchInterval: data.config.switchInterval || 30
                    }));

                    // Logic Boot vào trang mặc định
                    if (!hasBooted.current && data.config.defaultCategoryId) {
                        const defaultId = typeof data.config.defaultCategoryId === 'object'
                            ? data.config.defaultCategoryId._id
                            : data.config.defaultCategoryId;

                        // Tìm category trong danh sách hiện có (biến categories ở ngoài scope này có thể rỗng lúc đầu, cần check kỹ)
                        // Tuy nhiên vì categories là dependency của useEffect khác, ta xử lý ở useEffect fallback bên dưới sẽ an toàn hơn
                        // Hoặc ta có thể access trực tiếp rawCategories nếu cần thiết.
                        // Ở đây ta giữ nguyên logic cũ: đánh dấu đã nhận config
                    }
                }

                if (data.avoidCategoryIds) {
                    setAvoidIds(data.avoidCategoryIds);
                }

            } catch (err) {
                console.error("Heartbeat err:", err);
            }
        };

        syncDevice(); // Gọi lần đầu
        const timer = setInterval(syncDevice, 60 * 1000); // Gọi định kỳ 60s

        return () => clearInterval(timer);
    }, []); // 🚩 Dependency Rỗng: Timer chạy bền bỉ, không bao giờ bị reset khi chuyển trang

    // ==========================================
    // 3. LOGIC AUTO SWITCH
    // ==========================================
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const intervalMs = config.switchInterval * 60 * 1000;
        setTotalTime(intervalMs);
        setTimeLeft(intervalMs);

        if (!config.autoSwitch || categories.length === 0 || !selectedCategory) return;

        const countdown = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev - 1000;
                if (next <= 0) {
                    doAutoSwitch();
                    return intervalMs;
                }
                return next;
            });
        }, 1000);

        intervalRef.current = countdown;
        return () => clearInterval(countdown);
    }, [selectedCategory, categories, config, avoidIds]);

    // ==========================================
    // 4. ACTIONS
    // ==========================================
    const doAutoSwitch = () => {
        let candidates = categories.filter((cat) => cat._id !== selectedCategory);
        const safeCandidates = candidates.filter(cat => !avoidIds.includes(cat._id));
        const finalPool = safeCandidates.length > 0 ? safeCandidates : candidates;

        if (finalPool.length > 0) {
            const randomCat = finalPool[Math.floor(Math.random() * finalPool.length)];
            handleSelectCategory(randomCat);
        }
    };

    const handleSelectCategory = (cat) => {
        if (!cat) return;
        if (!hasBooted.current) hasBooted.current = true;

        setSelectedCategory(cat._id);
        const cfg = typeof cat.gridLayoutId === 'object' ? cat.gridLayoutId?.config : null;
        setLayoutConfig(cfg);
        localStorage.setItem("selectedCategory", cat._id);
    };

    // Fallback khởi tạo & Xử lý Default Category từ Server
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory && !hasBooted.current) {
            const savedId = localStorage.getItem("selectedCategory");
            const found = categories.find(c => c._id === savedId) || categories[0];
            handleSelectCategory(found);
        }
    }, [categories]);

    return {
        categories,
        selectedCategory,
        layoutConfig,
        config,
        timeLeft,
        totalTime,
        setAutoSwitch: (val) => setConfig(prev => ({ ...prev, autoSwitch: val })),
        handleSelectCategory
    };
}