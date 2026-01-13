"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { FaCheckCircle, FaSearch } from "react-icons/fa";

const ICON_OPTIONS = [
    "fas fa-folder", "fas fa-folder-open", "fas fa-file", "fas fa-file-alt",
    "fas fa-file-pdf", "fas fa-file-image", "fas fa-file-video",
    "fas fa-image", "fas fa-images", "fas fa-photo-video", "fas fa-camera",
    "fas fa-video", "fas fa-film", "fas fa-newspaper", "fas fa-bullhorn",
    "fas fa-bell", "fas fa-calendar", "fas fa-calendar-alt", "fas fa-clock",
    "fas fa-user", "fas fa-user-friends", "fas fa-users",
    "fas fa-star", "fas fa-bookmark", "fas fa-tags",
];

export default function CategoryFormModal({ isOpen, onClose, initialData, layouts, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        gridLayoutId: "",
        icon: "",
    });

    // Reset form
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData ? { ...initialData, gridLayoutId: initialData.layoutId || "" } : {
                title: "", description: "", gridLayoutId: "", icon: ""
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <Modal
            title={initialData ? "Cập nhật danh mục" : "Tạo danh mục mới"}
            onClose={onClose}
            width="900px"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-7 space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                Tên danh mục <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Nhập tên danh mục..."
                                className="w-full h-11 px-4 border border-gray-200 rounded-lg text-sm font-medium transition-all bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                Mô tả ngắn
                            </label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả nội dung của danh mục..."
                                className="w-full p-4 rounded-lg text-sm "
                            />
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-5">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                            Biểu tượng
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 h-[170px]">
                            <div className="grid grid-cols-5 gap-2 h-full overflow-y-auto pr-1 custom-scrollbar content-start">
                                {ICON_OPTIONS.map((ic) => (
                                    <button
                                        key={ic}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: ic })}
                                        className={`h-9 rounded flex items-center justify-center text-sm transition-all ${formData.icon === ic
                                            ? "bg-black text-white shadow-md"
                                            : "bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                            }`}
                                    >
                                        <i className={ic}></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col h-full">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                        Chọn bố cục hiển thị <span className="text-gray-400 font-normal normal-case ml-1">(Cuộn để xem thêm)</span>
                    </label>

                    {/* WRAPPER ĐỂ TẠO THANH CUỘN */}
                    <div className="flex-1 min-h-0 border border-gray-200 rounded-xl bg-gray-50/50 p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                            {layouts.map((l) => (
                                <div
                                    key={l._id}
                                    onClick={() => setFormData({ ...formData, gridLayoutId: l._id })}
                                    className={`relative group cursor-pointer border rounded-xl p-3 flex items-center gap-4 transition-all duration-200 hover:shadow-md ${formData.gridLayoutId === l._id
                                        ? "border-black ring-1 ring-black bg-white"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    {/* Mini Preview (Bên trái) */}
                                    <div
                                        className="w-16 h-12 flex-shrink-0 bg-white border border-gray-200 rounded grid gap-0.5 p-0.5 pointer-events-none"
                                        style={{
                                            gridTemplateColumns: `repeat(${l.config?.columns?.length || 5}, 1fr)`,
                                            gridTemplateRows: `repeat(${l.config?.rows || 5}, 1fr)`,
                                        }}
                                    >
                                        {l.config?.positions?.map((pos, idx) => (
                                            <div
                                                key={idx}
                                                className={`rounded-[1px] ${formData.gridLayoutId === l._id ? "bg-gray-800" : "bg-gray-300"}`}
                                                style={{
                                                    gridColumn: `${pos.x + 1} / span ${pos.w}`,
                                                    gridRow: `${pos.y + 1} / span ${pos.h}`,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Info (Bên phải) */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-gray-800 truncate">{l.title}</p>
                                            {formData.gridLayoutId === l._id && <FaCheckCircle className="text-black text-sm" />}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{l.description || "Chuẩn"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition text-sm shadow-lg shadow-gray-200 active:scale-95"
                    >
                        {initialData ? "Lưu thay đổi" : "Tạo mới"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}