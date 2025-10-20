import { useState, useEffect, useCallback } from "react";

export function useSlideshow(contents) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % contents.length);
  }, [contents]);

  useEffect(() => {
    if (!contents || contents.length === 0) return;

    const current = contents[activeIndex];
    const delay =
      current.type === "video"
        ? 60000
        : Math.floor(Math.random() * 7000) + 8000; // 8–15s

    const timer = setTimeout(nextSlide, delay);
    return () => clearTimeout(timer);
  }, [activeIndex, contents, nextSlide]);

  return { activeIndex, nextSlide };
}
