"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const router = useRouter();

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Không thể gửi email");
            }

            addToast("success", "Mã xác minh đã được gửi đến email của bạn!");

            setTimeout(() => {
                router.push(`/verify-pin?email=${email}`);
            }, 1000);
        } catch (err) {
            addToast("error", err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <img
                src={'/law_bg.png'}
                alt="background shape"
                className="background-shape"
            />

            <div className="auth-card">
                <h1>Khôi phục mật khẩu</h1>
                <p className="a-text">Nhập địa chỉ email của bạn để nhận mã xác minh</p>

                <form onSubmit={handleSendEmail}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button type="submit" disabled={loading} className="font-bold transition-colors ml-1 py-2.5">
                        {loading ? "Đang gửi..." : "Gửi mã xác minh"}
                    </button>
                </form>

                <p className="redirect-text">
                    Nhớ mật khẩu rồi?{" "}
                    <a
                        className="highlight-text a-button"
                        onClick={() => !loading && router.push(`/login`)}
                    >
                        Quay lại đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}