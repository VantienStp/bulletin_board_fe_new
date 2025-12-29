"use client";
import Clock from "@/components/share/Clock";
import Weather from "@/components/share/Weather";

export default function KioskHeader({ toggleAutoSwitch }) {
    return (
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
                    <div onClick={toggleAutoSwitch} style={{ cursor: "pointer", width: "100%" }}>
                        <Weather />
                    </div>
                    <Clock />
                </div>
            </div>
        </header>
    );
}