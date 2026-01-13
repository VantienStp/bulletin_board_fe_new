"use client";
import { FaSave, FaUndo, FaCode } from 'react-icons/fa';
import NumberInput from "@/components/ui/NumberInput";

export default function EditorToolbar({
    cols, setCols,
    rows, setRows,
    gap, setGap,
    onViewCode,
    onReset,
    onSave,
    isSaving
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-100 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-6">
                <NumberInput label="Cols" value={cols} onChange={setCols} max={12} />
                <NumberInput label="Rows" value={rows} onChange={setRows} max={20} />
                <NumberInput label="Gap (px)" value={gap} onChange={setGap} max={50} />
            </div>

            <div className="flex items-center gap-2">
                <button onClick={onViewCode} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition">
                    <FaCode /> <span className="hidden sm:inline">Xem Code</span>
                </button>
                <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                    <FaUndo /> Reset
                </button>
                <button onClick={onSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm disabled:opacity-50">
                    <FaSave /> {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
            </div>
        </div>
    );
}