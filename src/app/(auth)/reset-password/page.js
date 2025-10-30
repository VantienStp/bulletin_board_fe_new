"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

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
            headers: { 
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify({ email: userEmail, newPassword }),
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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const email = sessionStorage.getItem("userEmailForDisplay"); 
            if (!email) {
                setMessage("⚠️ Phiên đặt lại mật khẩu không hợp lệ. Vui lòng bắt đầu lại từ bước 'Quên mật khẩu'.");
                sessionStorage.removeItem("userEmailForDisplay"); 
                setTimeout(() => router.replace(`/forgot-password`), 3000); 
                return;
            }
            setUserEmail(email); 
        }
    }, [router]);

  return (
    <div className="auth-wrapper">
      <img
        src={`${BASE_URL}/uploads/blob-scene.svg`}
        alt="background shape"
        className="background-shape"
      />

      <div className="auth-card">
        <h1>Đặt lại mật khẩu</h1>
        <p>Cho tài khoản: <b>{userEmail}</b></p>

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
