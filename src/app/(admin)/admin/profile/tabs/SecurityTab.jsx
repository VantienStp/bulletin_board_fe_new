"use client";
import { useState } from "react";
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import FormInput from "@/components/ui/FormInput";
import { FaLock, FaKey } from "react-icons/fa";

export default function SecurityTab() {
    const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (passData.newPassword !== passData.confirmPassword) {
            alert("❌ Mật khẩu xác nhận không khớp!");
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
                alert("✅ Đổi mật khẩu thành công!");
                setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                alert(`❌ ${data.message || "Lỗi đổi mật khẩu"}`);
            }
        } catch (err) {
            alert("❌ Lỗi kết nối");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Bảo mật & Mật khẩu</h2>

            <FormInput
                label="Mật khẩu hiện tại" type="password" icon={FaKey}
                value={passData.currentPassword}
                onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
            />

            <hr className="my-6 border-gray-100" />

            <FormInput
                label="Mật khẩu mới" type="password" icon={FaLock}
                value={passData.newPassword}
                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
            />

            <FormInput
                label="Xác nhận mật khẩu mới" type="password" icon={FaLock}
                value={passData.confirmPassword}
                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
            />

            <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium disabled:opacity-50"
            >
                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </button>
        </div>
    );
}