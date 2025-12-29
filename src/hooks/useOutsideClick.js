import { useEffect } from "react";

export default function useOutsideClick(ref, callback, enabled) {
    useEffect(() => {
        if (!enabled) return;
        function handle(e) {
            if (ref.current && !ref.current.contains(e.target)) callback();
        }
        function handleEsc(e) {
            if (e.key === "Escape") callback();
        }
        document.addEventListener("mousedown", handle);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handle);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [ref, callback, enabled]);
}