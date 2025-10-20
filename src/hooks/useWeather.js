// hooks/useWeather.js
"use client";
import { useState, useEffect } from "react";

export default function useWeather() {
  const [weather, setWeather] = useState("☀️ Loading...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather("Không hỗ trợ định vị");
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
          const data = await res.json();
          const temp = Math.round(data.main.temp);
          const city = data.name;
          let desc = data.weather[0].description;
          desc = desc.charAt(0).toUpperCase() + desc.slice(1);
          const icon = data.weather[0].icon;

          setWeather(
            `<img src="https://openweathermap.org/img/wn/${icon}.png" class="weather-icon"/> ${temp}°C | ${city} | ${desc}`
          );
        } catch (err) {
          setWeather("☀️ 30°C | TP.HCM");
        }
      },
      () => setWeather("Không thể lấy vị trí")
    );
  }, []);

  return weather;
}
