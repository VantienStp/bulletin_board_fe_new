// hooks/useWeather.js
"use client";
import { useState, useEffect } from "react";

export default function useWeather() {
  const [weather, setWeather] = useState("☀️ Loading...");

  // Fallback cố định
  const fallback = `
    <img src="https://openweathermap.org/img/wn/01d.png" class="weather-icon" />
    <span>31°C | Thành phố Hồ Chí Minh , Bầu trời quang đãng</span>
  `;

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather(fallback);
      return;
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
          const city = data.name;
          let desc = data.weather[0].description;
          desc = desc.charAt(0).toUpperCase() + desc.slice(1);
          const icon = data.weather[0].icon;

          setWeather(`
            <img src="https://openweathermap.org/img/wn/${icon}.png" class="weather-icon" />
            <span>${temp}°C | ${city} , ${desc}</span>
          `);
        } catch (err) {
          setWeather(fallback);
        }
      },
      () => setWeather(fallback)   // user từ chối / lỗi định vị
    );
  }, []);

  return weather;
}
