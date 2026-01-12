"use client";

import { useState, useEffect, useRef } from "react"; // 1. Thêm useRef
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import FormInput from "@/components/ui/FormInput";
import { FaUser, FaEnvelope, FaIdBadge, FaPhone, FaPen } from "react-icons/fa";
import Toast from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/ToastContainer";

export default function ProfileTab() {
    const { user, mutate } = useAuth();
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        bio: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                bio: user.bio || "",
            });
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            setAvatarFile(file);
            console.log(previewUrl)
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let payload = { ...formData };
            if (avatarFile) {
                const base64Image = await convertToBase64(avatarFile);
                payload.avatar = base64Image;
            }

            const res = await authFetch(`${API_BASE_URL}/users/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                if (mutate) mutate();
                const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
                localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, ...payload }));

                addToast("success", "Cập nhật hồ sơ thành công!");
                setAvatarFile(null);
            } else {
                addToast("error", "Lỗi cập nhật hồ sơ.");
            }
        } catch (error) {
            console.error(error);
            addToast("error", "Lỗi kết nối server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={removeToast}
                    />
                ))}
            </ToastContainer>

            <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl animate-fadeIn">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Thông tin cá nhân</h2>

                <div className="flex items-center gap-6 mb-8">
                    <div className="relative group">
                        <img
                            src={avatarPreview || user?.avatar || "/avatar1.png"}
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 transition-transform group-hover:scale-105"
                            alt="Avatar"
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full text-xs hover:bg-gray-800 transition shadow-md border-2 border-white cursor-pointer"
                            title="Đổi ảnh đại diện"
                        >
                            <FaPen />
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div>
                        <h3 className="font-bold text-lg">{user?.username || "User"}</h3>
                        <p className="text-sm text-gray-500">{user?.role || "Member"}</p>
                        {avatarFile && <p className="text-xs text-blue-500 mt-1 italic">Đã chọn ảnh mới, hãy bấm Lưu!</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <FormInput
                        label="Tên hiển thị"
                        icon={FaUser}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />

                    <FormInput
                        label="Email"
                        icon={FaEnvelope}
                        value={formData.email}
                        disabled={true}
                        note="Liên hệ Admin nếu bạn muốn đổi Email."
                    />

                    <FormInput
                        label="Vai trò"
                        icon={FaIdBadge}
                        value={user?.role?.toUpperCase()}
                        disabled={true}
                    />

                    <FormInput
                        label="Số điện thoại"
                        icon={FaPhone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại..."
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-8 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium disabled:opacity-50"
                >
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </>
    );
}