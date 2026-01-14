"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { API_BASE_URL } from "@/lib/api";
import { FaDesktop, FaLayerGroup, FaStopwatch, FaInfoCircle } from "react-icons/fa";
import NumberInput from "@/components/ui/NumberInput"; // 🔥 Import Component xịn

export default function DeviceFormModal({ isOpen, onClose, device, onUpdate }) {
    const [formData, setFormData] = useState({
        name: "",
        defaultCategoryId: "",
        autoSwitch: true,
        switchInterval: 2
    });

    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        if (device) {
            setFormData({
                name: device.name || "",
                defaultCategoryId: device.config?.defaultCategoryId?._id || device.config?.defaultCategoryId || "",
                autoSwitch: device.config?.autoSwitch ?? true,
                switchInterval: device.config?.switchInterval || 2
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
            <form onSubmit={handleSubmit} className="space-y-2">

                {/* --- PHẦN 1: THÔNG TIN CƠ BẢN --- */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Tên hiển thị
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaDesktop className="text-gray-400 group-focus-within:text-black transition-colors" />
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full !pl-10 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-900  transition-all bg-gray-50 focus:bg-white"
                                placeholder="Ví dụ: Kiosk Sảnh Chính..."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 ml-1">
                            <FaInfoCircle className="text-[10px] text-gray-400" />
                            <p className="text-[10px] text-gray-400 font-mono">ID Hệ thống: {device?.deviceId}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Nội dung mặc định
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLayerGroup className="text-gray-400 group-focus-within:text-black transition-colors" />
                            </div>
                            <select
                                className="w-full !pl-10 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white
                                outline-none appearance-none transition-all cursor-pointer hover:bg-gray-50"
                                value={formData.defaultCategoryId}
                                onChange={(e) => setFormData({ ...formData, defaultCategoryId: e.target.value })}
                            >
                                <option value="">-- Mặc định của hệ thống --</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* --- PHẦN 2: CẤU HÌNH AUTO SWITCH --- */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 transition-all hover:bg-gray-50 hover:border-gray-200">
                    <div
                        className="flex items-center justify-between cursor-pointer group"
                        onClick={() => setFormData(prev => ({ ...prev, autoSwitch: !prev.autoSwitch }))}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <FaStopwatch className={`text-sm ${formData.autoSwitch ? 'text-black' : 'text-gray-400'}`} />
                                <span className="font-semibold text-sm text-gray-900">Tự động chuyển trang</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Kiosk sẽ tự động lật qua lại giữa các nội dung.
                            </p>
                        </div>

                        <div className={`
                            relative w-11 h-6 rounded-full transition-colors duration-150 ease-in-out shrink-0
                            ${formData.autoSwitch ? 'bg-black' : 'bg-gray-200 group-hover:bg-gray-300'}
                        `}>
                            <span className={`
                                absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm 
                                transform transition-transform duration-150 ease-[cubic-bezier(0.4,0.0,0.2,1)]
                                ${formData.autoSwitch ? 'translate-x-5' : 'translate-x-0'}
                            `} />
                        </div>
                    </div>

                    <div className={`
                        grid transition-all duration-150 ease-in-out overflow-hidden
                        ${formData.autoSwitch ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-gray-200' : 'grid-rows-[0fr] opacity-0'}
                    `}>
                        <div className="min-h-0">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-600">Thời gian chờ (phút)</label>

                                <NumberInput
                                    value={formData.switchInterval}
                                    onChange={(val) => setFormData({ ...formData, switchInterval: val })}
                                    min={1}
                                    max={60}
                                    className="w-20"
                                />
                            </div>
                            <p className="text-[10px] text-right text-gray-400 mt-1 italic">
                                *Tối thiểu 1 phút để người xem kịp đọc nội dung.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER BUTTONS --- */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-black hover:border-gray-300 transition-all focus:outline-none"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 shadow-md hover:shadow-lg transition-all transform active:scale-95"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </Modal>
    );
}