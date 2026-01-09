"use client";
import { useState, useEffect } from "react";

export default function useWeather() {
  // State giờ lưu Object chứ không lưu String HTML nữa
  const [data, setData] = useState(null);

  useEffect(() => {
    // Hàm rút gọn tên thành phố (giữ nguyên logic của con)
    function shortenCityName(city) {
      const normalized = city.trim().toLowerCase();
      if (normalized === "thành phố hồ chí minh" || normalized === "hồ chí minh") {
        return "TP.Hồ Chí Minh";
      }
      if (normalized.startsWith("thành phố ")) {
        const name = city.replace(/^Thành phố\s+/i, "").trim();
        return `TP.${name}`;
      }
      return city;
    }

    if (!navigator.geolocation) {
      setData(null); // Không có vị trí thì null để component tự fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const apiKey = "b405235d32a7ca53648989fc7b145c87"; // Lưu ý: Nên đưa vào biến môi trường (.env)

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`
          );

          if (!res.ok) throw new Error("API Error");

          const result = await res.json();

          // Trả về DỮ LIỆU SẠCH
          setData({
            temp: Math.round(result.main.temp),
            city: shortenCityName(result.name),
            desc: result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1),
            icon: result.weather[0].icon
          });

        } catch (err) {
          setData(null); // Lỗi thì về null
        }
      },
      () => setData(null) // User từ chối quyền cũng về null
    );
  }, []);

  return data;
}