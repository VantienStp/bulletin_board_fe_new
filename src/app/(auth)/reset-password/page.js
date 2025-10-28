"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm)
      return setMessage("❌ Mật khẩu nhập lại không khớp");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đặt lại mật khẩu thất bại");

      setMessage("✅ Đặt lại mật khẩu thành công!");
      setTimeout(() => router.push("/login"), 1500);
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
        <h1>Đặt lại mật khẩu</h1>
        <p>Cho tài khoản: <b>{email}</b></p>

        {message && <div className="message-box">{message}</div>}

        <form onSubmit={handleReset}>
          <label>Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Nhập lại mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          </button>
        </form>

        <p className="redirect-text">
          Quay lại <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}
