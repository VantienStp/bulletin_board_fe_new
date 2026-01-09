"use client";
import { useState, useEffect } from "react";

export default function useWeather() {
  const [weather, setWeather] = useState("☀️ Loading...");

  // Style cho icon: w-8%, drop-shadow
  const iconClass = "w-[8%] h-auto align-middle drop-shadow-[0.5vw_0.2vw_0.3vw_rgba(0,0,0,0.4)]";

  // Style cho text: text-1.1vw, màu xám
  const textClass = "text-[1.1vw] text-[rgb(108,107,107)]";

  // Fallback cố định
  const fallback = `
    <img src="https://openweathermap.org/img/wn/02d.png" class="${iconClass}" />
    <span class="${textClass}">30°C | TP.Hồ Chí Minh, Bầu trời quang đãng</span>
  `;

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather(fallback);
      return;
    }

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

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const apiKey = "b405235d32a7ca53648989fc7b145c87";

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`
          );

          if (!res.ok) {
            setWeather(fallback);
            return;
          }

          const data = await res.json();
          const temp = Math.round(data.main.temp);
          let city = shortenCityName(data.name);
          let desc = data.weather[0].description;
          desc = desc.charAt(0).toUpperCase() + desc.slice(1);
          const icon = data.weather[0].icon;

          // Cập nhật HTML với class Tailwind
          setWeather(`
            <img src="https://openweathermap.org/img/wn/${icon}.png" class="${iconClass}" />
            <span class="${textClass}">${temp}°C | ${city} , ${desc}</span>
          `);
        } catch (err) {
          setWeather(fallback);
        }
      },
      () => setWeather(fallback)
    );
  }, []);

  return weather;
}