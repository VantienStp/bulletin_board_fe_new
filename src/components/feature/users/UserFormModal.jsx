"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import FormInput from "@/components/ui/FormInput";

export default function UserFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "editor",
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    username: initialData.username,
                    email: initialData.email,
                    password: "",
                    role: initialData.role,
                });
            } else {
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    role: "editor",
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
            title={initialData ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="p-1">
                <FormInput
                    label="Tên hiển thị"
                    icon={FaUser}
                    placeholder="Ví dụ: Nguyen Van A"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />

                <FormInput
                    label="Địa chỉ Email"
                    icon={FaEnvelope}
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Mật khẩu {initialData ? "" : <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaLock className="text-lg" />
                            </div>
                            <input
                                type="password"
                                className="w-full !pl-10 !py-3 border border-gray-300 rounded-lg text-sm
                                focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none bg-white cursor-pointer"
                                placeholder={initialData ? "••••••••" : "Nhập mật khẩu..."}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required={!initialData}
                            />
                        </div>
                        {initialData && <p className="text-xs text-gray-400 mt-1">Để trống nếu giữ nguyên.</p>}
                    </div>

                    {/* Role Select */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Phân quyền <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaUserShield className="text-lg" />
                            </div>
                            <select
                                // 👇 Dùng !pl-12 ở đây nữa
                                className="w-full !pl-10 !py-3 border border-gray-300 rounded-lg text-sm 
                                    focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none bg-white cursor-pointer"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="admin">Admin (Quản trị viên)</option>
                                <option value="editor">Editor (Biên tập viên)</option>
                                <option value="user">User (Người dùng)</option>
                                <option value="viewer">Viewer (Chỉ xem)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
                    >
                        {initialData ? "Lưu thay đổi" : "Tạo tài khoản"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}