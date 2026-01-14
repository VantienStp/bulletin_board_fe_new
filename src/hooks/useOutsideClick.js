// src/hooks/useOutsideClick.js
import { useEffect } from "react";

export default function useOutsideClick(ref, callback) {
    useEffect(() => {
        function handleClickOutside(event) {
            // Nếu ref tồn tại VÀ click không nằm trong ref -> Gọi callback
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        // Bắt sự kiện chuột và cảm ứng
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, callback]);
}