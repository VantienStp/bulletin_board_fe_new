// lib/auth.js
import { API_BASE_URL } from "@/lib/api";

// FE không lưu access token nữa
export function clearToken() {
  localStorage.removeItem("dummy"); // để tránh lỗi cũ, nhưng không dùng nữa
}

// FE chỉ cần gọi API qua cookie
export async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // luôn gửi cookie
  });

  // Nếu BE trả 401 → hết hạn refresh token → logout
  if (res.status === 401) {
    console.warn("⚠️ Unauthorized → token hết hạn → logout");
    await logout();
    return null;
  }

  return res;
}

// FE logout
export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.warn("⚠️ Lỗi logout:", err);
  } finally {
    clearToken();
    window.location.href = "/login";
  }
}
