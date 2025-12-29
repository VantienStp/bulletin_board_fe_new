"use client";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import { useLayoutEditor } from "@/hooks/useLayoutEditor"; // Hook logic

// Components con
import EditorToolbar from "./detail/EditorToolbar";
import GridWorkspace from "./detail/GridWorkspace";

export default function LayoutEditor({ layoutId, initialConfig }) {
  const [showCode, setShowCode] = useState(false);

  // Gọi Hook để lấy toàn bộ state và handlers
  const {
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
  } = useLayoutEditor(layoutId, initialConfig);

  return (
    <div className="flex flex-col gap-6">

      {/* 1. THANH CÔNG CỤ */}
      <EditorToolbar
        cols={cols} setCols={setCols}
        rows={rows} setRows={setRows}
        gap={gap} setGap={setGap}
        onViewCode={() => setShowCode(true)}
        onReset={handleReset}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* 2. KHU VỰC GRID */}
      <GridWorkspace
        cols={cols} rows={rows}
        gap={gap} rowHeight={rowHeight}
        layout={layout}
        onLayoutChange={handleLayoutChange}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      {/* 3. MODAL XEM CODE */}
      {showCode && (
        <Modal title="Generated CSS Code" onClose={() => setShowCode(false)}>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm relative group">
            <pre>{generatedCSS}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCSS);
                alert("Copied!");
              }}
              className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded text-white opacity-0 group-hover:opacity-100 transition"
            >
              Copy
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}