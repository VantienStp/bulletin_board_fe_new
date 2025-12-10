"use client";
import useWeather from "@/hooks/useWeather";

export default function Weather() {
  const weather = useWeather();
  return <span className="weather" dangerouslySetInnerHTML={{ __html: weather }} />;
}
