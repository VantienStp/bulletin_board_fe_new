"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function VerifyPinPage() {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Mã PIN không hợp lệ");

      setMessage("✅ Mã PIN hợp lệ! Đang chuyển sang bước đặt lại mật khẩu...");
      setTimeout(() => {
        router.push(`/reset-password?email=${email}`);
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
        <h1>Xác minh mã PIN</h1>
        <p>Nhập mã 6 chữ số được gửi đến email: <b>{email}</b></p>

        {message && <div className="message-box">{message}</div>}

        <form onSubmit={handleVerify}>
    <label>Mã PIN</label>

    <div className="pin-inputs">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          inputMode="numeric"
          className="pin-box"
          value={pin[i] || ""}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, ""); // chỉ cho nhập số
            if (!val) return;

            newPin[i] = val;
            setPin(newPin.join(""));

            // focus sang ô kế tiếp
            if (e.target.nextSibling) e.target.nextSibling.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !pin[i] && e.target.previousSibling) {
              e.target.previousSibling.focus();
            }
          }}
        />
      ))}
    </div>

    <button type="submit" disabled={loading || pin.length < 6}>
      {loading ? "Đang xác minh..." : "Xác nhận mã PIN"}
    </button>
  </form>


        <p className="redirect-text">
          Chưa nhận được mã?{" "}
          <a href={`/forgot-password?email=${email}`}>Gửi lại</a>
        </p>
      </div>
    </div>
  );
}
