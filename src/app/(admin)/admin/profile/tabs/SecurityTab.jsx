"use client";

import { useState } from "react";
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import FormInput from "@/components/ui/FormInput";
import { FaLock, FaKey, FaSpinner } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

export default function SecurityTab() {
    const { addToast } = useToast();
    const [passData, setPassData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (passData.newPassword !== passData.confirmPassword) {
            addToast("error", "Mật khẩu xác nhận không khớp!");
            return;
        }

        if (passData.newPassword.length < 6) {
            addToast("error", "Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);
        try {
            const res = await authFetch(`${API_BASE_URL}/users/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passData.currentPassword,
                    newPassword: passData.newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                addToast("success", "Đổi mật khẩu thành công!");
                setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                addToast("error", data.message || "Đổi mật khẩu thất bại!");
            }
        } catch (err) {
            console.error("Lỗi đổi mật khẩu:", err);
            addToast("error", "Lỗi kết nối đến máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <FaLock className="text-gray-500" /> Bảo mật & Mật khẩu
            </h2>

            <div className="space-y-4">
                <FormInput
                    label="Mật khẩu hiện tại"
                    type="password"
                    icon={FaKey}
                    placeholder="Nhập mật khẩu đang sử dụng..."
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                />

                <hr className="my-6 border-gray-100" />

                <FormInput
                    label="Mật khẩu mới"
                    type="password"
                    icon={FaLock}
                    placeholder="Nhập mật khẩu mới..."
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                />

                <FormInput
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    icon={FaLock}
                    placeholder="Nhập lại mật khẩu mới..."
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                />
            </div>

            <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="mt-8 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin" /> Đang xử lý...
                    </>
                ) : (
                    "Đổi mật khẩu"
                )}
            </button>

            <p className="mt-4 text-xs text-gray-400 text-center">
                Lưu ý: Bạn sẽ không bị đăng xuất sau khi đổi mật khẩu thành công.
            </p>
        </div>
    );
}