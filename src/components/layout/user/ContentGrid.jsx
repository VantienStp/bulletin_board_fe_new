"use client";
import { memo, useMemo } from "react";
import Card from "@/components/user/Card";
import { isCardActive } from "@/utils/dateUtils";

function ContentGrid({ categories, selectedCategory, layoutConfig }) {

    // 1. Dùng useMemo để tính toán Style. 
    const gridStyle = useMemo(() => ({
        display: "grid",
        gridTemplateColumns: layoutConfig
            ? layoutConfig.columns.map((c) => `${c}fr`).join(" ")
            : "1fr 1fr 1fr",
        gridTemplateRows: layoutConfig
            ? `repeat(${layoutConfig.rows || 1}, auto)`
            : "auto",
    }), [layoutConfig]);

    // 2. Dùng useMemo để tính toán danh sách Card cần hiển thị.
    const visibleMappings = useMemo(() => {
        const currentCategory = categories.find((cat) => cat._id === selectedCategory);
        if (!currentCategory) return [];

        const layoutCardCount = layoutConfig?.positions?.length || 0;
        const activeMappings = currentCategory.mappings.filter((map) => isCardActive(map.cardId));
        const maxCards = layoutCardCount > 0 ? layoutCardCount : 9;
        return activeMappings.slice(0, maxCards);

    }, [categories, selectedCategory, layoutConfig]);

    if (!visibleMappings.length && categories.length > 0) return null;

    return (
        <div className="grid" style={gridStyle}>
            {visibleMappings.map((map, index) => {
                if (!map.cardId) return null;

                const pos = layoutConfig?.positions?.[index];
                const style = pos
                    ? {
                        gridColumn: `${(pos.x || 0) + 1} / span ${pos.w || 1}`,
                        gridRow: `${(pos.y || 0) + 1} / span ${pos.h || 1}`,
                    }
                    : {};

                return <Card key={map.cardId._id} {...map.cardId} style={style} />;
            })}
        </div>
    );
}

// 4. Xuất component với memo (Quan trọng nhất)
export default memo(ContentGrid);