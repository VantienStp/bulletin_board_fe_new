"use client";
import Clock from "@/components/share/Clock";
import Weather from "@/components/share/Weather";

export default function KioskHeader({ 
    toggleAutoSwitch, 
    isAutoSwitch, // Trạng thái: Có đang chạy tự động không?
    progress      // Số % tiến trình (0-100)
}) {
    return (
        <header className="main-header relative overflow-hidden">
            <div className="header-content">
                <div className="header-left">
                    <div className="title-block">
                        <span className="main-title flex items-center gap-3">
                            {/* {!isAutoSwitch && (
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[0.8vw] font-bold bg-red-100 text-red-600 border border-red-200 animate-pulse">
                                    <i className="fas fa-lock mr-2"></i> Đang Khóa
                                </span>
                            )} */}
                            
                            <span className="highlight">Bản Tin Hoạt Động</span> Toà Án Nhân Dân
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
                    {/* Bấm vào thời tiết để test bật/tắt thủ công (ẩn) */}
                    <div onClick={toggleAutoSwitch} style={{ cursor: "pointer", width: "100%" }}>
                        <Weather />
                    </div>
                    <Clock />
                </div>
            </div>

            {/* 👇 THANH TIẾN TRÌNH: Chỉ hiện khi đang chạy AutoSwitch */}
            
        </header>
    );
}