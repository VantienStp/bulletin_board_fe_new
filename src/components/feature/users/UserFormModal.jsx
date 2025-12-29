"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { Select, MenuItem } from "@mui/material";

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
                    password: "", // Không hiển thị password cũ
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
            title={initialData ? "Sửa người dùng" : "Thêm người dùng mới"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <label className="block mb-1 font-medium text-sm">Tên tài khoản</label>
                <input
                    className="w-full border rounded-lg p-2 text-sm mb-3"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />

                <label className="block mb-1 font-medium text-sm">Email</label>
                <input
                    className="w-full border rounded-lg p-2 text-sm mb-3"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <label className="block mb-1 font-medium text-sm">
                    Mật khẩu <span className="text-gray-400 font-normal text-xs">{initialData && "(để trống nếu không đổi)"}</span>
                </label>
                <input
                    className="w-full border rounded-lg p-2 text-sm mb-3"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    // Chỉ require khi tạo mới
                    required={!initialData}
                />

                <label className="block mb-1 font-medium text-sm">Quyền hạn</label>
                <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    fullWidth
                    size="small"
                    className="mb-6"
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="editor">Editor</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                </Select>

                <div className="modal-actions flex justify-end gap-2">
                    <button type="submit" className="btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {initialData ? "Cập nhật" : "Thêm mới"}
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