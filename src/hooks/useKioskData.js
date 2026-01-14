"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/api";
import { categoryAdapter } from "@/data/adapters/categoryAdapter";

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
    const [config, setConfig] = useState({ autoSwitch: true, switchInterval: 12 });
    const [avoidIds, setAvoidIds] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const intervalRef = useRef(null);
    const hasBooted = useRef(false);

    const latestStateRef = useRef({ selectedCategory, config });

    useEffect(() => {
        latestStateRef.current = { selectedCategory, config };
    }, [selectedCategory, config]);

    // 🔥 2. MAP QUA ADAPTER & SẮP XẾP
    const categories = useMemo(() => {
        if (!rawCategories || !Array.isArray(rawCategories)) return [];

        const adapted = rawCategories.map(cat => categoryAdapter(cat));

        return adapted.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [rawCategories]);

    // ==========================================
    // 2. HEARTBEAT
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
                // Gửi về server
                const res = await fetch(`${API_BASE_URL}/devices/heartbeat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        deviceId,
                        name: `Máy Kiosk ${window.location.hostname}`,
                        currentCategoryId: currentData.selectedCategory,
                        isAutoSwitch: currentData.config.autoSwitch
                    }),
                });

                const data = await res.json();

                if (data.config) {
                    setConfig(prev => {
                        const newInterval = data.config.switchInterval || 2;
                        const newAutoSwitch = data.config.autoSwitch;

                        if (prev.autoSwitch === newAutoSwitch && prev.switchInterval === newInterval) {
                            return prev;
                        }
                        return { ...prev, autoSwitch: newAutoSwitch, switchInterval: newInterval };
                    });

                    // 🔥 3. LOGIC TỰ ĐỘNG CHỌN DANH MỤC MẶC ĐỊNH
                    if (!hasBooted.current && data.config.defaultCategoryId) {
                        const defaultId = typeof data.config.defaultCategoryId === 'object'
                            ? data.config.defaultCategoryId._id
                            : data.config.defaultCategoryId;

                        const found = categories.find(c => c.id === defaultId || c._id === defaultId);

                        if (found) handleSelectCategory(found);
                    }
                }

                if (data.avoidCategoryIds) {
                    setAvoidIds(data.avoidCategoryIds);
                }

            } catch (err) {
                console.error("Heartbeat err:", err);
            }
        };

        if (categories.length > 0) syncDevice();

        const timer = setInterval(syncDevice, 60 * 1000);
        return () => clearInterval(timer);

    }, [categories]);

    // ==========================================
    // 3. AUTO SWITCH (TÍNH THEO PHÚT)
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
        let candidates = categories.filter((cat) => cat.id !== selectedCategory);
        const safeCandidates = candidates.filter(cat => !avoidIds.includes(cat.id));
        const finalPool = safeCandidates.length > 0 ? safeCandidates : candidates;

        if (finalPool.length > 0) {
            const randomCat = finalPool[Math.floor(Math.random() * finalPool.length)];
            handleSelectCategory(randomCat);
        }
    };

    const handleSelectCategory = (cat) => {
        if (!cat) return;
        if (!hasBooted.current) hasBooted.current = true;

        const catId = cat.id || cat._id;
        setSelectedCategory(catId);

        // 🔴 CŨ (Sai vì cat giờ là dữ liệu đã qua adapter, không còn gridLayoutId nested nữa)
        // const cfg = typeof cat.gridLayoutId === 'object' ? cat.gridLayoutId?.config : null;

        // 🟢 MỚI (Đúng: Lấy trực tiếp từ trường ta vừa thêm vào adapter)
        const cfg = cat.layoutConfig;

        setLayoutConfig(cfg);
        localStorage.setItem("selectedCategory", catId);
    };
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory && !hasBooted.current) {
            const savedId = localStorage.getItem("selectedCategory");
            const found = categories.find(c => (c.id || c._id) === savedId) || categories[0];
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