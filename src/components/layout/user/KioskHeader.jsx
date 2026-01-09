"use client";
import { memo } from "react";
import Clock from "@/components/share/Clock";
import Weather from "@/components/share/Weather";

function KioskHeader({
    toggleAutoSwitch
}) {
    return (
        <header className="relative overflow-hidden bg-[#F0F2F5] rounded-t-[1vh] rounded-tr-[0.5vw]">
            <div className="flex justify-between px-[2vw] pt-[0.8vw]">
                {/* Header Left */}
                <div className="flex flex-col items-start w-[65%] gap-[var(--gap-small)]">
                    <div className="title-block">
                        <span className="flex items-center gap-3 font-normal text-[28px]">
                            <span className="font-bold">Bản Tin Hoạt Động</span> Toà Án Nhân Dân
                        </span>

                        <div className="text-[1.1vw] opacity-95 text-[#6c6b6b]">
                            {(() => {
                                const d = new Date();
                                const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
                                return `${weekdays[d.getDay()]} ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
                            })()}
                        </div>
                    </div>
                </div>

                {/* Header Right */}
                <div className="flex flex-col items-end text-right text-[#333] text-[var(--font-size-medium)] w-[35%] gap-[var(--gap-tiny)]">
                    <div onClick={toggleAutoSwitch} style={{ cursor: "pointer", width: "100%" }}>
                        <Weather />
                    </div>
                    <Clock />
                </div>
            </div>
        </header>
    );
}

export default memo(KioskHeader);