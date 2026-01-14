"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { FaLayerGroup, FaSave, FaTimes } from "react-icons/fa";

export default function LayoutFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({ title: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsSubmitting(false);
            setFormData({ title: initialData ? initialData.title : "" });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting || !formData.title.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            title={initialData ? "Chỉnh sửa bố cục" : "Tạo bố cục mới"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="mt-2">
                <div className="mb-8">
                    <label className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-xs uppercase tracking-wider">
                        Tên bố cục
                    </label>

                    <div className="relative group">
                        <input
                            className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3 text-sm outline-none transition-all 
                                       focus:border-black focus:bg-white focus:shadow-md placeholder:text-gray-400"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Nhập tên bố cục (VD: Bố cục Sảnh Chính...)"
                            disabled={isSubmitting}
                        />
                        <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-focus-within:border-blue-500/20"></div>
                    </div>
                    <p className="mt-2 text-[10px] text-gray-400 italic">
                        * Tên bố cục nên ngắn gọn, dễ nhớ để quản lý.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 transition-all flex items-center gap-2"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <FaTimes /> Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2
                            ${isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-800 hover:shadow-xl active:scale-95"
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i> Đang lưu...
                            </>
                        ) : (
                            <>
                                <FaSave /> {initialData ? "Cập nhật" : "Lưu lại"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}