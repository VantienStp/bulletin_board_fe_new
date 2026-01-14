"use client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

export default function useWeather() {
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchWeather = async () => {
			const fetchFromServer = async () => {
				try {
					const res = await fetch(`${API_BASE_URL}/weather/default`);
					if (res.ok) {
						const result = await res.json();
						setData(result);
					}
				} catch (err) {
					console.error("Server weather fetch error", err);
					setData(null);
				}
			};

			if (!navigator.geolocation) {
				await fetchFromServer();
				return;
			}

			navigator.geolocation.getCurrentPosition(
				async (pos) => {
					try {
						const { latitude, longitude } = pos.coords;

						const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

						const res = await fetch(
							`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`
						);

						if (!res.ok) throw new Error("API Error");
						const result = await res.json();

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
						await fetchFromServer();
					}
				},
				async () => {
					await fetchFromServer();
				}
			);
		};

		fetchWeather();
		const timer = setInterval(fetchWeather, 30 * 60 * 1000);

		return () => clearInterval(timer);
	}, []);

	return data;
}