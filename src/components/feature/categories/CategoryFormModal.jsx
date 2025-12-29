"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { Select, MenuItem } from "@mui/material";

export default function CategoryFormModal({ isOpen, onClose, initialData, layouts, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        gridLayoutId: "",
        icon: "",
    });

    const iconOptions = [
        "fas fa-folder", "fas fa-folder-open", "fas fa-file", "fas fa-file-alt",
        "fas fa-file-pdf", "fas fa-file-image", "fas fa-file-video",
        "fas fa-image", "fas fa-images", "fas fa-photo-video", "fas fa-camera",
        "fas fa-video", "fas fa-film", "fas fa-newspaper", "fas fa-bullhorn",
        "fas fa-bell", "fas fa-calendar", "fas fa-calendar-alt", "fas fa-clock",
        "fas fa-user", "fas fa-user-friends", "fas fa-users",
        "fas fa-star", "fas fa-bookmark", "fas fa-tags",
    ];

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    description: initialData.description,
                    gridLayoutId: initialData.layoutId,
                    icon: initialData.icon,
                });
            } else {
                setFormData({
                    title: "",
                    description: "",
                    gridLayoutId: "",
                    icon: "",
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
            title={initialData ? "Sửa danh mục" : "Thêm danh mục mới"}
            onClose={onClose}
            width="500px"
        >
            <form onSubmit={handleSubmit}>
                <label>Tên danh mục</label>
                <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full border rounded-lg p-2 text-sm mb-3"
                />

                <label>Icon</label>
                <Select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    fullWidth
                    className="mb-3"
                    size="small"
                >
                    <MenuItem value="">— Chọn icon —</MenuItem>
                    {iconOptions.map((ic) => (
                        <MenuItem key={ic} value={ic}>
                            <i className={`${ic} mr-2`} /> {ic}
                        </MenuItem>
                    ))}
                </Select>

                <label>Mô tả</label>
                <textarea
                    rows="3"
                    className="w-full border rounded-lg p-2 text-sm mb-3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <label>Grid Layout</label>
                <Select
                    value={formData.gridLayoutId}
                    onChange={(e) => setFormData({ ...formData, gridLayoutId: e.target.value })}
                    fullWidth
                    size="small"
                >
                    <MenuItem value="">— Chọn layout —</MenuItem>
                    {layouts.map((l) => (
                        <MenuItem key={l._id} value={l._id}>
                            {l.title}
                        </MenuItem>
                    ))}
                </Select>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[16px] font-medium transition"
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