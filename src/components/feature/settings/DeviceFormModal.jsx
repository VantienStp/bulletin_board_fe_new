"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal"; 
import { API_BASE_URL } from "@/lib/api";

export default function DeviceFormModal({ isOpen, onClose, device, onUpdate }) {
    // State form
    const [formData, setFormData] = useState({
        name: "",
        defaultCategoryId: "",
        autoSwitch: true,
        switchInterval: 30
    });

    // State danh mục để đổ vào dropdown
    const [categories, setCategories] = useState([]);

    // 1. Load danh mục khi mở Modal
    useEffect(() => {
        if (isOpen) {
            fetch(`${API_BASE_URL}/categories`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setCategories(data);
                })
                .catch(err => console.error(err));
        }
    }, [isOpen]);

    // 2. Fill dữ liệu cũ của Device vào Form
    useEffect(() => {
        if (device) {
            setFormData({
                name: device.name || "",
                // Lấy ID an toàn (vì có thể population hoặc không)
                defaultCategoryId: device.config?.defaultCategoryId?._id || device.config?.defaultCategoryId || "",
                autoSwitch: device.config?.autoSwitch ?? true, 
                switchInterval: device.config?.switchInterval || 30
            });
        }
    }, [device]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi hàm update ở cha
        onUpdate(device._id, formData);
    };

    if (!isOpen) return null;

    return (
        <Modal title="Cấu hình thiết bị Kiosk" onClose={onClose} width="500px">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Tên & ID */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên thiết bị</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">ID: {device?.deviceId}</p>
                </div>

                {/* Danh mục mặc định */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục khởi động</label>
                    <select
                        className="w-full border rounded-lg p-2.5 text-sm bg-white"
                        value={formData.defaultCategoryId}
                        onChange={(e) => setFormData({ ...formData, defaultCategoryId: e.target.value })}
                    >
                        <option value="">-- Mặc định hệ thống --</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.title}</option>
                        ))}
                    </select>
                </div>

                {/* --- KHU VỰC CẤU HÌNH AUTO SWITCH --- */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Chế độ trình chiếu</h4>
                    
                    {/* Toggle Bật/Tắt */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-medium text-gray-900">Tự động chuyển trang</span>
                            <p className="text-[11px] text-gray-500">Nếu tắt, máy sẽ bị KHÓA ở trang hiện tại.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={formData.autoSwitch}
                                onChange={(e) => setFormData({...formData, autoSwitch: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Input Thời gian (chỉ hiện khi Bật) */}
                    {formData.autoSwitch && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thời gian mỗi trang (Phút)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    className="w-20 border rounded-lg p-2 text-sm text-center"
                                    value={formData.switchInterval}
                                    onChange={(e) => setFormData({...formData, switchInterval: parseInt(e.target.value) || 1})}
                                />
                                <span className="text-sm text-gray-500">phút</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">Hủy</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">Lưu cấu hình</button>
                </div>
            </form>
        </Modal>
    );
}