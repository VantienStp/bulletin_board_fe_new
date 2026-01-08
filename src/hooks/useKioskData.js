"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { API_BASE_URL } from "@/lib/api";

export function useKioskData() {
    // ==========================================
    // 1. DỮ LIỆU & STATE
    // ==========================================
    
    // Fetch Danh mục từ Server
    const { data: rawCategories } = useSWR(`${API_BASE_URL}/categories?mode=kiosk`, fetcher, {
        refreshInterval: 10 * 60 * 1000, // 10 phút refresh data 1 lần
        revalidateOnFocus: false,
    });

    // State dữ liệu hiển thị
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [layoutConfig, setLayoutConfig] = useState(null);
    
    // State cấu hình (Lấy từ Server về)
    const [config, setConfig] = useState({ 
        autoSwitch: true, 
        switchInterval: 30 
    });
    
    // State danh sách đen (Các trang đang bị máy khác khóa)
    const [avoidIds, setAvoidIds] = useState([]); 

    // State đếm ngược thời gian (Cho UI Progress Bar)
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    // Ref để giữ các timer và trạng thái khởi động
    const intervalRef = useRef(null);
    const hasBooted = useRef(false);

    const categories = useMemo(() => {
        if (!rawCategories || !Array.isArray(rawCategories)) {
            if (rawCategories) console.warn("API trả về không phải mảng:", rawCategories);
            return [];
        }

        const order = ["Nổi Bật", "Tin Tức Mới", "Niêm Yết", "Lịch Xét Xử", "Ảnh Hoạt Động"];
        
        // Đoạn này an toàn rồi vì đã check Array.isArray ở trên
        return [...rawCategories].sort((a, b) => {
            let indexA = order.indexOf(a.title);
            let indexB = order.indexOf(b.title);
            if (indexA === -1) indexA = 99;
            if (indexB === -1) indexB = 99;
            return indexA - indexB;
        });
    }, [rawCategories]);

    // ==========================================
    // 3. LOGIC HEARTBEAT (CỐT LÕI)
    // ==========================================
    useEffect(() => {
        const syncDevice = async () => {
            // A. Lấy hoặc Tạo Device ID
            let deviceId = localStorage.getItem("kiosk_id");
            if (!deviceId) {
                deviceId = `ks-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem("kiosk_id", deviceId);
            }

            // B. Hàm gửi tín hiệu lên Server
            const sendHeartbeat = async () => {
                try {
                    // Gửi thông tin hiện tại của máy lên Server
                    const res = await fetch(`${API_BASE_URL}/devices/heartbeat`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            deviceId,
                            name: `Máy Kiosk ${window.location.hostname}`,
                            currentCategoryId: selectedCategory, // Báo cáo trang đang chiếu
                            isAutoSwitch: config.autoSwitch      // 🚩 Báo cáo: Tôi có đang auto switch ko?
                        }),
                    });
                    
                    const data = await res.json();
                    
                    // C. Nhận cấu hình từ Server
                    if (data.config) {
                        // Cập nhật State Config
                        setConfig({
                            autoSwitch: data.config.autoSwitch,
                            switchInterval: data.config.switchInterval || 30
                        });

                        // 🚩 [QUAN TRỌNG] Xử lý Default Category khi khởi động
                        // Chỉ chạy 1 lần duy nhất khi mới mở web (hasBooted.current === false)
                        if (!hasBooted.current && data.config.defaultCategoryId) {
                            
                            // Lấy ID (xử lý trường hợp populate hoặc không)
                            const defaultId = typeof data.config.defaultCategoryId === 'object' 
                                ? data.config.defaultCategoryId._id 
                                : data.config.defaultCategoryId;

                            // Tìm category tương ứng trong list đã tải
                            const foundCat = categories.find(c => c._id === defaultId);
                            
                            if (foundCat) {
                                console.log(`🚀 [BOOT] Khởi động vào danh mục mặc định: ${foundCat.title}`);
                                handleSelectCategory(foundCat);
                            }
                            
                            // Đánh dấu là đã boot xong -> Các lần heartbeat sau sẽ không ép chuyển trang nữa
                            hasBooted.current = true;
                        }
                    }

                    // D. Nhận danh sách cần né (Tránh hiển thị trùng với máy đang bị khóa)
                    if (data.avoidCategoryIds) {
                        setAvoidIds(data.avoidCategoryIds);
                    }

                } catch (err) {
                    console.error("Heartbeat err:", err);
                }
            };

            // Gọi ngay lập tức khi component mount
            sendHeartbeat();
            
            // Gọi định kỳ mỗi 60 giây
            const timer = setInterval(sendHeartbeat, 60 * 1000);
            return () => clearInterval(timer);
        };

        syncDevice();
    }, [selectedCategory, categories, config.autoSwitch]); 
    // ^ Dependency: selectedCategory thay đổi -> Báo cáo ngay
    // ^ Dependency: config.autoSwitch thay đổi (user bấm nút khóa) -> Báo cáo ngay

    // ==========================================
    // 4. LOGIC AUTO SWITCH (ĐẾM NGƯỢC)
    // ==========================================
    useEffect(() => {
        // Clear timer cũ
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Tính thời gian (phút -> ms)
        const intervalMs = config.switchInterval * 60 * 1000;
        
        // Reset state UI
        setTotalTime(intervalMs);
        setTimeLeft(intervalMs);

        // Điều kiện dừng:
        // 1. Admin tắt AutoSwitch
        // 2. Không có dữ liệu
        // 3. Chưa chọn category nào
        if (!config.autoSwitch || categories.length === 0 || !selectedCategory) {
            return;
        }

        // Timer đếm ngược (Chạy mỗi 1 giây để update UI thanh tiến trình)
        const countdown = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev - 1000;
                
                // Hết giờ -> Chuyển trang
                if (next <= 0) {
                    doAutoSwitch();    // Gọi hàm chuyển
                    return intervalMs; // Reset lại full thời gian cho vòng sau
                }
                return next;
            });
        }, 1000);

        intervalRef.current = countdown;

        return () => clearInterval(countdown);
    }, [selectedCategory, categories, config, avoidIds]); 

    // ==========================================
    // 5. CÁC HÀM HỖ TRỢ (ACTIONS)
    // ==========================================

    // Hàm thực hiện chuyển trang thông minh
    const doAutoSwitch = () => {
        // Lọc các trang khác trang hiện tại
        let candidates = categories.filter((cat) => cat._id !== selectedCategory);
        
        // 🔥 Lọc bỏ các trang đang bị máy khác khóa (Server gửi avoidIds về)
        const safeCandidates = candidates.filter(cat => !avoidIds.includes(cat._id));

        // Fallback: Nếu né hết mà không còn gì -> Dùng lại danh sách ban đầu
        const finalPool = safeCandidates.length > 0 ? safeCandidates : candidates;

        if (finalPool.length > 0) {
            const randomCat = finalPool[Math.floor(Math.random() * finalPool.length)];
            handleSelectCategory(randomCat);
            console.log(`🔄 Auto Switch: ${randomCat.title}`);
        }
    };

    // Hàm chọn category & load layout
    const handleSelectCategory = (cat) => {
        if (!cat) return;
        
        // Nếu user chọn tay -> Đánh dấu là đã boot xong (để Heartbeat ko ghi đè nữa)
        if (!hasBooted.current) hasBooted.current = true;

        setSelectedCategory(cat._id);
        
        // Load layout config
        const cfg = typeof cat.gridLayoutId === 'object' ? cat.gridLayoutId?.config : null;
        setLayoutConfig(cfg);
        
        // Lưu local (backup)
        localStorage.setItem("selectedCategory", cat._id);
    };

    // Fallback khởi tạo (Nếu chưa có Heartbeat)
    // Để tránh màn hình trắng khi mới F5
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory && !hasBooted.current) {
            const savedId = localStorage.getItem("selectedCategory");
            const found = categories.find(c => c._id === savedId) || categories[0];
            handleSelectCategory(found);
            // Lưu ý: Ở đây chưa set hasBooted = true vội, để chờ Heartbeat quyết định "chính chủ"
        }
    }, [categories]);

    return {
        categories,
        selectedCategory,
        layoutConfig,
        config,
        timeLeft,
        totalTime,
        // Hàm override tạm thời (khi bấm nút trên Header)
        setAutoSwitch: (val) => setConfig(prev => ({ ...prev, autoSwitch: val })),
        handleSelectCategory
    };
}