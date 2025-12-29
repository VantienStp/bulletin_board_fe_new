"use client";
import { FaSave, FaUndo, FaCode } from 'react-icons/fa';

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
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-6">
                <NumberInput label="Cols" value={cols} onChange={setCols} />
                <NumberInput label="Rows" value={rows} onChange={setRows} />
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

function NumberInput({ label, value, onChange, min = 1, max = 12 }) {
    return (
        <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
            <input
                type="number" min={min} max={max}
                value={value} onChange={(e) => onChange(Number(e.target.value))}
                className="w-16 p-1.5 border rounded text-center font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
    );
}