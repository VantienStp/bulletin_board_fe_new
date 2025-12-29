"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";

export default function LayoutFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({ title: "" });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ title: initialData.title });
            } else {
                setFormData({ title: "" });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <Modal
            title={initialData ? "Sửa bố cục" : "Thêm bố cục mới"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 font-medium">Tên bố cục</label>
                <input
                    className="w-full border rounded-lg p-2 text-sm mb-6"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Ví dụ: Bố cục tin tức chính..."
                />

                <div className="modal-actions flex justify-end gap-3">
                    <button type="submit" className="btn-primary px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="btn-cancel px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </Modal>
    );
}