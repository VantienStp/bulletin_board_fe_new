"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Lấy CSRF token từ cookie
  const getCsrfToken = () => {
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}`},
        });
        if (res.ok) {
          const data = await res.json();
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
