"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể gửi email");

      setMessage("✅ Mã xác minh đã được gửi đến email của bạn!");
      setTimeout(() => {
        router.push(`/verify-pin?email=${email}`);
      }, 1500);
    } catch (err) {
      setMessage("❌ " + err.message);
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
        <h1>Khôi phục mật khẩu</h1>
        <p>Nhập địa chỉ email của bạn để nhận mã xác minh</p>

        {message && <div className="message-box">{message}</div>}

        <form onSubmit={handleSendEmail}>
          <label>Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi mã xác minh"}
          </button>
        </form>

        <p className="redirect-text">
          Nhớ mật khẩu rồi?{" "}
          <a onClick={() => router.push(`/login`)}>Quay lại đăng nhập</a>
        </p>
      </div>
    </div>
  );
}
