"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { Select, MenuItem } from "@mui/material";
import { FaFolderOpen } from "react-icons/fa";

export default function ContentFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        type: "image",
        url: "",
        description: "",
        qrCode: "",
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    type: initialData.type || "image",
                    url: initialData.url || "",
                    description: initialData.description || "",
                    qrCode: initialData.qrCode || "",
                });
            } else {
                setFormData({
                    type: "image",
                    url: "",
                    description: "",
                    qrCode: "",
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getFileInputAccept = () => {
        switch (formData.type) {
            case "video": return "video/*";
            case "pdf": return "application/pdf";
            default: return "image/*";
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            title={initialData ? "Sửa nội dung" : "Thêm nội dung"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <label className="block mb-1 font-medium text-sm">Loại nội dung</label>
                <Select
                    variant="standard"
                    disableUnderline
                    fullWidth
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mb-4"
                >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                </Select>

                <label className="block mb-1 font-medium text-sm">File / URL</label>
                <div className="flex gap-2 items-center mb-4">
                    <input
                        className="flex-1 border rounded-lg p-2 text-sm"
                        value={formData.url instanceof File ? formData.url.name : formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="Nhập URL hoặc chọn file..."
                    />

                    <button
                        type="button"
                        className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        <FaFolderOpen />
                    </button>

                    <input
                        id="fileInput"
                        type="file"
                        hidden
                        accept={getFileInputAccept()}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setFormData({ ...formData, url: file });
                        }}
                    />
                </div>

                <label className="block mb-1 font-medium text-sm">Mô tả</label>
                <textarea
                    rows="3"
                    className="w-full border rounded-lg p-2 text-sm mb-6"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả cho nội dung này..."
                />

                <div className="modal-actions flex justify-end gap-2">
                    <button type="submit" className="btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {initialData ? "Cập nhật" : "Lưu"}
                    </button>
                    <button
                        type="button"
                        className="btn-cancel px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </Modal>
    );
}