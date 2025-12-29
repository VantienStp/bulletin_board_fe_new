"use client";

import { useState, useMemo } from "react";
import Modal from "@/components/common/Modal";
import { Select, MenuItem } from "@mui/material";

export default function AddCardModal({ isOpen, onClose, allCards, existingCards, onAdd }) {
    const [selectedCardId, setSelectedCardId] = useState("");

    // Lọc ra những thẻ CHƯA có trong danh mục này để tránh thêm trùng
    const availableCards = useMemo(() => {
        return allCards.filter(c => !existingCards.some(existing => existing.id === c.id));
    }, [allCards, existingCards]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCardId) return alert("Vui lòng chọn thẻ");
        onAdd(selectedCardId);
        setSelectedCardId(""); // Reset sau khi add
    };

    if (!isOpen) return null;

    return (
        <Modal
            title="Thêm thẻ vào danh mục"
            onClose={onClose}
            width="500px"
        >
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 font-medium text-sm">Chọn thẻ từ thư viện</label>

                <Select
                    variant="standard"
                    disableUnderline
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    fullWidth
                    className="mb-6"
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        -- Chọn thẻ --
                    </MenuItem>

                    {availableCards.map(c => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.title} ({c.contentCount} nội dung)
                        </MenuItem>
                    ))}

                    {availableCards.length === 0 && (
                        <MenuItem disabled>
                            <span className="text-gray-400 italic">Tất cả thẻ đã được thêm vào danh mục này</span>
                        </MenuItem>
                    )}
                </Select>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="submit"
                        disabled={!selectedCardId}
                        className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[16px] font-medium transition"
                    >
                        Lưu
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[16px] font-medium transition"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </Modal>
    );
}