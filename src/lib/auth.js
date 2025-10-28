// lib/auth.js
import { API_BASE_URL } from "@/lib/api";

// === Token helpers ===
export function getToken() {
  return localStorage.getItem("accessToken");
}

export function getTokenExpiresAt() {
  return Number(localStorage.getItem("tokenExpiresAt") || 0);
}

export function setToken(token, expiresAt) {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("tokenExpiresAt", String(expiresAt));
}

export function clearToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("tokenExpiresAt");
}

// === Refresh token flow ===
export async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // gửi cookie refresh_token
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Refresh thất bại");

    setToken(data.token, data.expiresAt);
    return data.token;
  } catch (err) {
    console.warn("⚠️ Refresh token thất bại:", err.message);
    clearToken();
    return null;
  }
}

// === Lấy token còn hạn hoặc refresh nếu hết ===
export async function getValidToken() {
  const token = getToken();
  const expiresAt = getTokenExpiresAt();

  if (token && Date.now() < expiresAt - 1000) return token;

  // Hết hạn => refresh
  const newToken = await refreshAccessToken();
  return newToken;
}

// === fetch wrapper tự động refresh token ===
export async function authFetch(url, options = {}) {
  let token = await getValidToken();
  if (!token) throw new Error("No valid token");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type":
      options.headers?.["Content-Type"] || "application/json",
  };

  let res = await fetch(url, { ...options, headers, credentials: "include" });

  // Nếu 401 → thử refresh 1 lần
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) throw new Error("Unauthorized");
    headers.Authorization = `Bearer ${refreshed}`;
    res = await fetch(url, { ...options, headers, credentials: "include" });
  }
  return res;
}

// === Logout helper ===
export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.warn("⚠️ Lỗi logout:", err);
  } finally {
    clearToken();
  }
}
