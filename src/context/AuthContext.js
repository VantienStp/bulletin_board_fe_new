"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { userAdapter } from "@/data/adapters/userAdapter";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const refreshUser = async () => {
		try {
			console.log("🔄 Đang gọi /auth/me để kiểm tra trạng thái...");
			const res = await fetch(`${API_BASE_URL}/auth/me`, {
				credentials: "include",
			});
			if (res.ok) {

				const data = await res.json();
				console.log("📥 Dữ liệu thô từ Server:", data);

				const adaptedUser = userAdapter(data.user);
				console.log("👤 Dữ liệu User sau khi qua Adapter:", adaptedUser);

				if (!adaptedUser || !adaptedUser.id) {
					console.error("⚠️ Adapter trả về dữ liệu thiếu ID!");
				}

				setUser(adaptedUser);

				if (typeof window !== "undefined") {
					localStorage.setItem("currentUser", JSON.stringify(adaptedUser));
				}
			} else {
				console.warn("🚫 Server từ chối Token hoặc chưa đăng nhập.");
				setUser(null);
				if (typeof window !== "undefined") {
					localStorage.removeItem("currentUser");
				}
			}
		} catch (err) {
			console.error("❌ Lỗi kết nối Auth Context:", err);
			setUser(null);
		}
	};

	useEffect(() => {
		const initAuth = async () => {
			await refreshUser();
			setLoading(false);
		};
		initAuth();
	}, []);

	const logout = async () => {
		try {
			await fetch(`${API_BASE_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch { }

		setUser(null);
		if (typeof window !== "undefined") {
			localStorage.removeItem("currentUser");
		}
		window.location.href = "/login";
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
			{!loading && children}
		</AuthContext.Provider>
	);
}