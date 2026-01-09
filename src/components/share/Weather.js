"use client";
import useWeather from "@/hooks/useWeather";

export default function Weather() {
  const data = useWeather();

  // Dữ liệu mặc định (Fallback) khi đang load hoặc lỗi
  const displayData = data || {
    icon: "02d",
    temp: 30,
    city: "TP.Hồ Chí Minh",
    desc: "Bầu trời quang đãng"
  };

  return (
    <div className="flex items-center justify-end gap-[0.5vw] w-full mt-[0.3vw]">
      {/* Icon Thời tiết */}
      <img
        src={`https://openweathermap.org/img/wn/${displayData.icon}.png`}
        alt="Weather Icon"
        className="w-[8%] h-auto align-middle drop-shadow-[0.5vw_0.2vw_0.3vw_rgba(0,0,0,0.4)]"
      />

      {/* Thông tin chữ */}
      <span className="text-[1.1vw] text-[#6c6b6b]">
        {displayData.temp}°C | {displayData.city}, {displayData.desc}
      </span>
    </div>
  );
}