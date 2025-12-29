import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export function useLayoutEditor(layoutId, initialConfig) {
    // Settings
    const [cols, setCols] = useState(5);
    const [rows, setRows] = useState(5);
    const [gap, setGap] = useState(16);
    const [rowHeight] = useState(80); // Cố định hoặc cho phép sửa tùy ý

    // Data
    const [layout, setLayout] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // --- INIT DATA ---
    useEffect(() => {
        if (initialConfig) {
            setCols(initialConfig.columns?.length || 5);
            setRows(initialConfig.rows || 5);

            if (initialConfig.positions) {
                const newLayout = initialConfig.positions.map((pos, i) => ({
                    i: i.toString(),
                    x: pos.x,
                    y: pos.y,
                    w: pos.w,
                    h: pos.h,
                }));
                setLayout(newLayout);
            }
        }
    }, [initialConfig]);

    // --- ACTIONS ---
    const handleAdd = (x, y) => {
        // Check trùng đơn giản
        const exists = layout.find((l) => l.x === x && l.y === y);
        if (!exists) {
            const id = Date.now().toString();
            setLayout((prev) => [...prev, { i: id, x, y, w: 1, h: 1 }]);
        }
    };

    const handleRemove = (id) => {
        setLayout((prev) => prev.filter((b) => b.i !== id));
    };

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
    };

    const handleReset = () => {
        if (confirm("Bạn có muốn reset về trạng thái ban đầu?")) {
            setCols(initialConfig?.columns?.length || 5);
            setRows(initialConfig?.rows || 5);
            setLayout([]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const updatedConfig = {
            columns: Array.from({ length: cols }, () => 1),
            rows,
            positions: layout.map((item) => ({
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
            })),
        };

        try {
            const res = await authFetch(`${API_BASE_URL}/gridlayouts/${layoutId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ config: updatedConfig }),
            });

            if (res.ok) alert("✅ Đã lưu bố cục thành công!");
            else alert("❌ Lưu thất bại");
        } catch (err) {
            console.error(err);
            alert("❌ Lỗi kết nối");
        } finally {
            setIsSaving(false);
        }
    };

    // Generate CSS code for preview
    const generatedCSS = `.parent {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap}px;
}
${layout.map(item => `.div${item.i} { grid-area: ${item.y + 1} / ${item.x + 1} / span ${item.h} / span ${item.w}; }`).join('\n')}`;

    return {
        cols, setCols,
        rows, setRows,
        gap, setGap,
        rowHeight,
        layout,
        isSaving,
        handleAdd,
        handleRemove,
        handleLayoutChange,
        handleReset,
        handleSave,
        generatedCSS
    };
}