"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function VerifyPinPage() {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  // Khi email bị thiếu → chặn ngay
  if (!email) {
    if (typeof window !== "undefined") {
      router.replace("/forgot-password");
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (pin.length < 6) {
      setMessage("❌ Mã PIN phải đủ 6 chữ số.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, pin }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Mã PIN không hợp lệ");

      // luôn dùng email trả về từ server nếu có
      const verifiedEmail = data.userEmailForDisplay || email;

      sessionStorage.setItem("userEmailForDisplay", verifiedEmail);

      setMessage("✅ Mã PIN hợp lệ! Đang chuyển sang bước đặt lại mật khẩu...");
      setTimeout(() => router.push("/reset-password"), 1500);

    } catch (err) {
      setMessage("❌ " + (err.message || "Đã xảy ra lỗi không xác định."));
    } finally {
      setLoading(false);
    }
  };

  // ===== Các hàm nhập PIN =====
  const updatePinAtIndex = (i, value) => {
    const arr = Array.from({ length: 6 }, (_, index) => pin[index] || "");
    arr[i] = value;
    setPin(arr.join(""));
  };

  const focusNext = (target, index) => {
    const next = target.parentElement.querySelector(`.pin-box:nth-child(${index + 2})`);
    if (next) next.focus();
  };

  const handlePinChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "");

    if (!val) {
      updatePinAtIndex(i, "");
      return;
    }

    const oneChar = val.charAt(0);
    updatePinAtIndex(i, oneChar);

    if (!isComposing) {
      setTimeout(() => focusNext(e.target, i), 0);
    }
  };

  const handlePinKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (pin[i]) {
        e.preventDefault();
        updatePinAtIndex(i, "");
      } else if (i > 0) {
        e.preventDefault();
        updatePinAtIndex(i - 1, "");
        e.target.previousSibling.focus();
      }
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
        <p className="a-text">
          Nhập mã 6 chữ số đã được gửi đến email: <b>{email}</b>
        </p>

        {message && <div className="message-box">{message}</div>}

        <form onSubmit={handleVerify}>
          <label>Mã PIN</label>

          <div className="pin-inputs">
            {Array.from({ length: 6 }, (_, i) => (
              <input
                key={i}
                maxLength={1}
                className="pin-box"
                value={pin[i] || ""}
                inputMode="numeric"
                onChange={(e) => handlePinChange(e, i)}
                onKeyDown={(e) => handlePinKeyDown(e, i)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(e) => {
                  setIsComposing(false);
                  const v = e.target.value.replace(/\D/g, "");
                  if (v) {
                    updatePinAtIndex(i, v[0]);
                    setTimeout(() => focusNext(e.target, i), 0);
                  }
                }}
              />
            ))}
          </div>

          <button type="submit" disabled={loading || pin.length < 6}>
            {loading ? "Đang xác minh..." : "Xác nhận mã PIN"}
          </button>
        </form>

        {/* dùng router.push → không reload trang */}
        <p className="redirect-text">
          Chưa nhận được mã?{" "}
          <span
            className="highlight-text a-button"
            onClick={() => router.push(`/forgot-password?email=${email}`)}
          >
            Gửi lại
          </span>
        </p>
      </div>
    </div>
  );
}
