"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/context/ToastContext"; // ✅ 1. Kết nối Toast toàn cục
import Link from "next/link";
export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    const { addToast } = useToast(); // ✅ 2. Lấy hàm addToast
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();

        // ✅ 3. Kiểm tra mật khẩu khớp qua Toast
        if (newPassword !== confirm) {
            addToast("error", "Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email: userEmail, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Đặt lại mật khẩu thất bại");

            // ✅ 4. Thông báo thành công chuyên nghiệp
            addToast("success", "Đặt lại mật khẩu thành công! Đang chuyển hướng...");

            setTimeout(() => router.push("/login"), 1500);
        } catch (err) {
            // ✅ 5. Thông báo lỗi API qua Toast
            addToast("error", err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const email = sessionStorage.getItem("userEmailForDisplay");
            if (!email) {
                // ✅ 6. Cảnh báo phiên làm việc không hợp lệ qua Toast
                addToast("info", "Phiên làm việc hết hạn. Vui lòng bắt đầu lại.");
                sessionStorage.removeItem("userEmailForDisplay");
                router.replace(`/forgot-password`);
                return;
            }
            setUserEmail(email);
        }
    }, [router, addToast]);

    return (
        <div className="auth-wrapper">
            <img
                src={'/law_bg.png'}
                alt="background shape"
                className="background-shape"
            />

            <div className="auth-card">
                <h1>Đặt lại mật khẩu</h1>
                <p>Cho tài khoản: <b>{userEmail}</b></p>

                {/* ✅ ĐÃ LOẠI BỎ MESSAGE-BOX CŨ ĐỂ DÙNG TOAST TOÀN CỤC */}

                <form onSubmit={handleReset}>
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading} // ✅ Khóa khi đang xử lý
                    />

                    <label>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        disabled={loading} // ✅ Khóa khi đang xử lý
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                    </button>
                </form>

                <div className="flex items-center justify-center gap-2 mt-6 text-sm">
                    <span className="text-gray-500">Quay lại</span>
                    <Link
                        href="/login"
                        className="text-[#2d7a5d] font-semibold hover:underline transition-all"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}