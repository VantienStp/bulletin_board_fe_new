"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { FaImage, FaVideo, FaFilePdf, FaFolderOpen } from "react-icons/fa";

export default function ContentFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        type: "image",
        url: "",
        description: "",
        qrCode: "",
        externalLink: "",
    });

    useEffect(() => {
        if (isOpen) {
            setIsSubmitting(false);
            setFormData(initialData ? { ...initialData } : {
                type: "image",
                url: "",
                description: "",
                qrCode: "",
                externalLink: "",
            });
        }
    }, [isOpen, initialData]);

    // 🔥 LOGIC KIỂM TRA ĐIỀU KIỆN (VALIDATION)
    // Nút Lưu chỉ sáng lên khi (Có File) HOẶC (Có Link ngoài)
    const isValid = Boolean(formData.url || formData.externalLink);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || !isValid) return; // Chặn nếu chưa hợp lệ

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const types = [
        { id: "image", label: "Hình ảnh", icon: FaImage, color: "text-blue-500", bg: "bg-blue-50" },
        { id: "video", label: "Video", icon: FaVideo, color: "text-purple-500", bg: "bg-purple-50" },
        { id: "pdf", label: "Tài liệu PDF", icon: FaFilePdf, color: "text-red-500", bg: "bg-red-50" },
    ];

    return (
        <Modal
            title={initialData ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="">

                {/* A. LOẠI NỘI DUNG */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        Loại nội dung
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {types.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: t.id })}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.type === t.id
                                    ? `border-black shadow-md ${t.bg}`
                                    : "border-gray-100 hover:border-gray-200"
                                    }`}
                            >
                                <t.icon className={`text-2xl ${t.color}`} />
                                <span className="text-xs font-bold text-gray-600">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* B. FILE UPLOAD */}
                <div>
                    <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        Chọn file <span className="text-red-500 font-bold text-lg">*</span>
                    </label>
                    <div className="relative group">
                        <input
                            className="w-full border-2 border-gray-100 rounded-xl p-4 pr-14 text-sm transition-all bg-gray-50/50 focus:border-black focus:bg-white outline-none"
                            value={formData.url instanceof File ? formData.url.name : formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            placeholder="Dán link hoặc chọn file từ máy tính..."
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-gray-600 rounded-lg hover:bg-black hover:text-white transition shadow-sm border border-gray-100"
                            onClick={() => document.getElementById("fileInput").click()}
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

                {/* C. LINK NGOÀI */}
                <div className="space-y-2">
                    <label className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                        Link bài báo / Link ngoài (Nếu có)
                    </label>
                    <input
                        type="url"
                        className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm transition-all bg-gray-50/50 focus:border-black focus:bg-white outline-none"
                        value={formData.externalLink}
                        onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                        placeholder="https://tuoitre.vn/bai-bao-xyz..."
                    />
                    <p className="text-[10px] text-gray-400 italic">
                        * Nếu nhập link này, mã QR sẽ dẫn tới đây thay vì file upload.
                    </p>
                </div>

                {/* D. MÔ TẢ */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        Mô tả ngắn gọn
                    </label>
                    <textarea
                        rows="3"
                        className="w-full border-2 border-gray-100 rounded-xl text-sm transition-all bg-gray-50/50 resize-none p-3 focus:border-black focus:bg-white outline-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Nội dung này nói về điều gì..."
                    />
                </div>

                {/* E. ACTIONS */}
                <div className="flex justify-end gap-3 border-t border-gray-50 ">
                    <button
                        type="button"
                        className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition font-bold text-sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className={`px-8 py-2.5 rounded-xl transition font-bold text-sm shadow-lg flex items-center gap-2
                            ${isSubmitting || !isValid
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                : "bg-black text-white hover:bg-gray-800 active:scale-95"}`}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i> Đang lưu...
                            </>
                        ) : (
                            initialData ? "Cập nhật ngay" : "Lưu dữ liệu"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}