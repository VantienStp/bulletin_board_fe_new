"use client";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // 👈 Có thể bỏ cái này nếu dùng window.location
import { API_BASE_URL } from "@/lib/api";

export default function LoginPage() {
    // ... (các state giữ nguyên)
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("123456");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // const router = useRouter(); 👈 Không cần dùng router nữa

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
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Đăng nhập thất bại");
                return; // 👈 Nhớ return ở đây để không chạy tiếp logic bên dưới
            }

            // Lưu thông tin user
            if (data.user) {
                localStorage.setItem("currentUser", JSON.stringify(data.user));
            }

            // Xử lý Ghi nhớ email
            if (rememberMe) localStorage.setItem("rememberedEmail", email);
            else localStorage.removeItem("rememberedEmail");

            // 🔥 SỬA TẠI ĐÂY: Dùng window.location.href để vào Admin
            // Giúp refresh lại toàn bộ Context và đảm bảo không bị đá ngược về Login
            window.location.href = "/admin";

        } catch (err) {
            console.error("❌ Fetch error:", err);
            setError("Không thể kết nối tới server.");
        } finally {
            // Không cần setLoading(false) nếu đã redirect bằng window.location
            // Nhưng để an toàn cứ giữ lại cũng được
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
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="remember-forgot">
                        <label className="remember">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="circle"></span>
                            Ghi nhớ đăng nhập
                        </label>
                        <a onClick={() => router.push("/forgot-password")} className="forgot a-button cursor-pointer">
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