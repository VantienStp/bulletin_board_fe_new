// lib/auth.js
import { API_BASE_URL } from "@/lib/api";

export function clearToken() {
  localStorage.removeItem("user_status");
}

export async function authFetch(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  const isAuthRequest = url.includes("/auth/refresh") || url.includes("/auth/logout");
  if (res.status === 401 && !isAuthRequest) {
    console.warn("🔑 Access Token hết hạn, đang thử làm mới...");

    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        console.error("❌ Refresh Token cũng đã hết hạn.");
        await logout();
        return null;
      }
    } catch (err) {
      console.error("🔥 Lỗi trong quá trình Refresh:", err);
      await logout();
      return null;
    }
  }

  return res;
}

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
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = "/login";
    }
  }
}