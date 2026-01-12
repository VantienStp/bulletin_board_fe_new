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
			const res = await fetch(`${API_BASE_URL}/auth/me`, {
				credentials: "include",
			});
			if (res.ok) {
				const data = await res.json();
				const adaptedUser = userAdapter(data.user);

				setUser(adaptedUser);

				if (typeof window !== "undefined") {
					localStorage.setItem("currentUser", JSON.stringify(adaptedUser));
				}
			} else {
				setUser(null);
				if (typeof window !== "undefined") {
					localStorage.removeItem("currentUser");
				}
			}
		} catch (err) {
			console.error("❌ Auth load failed:", err);
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