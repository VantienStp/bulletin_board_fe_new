"use client";

import { useState, useMemo } from "react";
import Modal from "@/components/common/Modal";
import { FaLayerGroup, FaPlus, FaTimes } from "react-icons/fa"; // Thêm icon

export default function AddCardModal({ isOpen, onClose, allCards, existingCards, onAdd }) {
    const [selectedCardId, setSelectedCardId] = useState("");

    // Lọc ra những thẻ CHƯA có
    const availableCards = useMemo(() => {
        return allCards.filter(c => !existingCards.some(existing => existing.id === c.id));
    }, [allCards, existingCards]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCardId) return;
        onAdd(selectedCardId);
        setSelectedCardId("");
    };

    if (!isOpen) return null;

    return (
        <Modal
            title="Thêm thẻ vào danh mục"
            onClose={onClose}
            width="500px"
        >
            <form onSubmit={handleSubmit} className="mt-2">

                <div className="mb-4">
                    <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-xs uppercase tracking-wider">
                        Chọn thẻ nội dung
                    </label>

                    <div className="relative group">
                        <select
                            className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3 text-sm outline-none transition-all 
                                       focus:border-black focus:bg-white focus:shadow-md appearance-none cursor-pointer text-gray-700"
                            value={selectedCardId}
                            onChange={(e) => setSelectedCardId(e.target.value)}
                        >
                            <option value="" disabled className="text-gray-400">-- Vui lòng chọn thẻ --</option>

                            {availableCards.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.title} ({c.contentCount} nội dung)
                                </option>
                            ))}

                            {availableCards.length === 0 && (
                                <option disabled>Đã thêm hết tất cả thẻ</option>
                            )}
                        </select>

                        {/* Custom Arrow Icon cho Select */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <i className="fa-solid fa-chevron-down text-xs"></i>
                        </div>

                        {/* Hiệu ứng viền khi focus */}
                        <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-focus-within:border-blue-500/20"></div>
                    </div>

                    <p className="mt-2 text-[10px] text-gray-400 italic">
                        * Chỉ hiển thị những thẻ chưa được thêm vào danh mục này.
                    </p>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 transition-all flex items-center gap-2"
                        onClick={onClose}
                    >
                        <FaTimes /> Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        disabled={!selectedCardId}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2
                            ${!selectedCardId
                                ? "bg-gray-300 cursor-not-allowed shadow-none"
                                : "bg-black hover:bg-gray-800 hover:shadow-xl active:scale-95"
                            }`}
                    >
                        <FaPlus /> Thêm ngay
                    </button>
                </div>
            </form>
        </Modal>
    );
}