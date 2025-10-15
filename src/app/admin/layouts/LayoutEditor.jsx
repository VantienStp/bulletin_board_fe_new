"use client";
import { useState, useEffect, useRef } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./LayoutEditor.css";
import { API_BASE_URL } from "@/lib/api";
import { FaTimes } from 'react-icons/fa';


export default function LayoutEditor({ layoutId, initialConfig }) {
  const [cols, setCols] = useState(5);
  const [rows, setRows] = useState(5);
  const [gap, setGap] = useState(8);
  const [layout, setLayout] = useState([]);
  const [width, setWidth] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const wrapperRef = useRef(null);

  // 🧠 Nhận config từ API
  useEffect(() => {
    if (initialConfig) {
      console.log("📦 Nhận config từ API:", initialConfig);
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

  useEffect(() => {
    const resize = () => {
      if (wrapperRef.current) setWidth(wrapperRef.current.offsetWidth);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [cols, gap]);

  const handleAdd = (x, y) => {
    const id = Date.now().toString();
    setLayout((prev) => [...prev, { i: id, x, y, w: 1, h: 1 }]);
  };

  const handleRemove = (id) => {
    setLayout((prev) => prev.filter((b) => b.i !== id));
  };

  const handleSave = async () => {
    if (!layoutId) {
      alert("⚠️ Không có ID layout để cập nhật!");
      return;
    }

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
      const res = await fetch(`${API_BASE_URL}/gridLayouts/${layoutId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: updatedConfig }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại!");
      alert("✅ Layout đã được cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi khi lưu layout!");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔁 Cập nhật layout khi kéo/thả
  const handleLayoutChange = (newLayout) => setLayout(newLayout);

  // 🔄 Reset toàn bộ
  const handleReset = () => {
    setLayout([]);
    setCols(initialConfig?.columns?.length || 5);
    setRows(initialConfig?.rows || 5);
  };

  // 📄 Tạo HTML & CSS preview
  const generateHTML = () => {
    let html = `<div class="parent">\n`;
    layout.forEach((item) => {
      html += `  <div class="div${item.i}">${item.i}</div>\n`;
    });
    html += `</div>`;
    return html;
  };

  const generateCSS = () => {
    let css = `.parent {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n}\n\n`;
    layout.forEach((item) => {
      css += `.div${item.i} {\n  grid-column: ${item.x + 1} / span ${item.w};\n  grid-row: ${item.y + 1} / span ${item.h};\n}\n\n`;
    });
    return css;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("✅ Copied to clipboard!");
  };

  // 📦 Tạo mảng cell nền
  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div className="layout-editor-page">
      <h1>CSS Grid Generator</h1>
      <p className="desc">Customize your layout — drag, resize, and copy HTML/CSS instantly.</p>

      <div className="input-row">
        <label>Columns</label>
        <input
          type="number"
          value={cols}
          min="1"
          max="10"
          onChange={(e) => setCols(Number(e.target.value))}
        />
        <label>Rows</label>
        <input
          type="number"
          value={rows}
          min="1"
          max="10"
          onChange={(e) => setRows(Number(e.target.value))}
        />
        <button onClick={handleReset}>↺ Reset</button>
        <button onClick={handleSave} disabled={isSaving}>
          💾 {isSaving ? "Đang lưu..." : "Lưu Layout"}
        </button>
      </div>

      <div className="grid-wrapper" ref={wrapperRef}>
        <div
          className="base-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {cells.map((cell, i) => {
            const isTopLeft = cell.x === 0 && cell.y === 0;
            const isTopRight = cell.x === cols - 1 && cell.y === 0;
            const isBottomLeft = cell.x === 0 && cell.y === rows - 1;
            const isBottomRight = cell.x === cols - 1 && cell.y === rows - 1;

            return (
              <div
                key={i}
                className="cube"
                onClick={() => handleAdd(cell.x, cell.y)}
                style={{
                  borderTopLeftRadius: isTopLeft ? "12px" : 0,
                  borderTopRightRadius: isTopRight ? "12px" : 0,
                  borderBottomLeftRadius: isBottomLeft ? "12px" : 0,
                  borderBottomRightRadius: isBottomRight ? "12px" : 0,
                }}
              >
                +
              </div>
            );
          })}
        </div>

        {width > 0 && (
          <div className="overlay-grid">
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
              onLayoutChange={handleLayoutChange}
            >
              {layout.map((item) => (
                <div key={item.i} className="grid-item">
                  <button className="remove-btn" onClick={() => handleRemove(item.i)}>
                    <FaTimes />
                  </button>
                  {item.i.slice(-3)}
                </div>
              ))}
            </GridLayout>
          </div>
        )}
      </div>

      {/* 💻 Code preview */}
      <div className="code-section">
        <div className="code-box">
          <div className="code-header">
            <span>HTML</span>
            <button onClick={() => copyToClipboard(generateHTML())}>Copy</button>
          </div>
          <pre>{generateHTML()}</pre>
        </div>

        <div className="code-box">
          <div className="code-header">
            <span>CSS</span>
            <button onClick={() => copyToClipboard(generateCSS())}>Copy</button>
          </div>
          <pre>{generateCSS()}</pre>
        </div>
      </div>
    </div>
  );
}
