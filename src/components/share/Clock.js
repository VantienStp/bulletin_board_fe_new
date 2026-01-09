"use client";
import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    updateClock();

    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <span className="font-bold text-[1.1vw] opacity-0">00:00:00</span>;

  return <span className="font-bold text-[1.1vw]">{time}</span>;
}