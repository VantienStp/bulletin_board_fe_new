"use client";
import { useState, useEffect, useRef } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { FaRedo, FaSave, FaTimes } from "react-icons/fa";
import "@/styles/layout-editor.css";
import { API_BASE_URL } from "@/lib/api";

export default function LayoutEditor({ layoutId, layoutTitle, initialConfig }) {
  const [cols, setCols] = useState(5);
  const [rows, setRows] = useState(5);
  const [gap, setGap] = useState(8);
  const [layout, setLayout] = useState([]);
  const [width, setWidth] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [spin, setSpin] = useState(false);

  const wrapperRef = useRef(null);

  /* LOAD CONFIG */
  useEffect(() => {
    if (initialConfig) {
      setCols(initialConfig.columns?.length || 5);
      setRows(initialConfig.rows || 5);

      if (initialConfig.positions) {
        setLayout(
          initialConfig.positions.map((pos, i) => ({
            i: i.toString(),
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
          }))
        );
      }
    }
  }, [initialConfig]);

  /* RESIZE HANDLER */
  useEffect(() => {
    const resize = () => wrapperRef.current && setWidth(wrapperRef.current.offsetWidth);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [cols, gap]);

  /* Add block */
  const handleAdd = (x, y) =>
    setLayout((prev) => [...prev, { i: Date.now().toString(), x, y, w: 1, h: 1 }]);

  /* Remove block */
  const handleRemove = (id) =>
    setLayout((prev) => prev.filter((item) => item.i !== id));

  /* Save */
  const handleSave = async () => {
    if (!layoutId) return alert("⚠️ Không có ID layout!");

    setIsSaving(true);
    const updatedConfig = {
      columns: Array.from({ length: cols }, () => 1),
      rows,
      positions: layout.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h })),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/gridLayouts/${layoutId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: updatedConfig }),
      });

      if (!res.ok) throw new Error();
      alert("✅ Layout đã được cập nhật!");
    } catch {
      alert("❌ Lỗi khi lưu layout!");
    } finally {
      setIsSaving(false);
    }
  };

  /* Reset */
  const handleReset = () => {
    setLayout([]);
    setCols(initialConfig?.columns?.length || 5);
    setRows(initialConfig?.rows || 5);
  };

  /* HTML & CSS preview */
  const generateHTML = () =>
    `<div class="parent">\n${layout
      .map((i) => `  <div class="div${i.i}">${i.i}</div>`)
      .join("\n")}\n</div>`;

  const generateCSS = () =>
    `.parent {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap}px;
}

${layout
      .map(
        (i) =>
          `.div${i.i} {
  grid-column: ${i.x + 1} / span ${i.w};
  grid-row: ${i.y + 1} / span ${i.h};
}`
      )
      .join("\n")}`;

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  /* BASE CELLS */
  const cells = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) cells.push({ x, y });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <h1 className="text-2xl font-bold">Trình tạo Grid Layout {layoutTitle}</h1>
        <p className="text-gray-600">Kéo – thả – chỉnh kích thước để tạo layout.</p>

        {/* Controls */}
        <div className="flex items-center gap-6 flex-wrap">
          {/* Cols */}
          <div className="flex items-center gap-2">
            <label>Số cột:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => setCols(+e.target.value)}
              className="w-16 border rounded p-1 text-center"
            />
          </div>

          {/* Rows */}
          <div className="flex items-center gap-2">
            <label>Số hàng:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rows}
              onChange={(e) => setRows(+e.target.value)}
              className="w-16 border rounded p-1 text-center"
            />
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSpin(true);
              handleReset();
              setTimeout(() => setSpin(false), 600);
            }}
            className={`btn-reset flex items-center gap-2 bg-gray-200 px-4 py-2 rounded ${spin ? "spin" : ""}`}
          >
            <FaRedo /> Đặt lại
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-save flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            <FaSave /> {isSaving ? "Đang lưu..." : "Lưu Layout"}
          </button>
        </div>
      </div>

      {/* GRID WRAPPER */}
      <div ref={wrapperRef} className="relative mx-auto">
        {/* Base grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {cells.map((c, i) => {
            const radius = {
              borderTopLeftRadius: c.x === 0 && c.y === 0 ? "12px" : 0,
              borderTopRightRadius: c.x === cols - 1 && c.y === 0 ? "12px" : 0,
              borderBottomLeftRadius:
                c.x === 0 && c.y === rows - 1 ? "12px" : 0,
              borderBottomRightRadius:
                c.x === cols - 1 && c.y === rows - 1 ? "12px" : 0,
            };
            return (
              <div
                key={i}
                className="cube"
                style={radius}
                onClick={() => handleAdd(c.x, c.y)}
              >
                +
              </div>
            );
          })}
        </div>

        {/* Overlay Blocks */}
        {width > 0 && (
          <div className="absolute inset-0">
            <GridLayout
              className="layout"
              layout={layout}
              cols={cols}
              width={width}
              rowHeight={80}
              compactType={null}
              isResizable
              isDraggable
              draggableCancel=".remove-btn"
              margin={[0, 0]}
              onLayoutChange={setLayout}
            >
              {layout.map((item) => (
                <div key={item.i} className="grid-item">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.i)}
                  >
                    <FaTimes />
                  </button>
                  {item.i.slice(-3)}
                </div>
              ))}
            </GridLayout>
          </div>
        )}
      </div>

      {/* CODE PREVIEW */}
      <div className="mt-10 flex flex-wrap gap-6">
        {/* HTML */}
        <div className="code-box flex-1 min-w-[300px] bg-orange-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2 font-bold">
            <span>HTML</span>
            <button
              onClick={() => copy(generateHTML())}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Copy
            </button>
          </div>
          <pre>{generateHTML()}</pre>
        </div>

        {/* CSS */}
        <div className="code-box flex-1 min-w-[300px] bg-orange-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2 font-bold">
            <span>CSS</span>
            <button
              onClick={() => copy(generateCSS())}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Copy
            </button>
          </div>
          <pre>{generateCSS()}</pre>
        </div>
      </div>
    </div>
  );
}
