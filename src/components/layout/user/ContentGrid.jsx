"use client";
import { memo, useMemo } from "react";
import Card from "@/components/user/Card";
import { isCardActive } from "@/utils/dateUtils";

function ContentGrid({ categories, selectedCategory, layoutConfig }) {

    const gridStyle = useMemo(() => ({
        display: "grid",
        gridTemplateColumns: layoutConfig
            ? layoutConfig.columns.map((c) => `${c}fr`).join(" ")
            : "1fr 1fr 1fr",
        gridTemplateRows: layoutConfig
            ? `repeat(${layoutConfig.rows || 1}, auto)`
            : "auto",
    }), [layoutConfig]);

    const visibleMappings = useMemo(() => {
        // 🔥 SỬA: Đổi cat._id thành cat.id (vì đã qua adapter)
        const currentCategory = categories.find((cat) => cat.id === selectedCategory);

        // Thêm check an toàn cho mappings
        if (!currentCategory || !currentCategory.mappings) return [];

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

                // CardId thường là object chưa qua adapter nên vẫn giữ _id, 
                // nhưng để an toàn ta check cả 2
                return <Card key={map.cardId._id || map.cardId.id} {...map.cardId} style={style} />;
            })}
        </div>
    );
}

export default memo(ContentGrid);