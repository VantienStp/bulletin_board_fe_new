"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { FaImage, FaVideo, FaFilePdf, FaFolderOpen, FaCloudUploadAlt } from "react-icons/fa";

export default function ContentFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        type: "image",
        url: "",
        description: "",
        qrCode: "",
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData ? {
                type: initialData.type || "image",
                url: initialData.url || "",
                description: initialData.description || "",
                qrCode: initialData.qrCode || "",
            } : {
                type: "image",
                url: "",
                description: "",
                qrCode: "",
            });
        }
    }, [isOpen, initialData]);

    const types = [
        { id: "image", label: "Hình ảnh", icon: FaImage, color: "text-blue-500", bg: "bg-blue-50" },
        { id: "video", label: "Video", icon: FaVideo, color: "text-purple-500", bg: "bg-purple-50" },
        { id: "pdf", label: "Tài liệu PDF", icon: FaFilePdf, color: "text-red-500", bg: "bg-red-50" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <Modal
            title={initialData ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                    <label className="block mb-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        Loại nội dung
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {types.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: t.id })}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.type === t.id
                                    ? `border-black shadow-md ${t.bg}`
                                    : "border-gray-100 hover:border-gray-200"
                                    }`}
                            >
                                <t.icon className={`text-2xl mb-2 ${t.color}`} />
                                <span className="text-xs font-bold text-gray-600">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        Đường dẫn tới File
                    </label>
                    <div className="relative group">
                        <input
                            className="w-full border-2 border-gray-100 rounded-xl p-4 pr-14 text-sm focus:border-black outline-none transition-all bg-gray-50/50"
                            value={formData.url instanceof File ? formData.url.name : formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            placeholder="Dán link hoặc chọn file từ máy tính..."
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-gray-600 rounded-lg hover:bg-black hover:text-white transition shadow-sm border border-gray-100"
                            onClick={() => document.getElementById("fileInput").click()}
                            title="Chọn file từ máy tính"
                        >
                            <FaFolderOpen />
                        </button>
                    </div>
                    <input
                        id="fileInput"
                        type="file"
                        hidden
                        accept={formData.type === "video" ? "video/*" : formData.type === "pdf" ? "application/pdf" : "image/*"}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setFormData({ ...formData, url: file });
                        }}
                    />
                </div>

                {/* 3. MÔ TẢ */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        Mô tả ngắn gọn
                    </label>
                    <textarea
                        rows="3"
                        className="w-full border-2 border-gray-100 rounded-xl text-sm focus:border-black outline-none transition-all bg-gray-50/50 resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Nội dung này nói về điều gì..."
                    />
                </div>

                {/* 4. ACTIONS */}
                <div className="flex justify-end gap-3 border-t border-gray-50">
                    <button
                        type="button"
                        className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition font-bold text-sm"
                        onClick={onClose}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition font-bold text-sm shadow-lg shadow-gray-200 active:scale-95"
                    >
                        {initialData ? "Cập nhật ngay" : "Lưu dữ liệu"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}