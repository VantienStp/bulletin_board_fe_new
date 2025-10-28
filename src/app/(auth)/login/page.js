"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🧠 Khi mở trang, tự load email nếu có
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

    // 🚨 Kiểm tra đầu vào — chặn lỗi từ FE
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    setLoading(true);

    try {
      // 🔒 Hash tạm mật khẩu trước khi gửi (tăng an toàn)
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: hashedPassword, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      // ✅ Ghi nhớ email nếu người dùng chọn
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // 🧱 Lưu token tạm thời
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("tokenExpiresAt", data.expiresAt);

      // 🕒 Tự xóa token khi hết hạn
      const remaining = data.expiresAt - Date.now();
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        console.log("Token expired → auto removed");
      }, remaining);

      // 🔁 Điều hướng sang dashboard
      window.location.href = "/admin/dashboard";

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <img
        src={`${BASE_URL}/uploads/blob-scene.svg`}
        alt="background shape"
        className="background-shape"
      />

      <div className="auth-card">
        <h1>
          Welcome to <span>Belissa</span>
        </h1>

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
            <span className="remember">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Ghi nhớ đăng nhập
            </span>
            <a onClick={() => router.push("/forgot-password")}
              className="forgot"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <p className="redirect-text">
          Chưa có tài khoản?{" "}
          <a onClick={() => router.push(`/signup`)}>Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}
