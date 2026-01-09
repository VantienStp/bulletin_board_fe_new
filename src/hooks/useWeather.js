"use client";
import { useState, useEffect } from "react";

export default function useWeather() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. Tách hàm fetch ra để tái sử dụng
    const fetchWeather = () => {
      if (!navigator.geolocation) {
        setData(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            // LƯU Ý: API Key này nên giấu trong .env, để đây lộ nguy hiểm nhé
            const apiKey = "b405235d32a7ca53648989fc7b145c87";

            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`
            );

            if (!res.ok) throw new Error("API Error");
            const result = await res.json();

            // Hàm rút gọn tên (giữ nguyên logic của con)
            let city = result.name;
            const normalized = city.trim().toLowerCase();
            if (normalized === "thành phố hồ chí minh" || normalized === "hồ chí minh") city = "TP.Hồ Chí Minh";
            else if (normalized.startsWith("thành phố ")) city = `TP.${city.replace(/^Thành phố\s+/i, "").trim()}`;

            setData({
              temp: Math.round(result.main.temp),
              city: city,
              desc: result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1),
              icon: result.weather[0].icon
            });
          } catch (err) {
            console.error("Weather fetch error", err);
            // Không set null ở đây để giữ dữ liệu cũ nếu mạng chập chờn
          }
        },
        () => setData(null)
      );
    };

    // 2. Gọi lần đầu ngay lập tức
    fetchWeather();

    // 3. Thiết lập gọi định kỳ mỗi 30 phút (30 * 60 * 1000)
    const timer = setInterval(fetchWeather, 30 * 60 * 1000);

    // 4. Dọn dẹp
    return () => clearInterval(timer);
  }, []);

  return data;
}