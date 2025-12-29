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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                    <input
                        className="w-full border rounded-lg p-2 text-sm"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-green-600">Ngày bắt đầu</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2 text-sm"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-red-600">Ngày kết thúc</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-2 text-sm"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                        <small className="text-gray-400 text-[10px]">* Để trống nếu muốn hiện vĩnh viễn</small>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                    <input
                        type="checkbox"
                        id="isWorkDaysOnly"
                        className="w-4 h-4"
                        checked={formData.isWorkDaysOnly}
                        onChange={(e) => setFormData({ ...formData, isWorkDaysOnly: e.target.checked })}
                    />
                    <label htmlFor="isWorkDaysOnly" className="text-sm font-medium text-blue-700 cursor-pointer">
                        Chỉ hiển thị ngày hành chính (Thứ 2 - Thứ 6)
                    </label>
                </div>

                <div className="modal-actions pt-4">
                    <button type="submit" className="btn-primary w-full py-2 rounded-lg font-bold">
                        Lưu thay đổi
                    </button>
                    <button type="button" className="btn-cancel w-full py-2 mt-2" onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </form>
        </Modal>
    );
}