"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import GridLayout from "react-grid-layout";
import { FaTimes, FaPlus } from 'react-icons/fa';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/styles/LayoutEditor.css";

export default function GridWorkspace({
    cols, rows, gap, rowHeight,
    layout,
    onLayoutChange,
    onAdd,
    onRemove
}) {
    const [width, setWidth] = useState(0);
    const wrapperRef = useRef(null);

    // Resize Observer để Grid luôn responsive theo container
    useEffect(() => {
        if (!wrapperRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });
        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Tạo mảng cell nền (Background Grid)
    const cells = useMemo(() => {
        const arr = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                arr.push({ x, y });
            }
        }
        return arr;
    }, [rows, cols]);

    return (
        <div className="layout-editor-wrapper bg-gray-50/50 rounded-xl border border-gray-200 p-8 min-h-[500px]" ref={wrapperRef}>
            <p className="text-center text-gray-400 text-sm mb-4 italic">
                * Kéo thả các ô màu xanh để sắp xếp. Click vào ô trống (nét đứt) để thêm mới.
            </p>

            <div
                style={{
                    position: 'relative',
                    height: rows * rowHeight + (rows - 1) * gap, // Tính chiều cao chính xác
                    width: '100%'
                }}
            >
                {/* 1. LAYER BASE (Background - Click to Add) */}
                <div
                    className="base-grid"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        gap: `${gap}px`
                    }}
                >
                    {cells.map((cell, i) => (
                        <div
                            key={i}
                            className="base-cell rounded-lg"
                            onClick={() => onAdd(cell.x, cell.y)}
                        >
                            <span className="text-gray-300 text-2xl"><FaPlus /></span>
                        </div>
                    ))}
                </div>

                {/* 2. LAYER OVERLAY (Draggable Items) */}
                {width > 0 && (
                    <div className="overlay-grid">
                        <GridLayout
                            className="layout"
                            layout={layout}
                            cols={cols}
                            width={width}
                            rowHeight={rowHeight}
                            margin={[gap, gap]}
                            isResizable
                            isDraggable
                            draggableCancel=".remove-btn"
                            onLayoutChange={onLayoutChange}
                            containerPadding={[0, 0]}
                        >
                            {layout.map((item, index) => (
                                <div key={item.i} className="active-item">
                                    <span className="text-lg font-mono">#{index + 1}</span>
                                    <button
                                        className="remove-btn"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => onRemove(item.i)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </GridLayout>
                    </div>
                )}
            </div>
        </div>
    );
}