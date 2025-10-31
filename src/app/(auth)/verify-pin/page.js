// verifiy-password page
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function VerifyPinPage() {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // Theo dõi trạng thái của bộ gõ (Composition)
  const [isComposing, setIsComposing] = useState(false); 

  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

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
      console.log(data)
      if (!res.ok) throw new Error(data.message || "Mã PIN không hợp lệ");

      const { userEmailForDisplay } = data;
      sessionStorage.setItem("userEmailForDisplay", userEmailForDisplay || email);

      setMessage("✅ Mã PIN hợp lệ! Đang chuyển sang bước đặt lại mật khẩu...");
      setTimeout(() => {
        router.push(`/reset-password`);
      }, 1500);
    } catch (err) {
      setMessage("❌ " + (err.message || "Đã xảy ra lỗi không xác định."));
    } finally {
      setLoading(false);
    }
  };

  const updatePinAtIndex = (index, value) => {
    const currentPinArray = Array.from({ length: 6 }, (_, i) => pin[i] || "");
    currentPinArray[index] = value;
    setPin(currentPinArray.join(""));
  };
  
  // --- Hàm Hỗ Trợ Focus và Composition ---

  const focusNextInput = (currentElement, currentIndex) => {
    const nextInput = currentElement.parentElement.querySelector(`.pin-box:nth-child(${currentIndex + 2})`);
    if (nextInput) {
        nextInput.focus();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e, i) => {
    setIsComposing(false);
    
    // Sau khi kết thúc Composition, đảm bảo giá trị cuối cùng được cập nhật
    const val = e.target.value.replace(/\D/g, "");
    if (val) {
        const finalChar = val.substring(0, 1);
        updatePinAtIndex(i, finalChar);

        // 🔑 FIX LỖI GHOSTING: Dùng setTimeout(..., 0) để đẩy lệnh chuyển focus
        // vào cuối event loop.
        setTimeout(() => {
            focusNextInput(e.target, i);
        }, 0);
    }
  };
  
  const handleFocus = (e, i) => {
    // Tìm ô đầu tiên trống và chuyển focus đến đó (nếu không phải ô hiện tại)
    const firstEmptyIndex = pin.split('').findIndex(char => !char);
    if (firstEmptyIndex !== -1 && firstEmptyIndex !== i) {
        e.preventDefault();
        const targetInput = e.currentTarget.parentNode.querySelector(`.pin-box:nth-child(${firstEmptyIndex + 1})`);
        if(targetInput) targetInput.focus();
        return;
    }
  }

  const handlePinChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "");

    if (!val) {
      updatePinAtIndex(i, "");
      return;
    }

    const singleChar = val.substring(0, 1);
    updatePinAtIndex(i, singleChar);

    if (!isComposing) {
        setTimeout(() => {
            focusNextInput(e.target, i);
        }, 0); 
    } 
  };
  
  const handlePinKeyDown = (e, i) => {
    // Xử lý phím Backspace
    if (e.key === "Backspace") {
      // 1. Nếu ô hiện tại có ký tự, xóa ký tự đó
      if (pin[i]) {
        e.preventDefault(); 
        updatePinAtIndex(i, "");
      }
      // 2. Nếu ô hiện tại trống VÀ có ô trước đó, chuyển focus về ô trước đó VÀ xóa ký tự ở ô đó
      else if (e.target.previousSibling) {
        e.preventDefault();
        e.target.previousSibling.focus();
        updatePinAtIndex(i - 1, "");
      }
      return;
    }
    
    // Xử lý phím Mũi tên (tùy chọn)
    if (e.key === "ArrowRight" && e.target.nextSibling) {
      e.target.nextSibling.focus();
    } else if (e.key === "ArrowLeft" && e.target.previousSibling) {
      e.target.previousSibling.focus();
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
        <p>
          Nhập mã 6 chữ số đã được gửi đến email: <b>{email}</b>
        </p>

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
                onChange={(e) => handlePinChange(e, i)} 
                onKeyDown={(e) => handlePinKeyDown(e, i)}
                onFocus={(e) => handleFocus(e, i)} 
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={(e) => handleCompositionEnd(e, i)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
                  setPin(pastedData);
                  
                  // Tối ưu focus sau khi dán
                  if (pastedData.length > 0) {
                      const nextIndex = pastedData.length - 1;
                      const inputElements = e.currentTarget.parentNode.querySelectorAll('.pin-box');
                      
                      const focusIndex = Math.min(nextIndex + 1, 5); 
                      if (inputElements[focusIndex]) {
                          inputElements[focusIndex].focus();
                      }
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