"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { getToken, setToken, clearToken } from "@/lib/auth";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false); // để tránh gọi refresh liên tục

  // ✅ Hàm kiểm tra có cookie refresh_token hay không
  const hasRefreshCookie = () => {
    try {
      return document.cookie.split(";").some((c) => c.trim().startsWith("refresh_token="));
    } catch {
      return false;
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = getToken();
        const hasCookie = hasRefreshCookie();

        // 🧠 Nếu không có token và cũng không có cookie → chưa đăng nhập
        if (!token && !hasCookie) {
          console.log("🟡 [Auth] Chưa có accessToken & cookie, bỏ qua refresh");
          setUser(null);
          setLoading(false);
          return;
        }

        // ⚠️ Tránh gọi lại nhiều lần nếu cookie hết hạn
        if (checked && !hasCookie) {
          console.log("⚠️ [Auth] Cookie refresh_token không còn, bỏ qua gọi lại");
          setUser(null);
          setLoading(false);
          return;
        }

        console.log("🔄 [Auth] Đang kiểm tra refresh token...");
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // gửi cookie
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("✅ [Auth] Refresh thành công, cấp lại access token");
          setToken(data.token, data.expiresAt);
          setUser(data.user || { role: "user" });
        } else {
          console.warn("❌ [Auth] Refresh token không hợp lệ hoặc hết hạn");
          clearToken();
          setUser(null);
        }
      } catch (err) {
        console.error("🔥 [Auth] Lỗi khi gọi refresh:", err);
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
        setChecked(true);
      }
    }

    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    setUser,
    clearAuth: () => {
      clearToken();
      setUser(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
