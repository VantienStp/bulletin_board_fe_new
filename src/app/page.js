"use client";

import { useState, useEffect, useRef } from "react";
import Clock from "@/components/share/Clock";
import Weather from "@/components/share/Weather";
import Card from "@/components/user/Card";

import "@/styles/tokens.css";
import "@/styles/globals.css";

import { API_BASE_URL, BASE_URL } from "../lib/api";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(null);
  const intervalRef = useRef(null);
  const [autoSwitch, setAutoSwitch] = useState(() => {
    const saved = localStorage.getItem("autoSwitch");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // ✅ 1. Hàm kiểm tra Card có đang trong thời gian hiển thị hay không
  const isCardActive = (card) => {
    if (!card) return false;

    const now = new Date();
    const startDate = card.startDate ? new Date(card.startDate) : new Date(0);
    const endDate = card.endDate ? new Date(card.endDate) : null;

    // Kiểm tra thứ (0: Chủ Nhật, 6: Thứ Bảy)
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    // Điều kiện thời gian: Bắt đầu <= Hiện tại và (Không có kết thúc hoặc Kết thúc >= Hiện tại)
    const isWithinTime = startDate <= now && (!endDate || endDate >= now);

    // Điều kiện ngày hành chính: Nếu card yêu cầu WorkDaysOnly thì không được là cuối tuần
    const isWorkDayOk = !(card.isWorkDaysOnly && isWeekend);

    return isWithinTime && isWorkDayOk;
  };

  // ✅ 2. Hàm lấy dữ liệu (Tách ra để tái sử dụng cho Auto-Refresh)
  // ✅ 2. Hàm lấy dữ liệu (Tách ra để tái sử dụng cho Auto-Refresh)
  async function fetchCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();

      // --- BẮT ĐẦU PHẦN SẮP XẾP ---
      // Định nghĩa trình tự hiển thị mong muốn dựa trên tiêu đề (title)
      const order = ["Nổi Bật", "Tin Tức Mới", "Niêm Yết", "Lịch Xét Xử", "Ảnh Hoạt Động"];

      // Sắp xếp mảng data theo chỉ mục (index) trong mảng order
      const sortedData = data.sort((a, b) => {
        let indexA = order.indexOf(a.title);
        let indexB = order.indexOf(b.title);

        // Nếu một category không nằm trong danh sách order, cho nó xuống cuối
        if (indexA === -1) indexA = 99;
        if (indexB === -1) indexB = 99;

        return indexA - indexB;
      });
      // --- KẾT THÚC PHẦN SẮP XẾP ---

      setCategories(sortedData); // Lưu dữ liệu đã sắp xếp vào state

      if (sortedData.length > 0) {
        const saved = localStorage.getItem("selectedCategory");
        if (saved) {
          const found = sortedData.find((c) => c._id === saved);
          if (found) {
            setSelectedCategory(found._id);
            setLayoutConfig(found.gridLayoutId?.config || null);
            return;
          }
        }
        // Mặc định chọn category đầu tiên (Lúc này đã là "Nổi Bật")
        setSelectedCategory(sortedData[0]._id);
        setLayoutConfig(sortedData[0].gridLayoutId?.config || null);
      }
    } catch (err) {
      console.error("Lỗi fetch categories:", err);
    }
  }
  useEffect(() => {
    fetchCategories();

    // ✅ 3. Cơ chế Auto-Refresh: Cập nhật dữ liệu từ Server mỗi 30 phút
    // Giúp cập nhật danh sách card mới hoặc ẩn card vừa hết hạn mà không cần load lại trang
    const refreshDataInterval = setInterval(fetchCategories, 30 * 60 * 1000);
    return () => clearInterval(refreshDataInterval);
  }, []);

  // Ẩn devtools indicator (nếu có)
  useEffect(() => {
    const el = document.getElementById("devtools-indicator");
    if (el) el.style.display = "none";
  }, []);

  useEffect(() => {
    localStorage.setItem("autoSwitch", JSON.stringify(autoSwitch));
  }, [autoSwitch]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat._id);
    setLayoutConfig(cat.gridLayoutId?.config || null);
    localStorage.setItem("selectedCategory", cat._id);
  };

  useEffect(() => {
    const syncDevice = async () => {
      // 1. Kiểm tra ID trong localStorage
      let deviceId = localStorage.getItem("kiosk_id");

      // 2. Nếu chưa có (máy mới hoặc tab ẩn danh), tạo ID mới
      if (!deviceId) {
        deviceId = `ks-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("kiosk_id", deviceId);
      }

      // 3. Gửi Heartbeat về Server
      const sendHeartbeat = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/devices/heartbeat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceId,
              name: `Máy Kiosk ${window.location.hostname}`
            }),
          });
          const deviceData = await res.json();

          // ✅ 4. Nếu Server có gán Category mặc định cho máy này, hãy dùng nó!
          if (deviceData.config?.defaultCategoryId) {
            const catId = deviceData.config.defaultCategoryId._id;
            if (catId !== selectedCategory) {
              setSelectedCategory(catId);
              setLayoutConfig(deviceData.config.defaultCategoryId.gridLayoutId?.config);
            }
          }
        } catch (err) {
          console.error("Lỗi đồng bộ thiết bị:", err);
        }
      };

      sendHeartbeat();
      // Cứ 1 phút báo cáo 1 lần để Server biết vẫn đang Online
      const timer = setInterval(sendHeartbeat, 60000);
      return () => clearInterval(timer);
    };

    syncDevice();
  }, [selectedCategory]); // Chạy lại nếu category thay đổi

  // Logic tự động chuyển Category (Auto Switch)
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

  // Sidebar Highlight Animation
  useEffect(() => {
    if (!categories.length || !selectedCategory) return;
    const index = categories.findIndex((cat) => cat._id === selectedCategory);
    if (index < 0) return;

    const highlight = document.getElementById("sidebar-highlight");
    const items = document.querySelectorAll(".sidebar ul li a");

    if (highlight && items[index]) {
      const item = items[index];
      const vhTop = (item.offsetTop / window.innerHeight) * 100;
      const vhHeight = (item.offsetHeight / window.innerHeight) * 100;
      highlight.style.transform = `translateY(${vhTop}vh)`;
      highlight.style.height = `${vhHeight}vh`;
    }
  }, [selectedCategory, categories]);

  return (
    <>
      <nav className="sidebar">
        <a href="#" className="flex max-w-[7vw] max-h-[7vw] mb-[3vh] box-border z">
          <img src={`${BASE_URL}/uploads/logo2.png`} alt="Logo" className="w-[5vw] mt-[var(--margin-medium)]" />
        </a>
        <div id="sidebar-highlight">
          <div className="corner-bottom"></div>
        </div>
        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>
              <a onClick={() => handleSelectCategory(cat)} className={selectedCategory === cat._id ? "active" : ""}>
                <i className={cat.icon || "fas fa-folder"}></i>
                <span className="nav-text">{cat.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="content-wrapper">
        <header className="main-header">
          <div className="header-content">
            <div className="header-left">
              <div className="title-block">
                <span className="main-title">
                  <span className="highlight">Bản Tin Hoạt Động</span> Toà Án Nhân Dân Khu Vực 1 - TP.HCM
                </span>
                <div className="time-line">
                  {(() => {
                    const d = new Date();
                    const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
                    return `${weekdays[d.getDay()]} ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
                  })()}
                </div>
              </div>
            </div>
            <div className="header-right">
              <div onClick={() => setAutoSwitch((prev) => !prev)} style={{ cursor: "pointer", width: "100%" }}>
                <Weather />
              </div>
              <Clock />
            </div>
          </div>
        </header>

        <main className="main-content">
          <div
            className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: layoutConfig
                ? layoutConfig.columns.map((c) => `${c}fr`).join(" ")
                : "1fr 1fr 1fr",
              gridTemplateRows: layoutConfig ? `repeat(${layoutConfig.rows || 1}, auto)` : "auto",
            }}
          >
            {categories
              .filter((cat) => selectedCategory === cat._id)
              .flatMap((cat) => {
                const layoutCardCount = layoutConfig?.positions?.length || 0;

                // ✅ 4. LỌC CARD TRƯỚC KHI RENDER
                // Điều này cực kỳ quan trọng nếu Backend trả về card đã hết hạn trong mapping
                const activeMappings = cat.mappings.filter((map) => isCardActive(map.cardId));

                const maxCards = layoutCardCount > 0 ? layoutCardCount : 9;
                const visibleMappings = activeMappings.slice(0, maxCards);

                return visibleMappings.map((map, index) => {
                  if (!map.cardId) return null;
                  const pos = layoutConfig?.positions?.[index];
                  const style = pos
                    ? {
                      gridColumn: `${(pos.x || 0) + 1} / span ${pos.w || 1}`,
                      gridRow: `${(pos.y || 0) + 1} / span ${pos.h || 1}`,
                    }
                    : {};
                  return <Card key={map.cardId._id} {...map.cardId} style={style} />;
                });
              })}
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 right-0 w-[40vw] max-w-[600px] h-[66px] bg-[rgba(234,17,17,0.8)] text-slate-50 text-[26px] font-medium flex items-center justify-center rounded-tl-[20px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] select-none pointer-events-none z-[9999]">
        Vui lòng không chạm vào màn hình
      </div>
    </>
  );
}