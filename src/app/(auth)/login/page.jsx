"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("123456");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        setLoading(true);

        try {
            console.log("🚀 Bắt đầu gửi yêu cầu đăng nhập...");

            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("❌ Đăng nhập thất bại (Server Response):", {
                    status: res.status,
                    statusText: res.statusText,
                    errorData: data
                });

                setError(data.message || "Đăng nhập thất bại");
                return;
            }

            console.log("✅ Đăng nhập thành công:", data);
            if (data.user) {
                localStorage.setItem("currentUser", JSON.stringify(data.user));
            }
            if (rememberMe) localStorage.setItem("rememberedEmail", email);
            else localStorage.removeItem("rememberedEmail");


            await refreshUser();
            router.push("/admin");

        } catch (err) {
            console.error("❌ Lỗi kết nối (Network/Code Error):", err);
            setError("Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc API.");
        } finally {
            if (window.location.pathname === "/login") {
                setLoading(false);
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <img src={'/law_bg.png'} alt="background shape" className="background-shape" />
            <div className="auth-card">
                <h1>Welcome to <span>TANDKV1</span></h1>
                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type="email" placeholder="Nhập email của bạn" value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                    />

                    <label>Password</label>
                    <input type="password" placeholder="Nhập mật khẩu" value={password}
                        onChange={(e) => setPassword(e.target.value)} required
                    />
                    <div className="remember-forgot">
                        <label className="remember">
                            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                            <span className="circle"></span>
                            Ghi nhớ đăng nhập
                        </label>
                        <a onClick={() => window.location.href = "/forgot-password"} className="forgot a-button cursor-pointer">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                    </button>
                </form>
            </div>
        </div>
    );
}