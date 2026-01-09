"use client";
import useWeather from "@/hooks/useWeather";

export default function Weather() {
  const weather = useWeather();
  return (
    <span
      className="flex items-center justify-end gap-[0.5vw] w-full mt-[0.3vw]"
      dangerouslySetInnerHTML={{ __html: weather }}
    />
  );
}