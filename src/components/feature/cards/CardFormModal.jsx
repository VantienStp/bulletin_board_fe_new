"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";

export default function CardFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        isWorkDaysOnly: false
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    startDate: initialData.startDate ? initialData.startDate.split('T')[0] : "",
                    endDate: initialData.endDate ? initialData.endDate.split('T')[0] : "",
                    isWorkDaysOnly: initialData.isWorkDaysOnly || false
                });
            } else {
                setFormData({
                    title: "",
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: "",
                    isWorkDaysOnly: false
                });
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
            title={initialData ? "Sửa thẻ nội dung" : "Thêm thẻ mới"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-1">
                {/* 1. TITLE INPUT */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm "
                        placeholder="Nhập tiêu đề thẻ..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        autoFocus
                    />
                </div>

                {/* 2. DATES GRID */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ngày kết thúc
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm "
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            Để trống nếu muốn hiển thị vô thời hạn.
                        </p>
                    </div>
                </div>

                {/* 3. OPTION TOGGLE - ULTRA SMOOTH SWITCH */}
                <div
                    className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group select-none"
                    onClick={() => setFormData(prev => ({ ...prev, isWorkDaysOnly: !prev.isWorkDaysOnly }))}
                >
                    <div className="flex-1 pr-4">
                        <label className="font-semibold text-gray-900 text-sm cursor-pointer block">
                            Chế độ ngày làm việc
                        </label>
                        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                            Chỉ hiển thị nội dung này vào các ngày hành chính (Thứ 2 - Thứ 6).
                        </p>
                    </div>

                    {/* Custom Switch UI - Optimized */}
                    <div className={`
                        relative w-12 h-7 rounded-full transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0
                        ${formData.isWorkDaysOnly ? 'bg-black' : 'bg-gray-200 group-hover:bg-gray-300'}
                    `}>
                        <span
                            className={`
                                absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm 
                                transform transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform
                                ${formData.isWorkDaysOnly ? 'translate-x-5' : 'translate-x-0'}
                            `}
                        />
                    </div>
                </div>

                {/* 4. FOOTER ACTIONS (Right aligned) */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm"
                    >
                        {initialData ? "Cập nhật" : "Tạo thẻ"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}