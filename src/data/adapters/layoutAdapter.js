export const layoutAdapter = (data) => {
    if (!data) return null;

    // Đảm bảo config luôn an toàn để tránh lỗi crash khi render
    const safeConfig = data.config || { rows: 1, columns: [], positions: [] };

    return {
        id: data._id,
        title: data.title || "",
        slug: data.slug || "",

        // Giữ nguyên config gốc để dùng khi cần
        config: safeConfig,

        // 1. Tính toán số lượng card
        cardCount: Array.isArray(safeConfig.positions) ? safeConfig.positions.length : 0,

        // 2. Tính toán CSS cho Grid Preview ngay tại đây
        gridTemplateColumns: Array.isArray(safeConfig.columns)
            ? safeConfig.columns.map(() => "16px").join(" ")
            : "16px",

        gridTemplateRows: `repeat(${safeConfig.rows || 1}, 16px)`
    };
};