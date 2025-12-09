"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==== Load user từ cookie khi FE khởi động ====
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",   // gửi cookie access_token
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("❌ Auth load failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch { }

    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
