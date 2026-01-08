"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal"; // Đảm bảo đường dẫn đúng file Modal của bạn
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export default function DeviceFormModal({ isOpen, onClose, device, onUpdate }) {
    const [formData, setFormData] = useState({
        name: "",
        defaultCategoryId: ""
    });
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(false);

    // Load danh mục để chọn trong Dropdown
    useEffect(() => {
        if (isOpen) {
            const fetchCats = async () => {
                setLoadingCats(true);
                try {
                    // Gọi API lấy danh mục dạng list
                    const res = await fetch(`${API_BASE_URL}/categories`);
                    const data = await res.json();
                    if (Array.isArray(data)) setCategories(data);
                } catch (e) {
                    console.error("Lỗi tải danh mục", e);
                } finally {
                    setLoadingCats(false);
                }
            };
            fetchCats();
        }
    }, [isOpen]);

    // Fill dữ liệu cũ vào Form
    useEffect(() => {
        if (device) {
            setFormData({
                name: device.name || "",
                defaultCategoryId: device.config?.defaultCategoryId?._id || "" // Lấy ID từ object populate
            });
        }
    }, [device]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(device._id, formData);
    };

    if (!isOpen) return null;

    return (
        <Modal title="Cấu hình thiết bị" onClose={onClose} width="500px">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên thiết bị */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên thiết bị (Gợi nhớ)</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví dụ: Kiosk Sảnh Chính..."
                    />
                </div>

                {/* Chọn danh mục mặc định */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục mặc định</label>
                    <select
                        className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={formData.defaultCategoryId}
                        onChange={(e) => setFormData({ ...formData, defaultCategoryId: e.target.value })}
                    >
                        <option value="">-- Mặc định hệ thống --</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.title}</option>
                        ))}
                    </select>
                    <p className="text-[11px] text-gray-400 mt-1">
                        * Nếu chọn, thiết bị này sẽ luôn hiển thị danh mục này khi khởi động hoặc reset.
                    </p>
                </div>

                {/* ID (Read only) */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold">Device ID</p>
                    <p className="font-mono text-sm text-gray-800">{device?.deviceId}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
                        Hủy
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                        Lưu cấu hình
                    </button>
                </div>
            </form>
        </Modal>
    );
}