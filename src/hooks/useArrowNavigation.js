import { useEffect, useRef, useMemo } from "react";

export default function useArrowNavigation({
    items,
    activeId,
    setActiveId,
    direction = "horizontal",
    delay = 100,
    enabled = true,
}) {
    const lastTriggerRef = useRef(0);

    // 🔥 BƯỚC QUAN TRỌNG: Chuẩn hóa dữ liệu đầu vào
    const flatItems = useMemo(() => {
        if (Array.isArray(items)) return items;
        if (typeof items === 'object' && items !== null) {
            return Object.values(items).flat();
        }
        return [];
    }, [items]);

    useEffect(() => {
        if (!enabled || flatItems.length === 0) return;

        function handleKeyDown(e) {
            const now = Date.now();
            if (now - lastTriggerRef.current < delay) return;

            const index = flatItems.findIndex(i => i.id === activeId);
            if (index === -1) return;

            const moveNext = () => {
                lastTriggerRef.current = now;
                const nextIndex = (index + 1) % flatItems.length;
                setActiveId(flatItems[nextIndex].id);
            };

            const movePrev = () => {
                lastTriggerRef.current = now;
                const prevIndex = (index - 1 + flatItems.length) % flatItems.length;
                setActiveId(flatItems[prevIndex].id);
            };

            if (direction === "horizontal") {
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    moveNext();
                }
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    movePrev();
                }
            }

            if (direction === "vertical") {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    moveNext();
                }
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    movePrev();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [flatItems, activeId, enabled, direction, delay, setActiveId]);
}