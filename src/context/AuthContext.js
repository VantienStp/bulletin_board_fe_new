"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Lấy CSRF token từ cookie
  const getCsrfToken = () => {
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  // 🧱 Check đăng nhập khi load FE
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // ⚠️ cần thiết để gửi cookie
        });
        if (res.ok) {
          const data = await res.json();
          console.log("🔄 Token refreshed:", data);
          setUser(data.user || { role: "user" });
        }
      } catch (err) {
        console.error("❌ Refresh token failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // 🧱 Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      return { success: false, message: "Lỗi mạng" };
    }
  };

  // 🧱 Hàm logout
  const logout = async () => {
    try {
      const csrf = getCsrfToken();
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": csrf },
      });
      setUser(null);
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
