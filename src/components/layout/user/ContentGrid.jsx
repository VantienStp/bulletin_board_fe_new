"use client";
import Card from "@/components/user/Card";
import { isCardActive } from "@/utils/dateUtils";

export default function ContentGrid({ categories, selectedCategory, layoutConfig }) {
    // Tính toán Grid Style
    const gridStyle = {
        display: "grid",
        gridTemplateColumns: layoutConfig
            ? layoutConfig.columns.map((c) => `${c}fr`).join(" ")
            : "1fr 1fr 1fr",
        gridTemplateRows: layoutConfig
            ? `repeat(${layoutConfig.rows || 1}, auto)`
            : "auto",
    };

    const currentCategory = categories.find((cat) => cat._id === selectedCategory);
    if (!currentCategory) return null;

    // Lọc và tính toán danh sách Card
    const layoutCardCount = layoutConfig?.positions?.length || 0;
    const activeMappings = currentCategory.mappings.filter((map) => isCardActive(map.cardId));
    const maxCards = layoutCardCount > 0 ? layoutCardCount : 9;
    const visibleMappings = activeMappings.slice(0, maxCards);

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