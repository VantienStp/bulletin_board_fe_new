"use client";
import useWeather from "@/hooks/useWeather";

export default function Weather() {
  const weather = useWeather();
  return <span id="weather" dangerouslySetInnerHTML={{ __html: weather }} />;
}
