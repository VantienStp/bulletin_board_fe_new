"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Topbar from "@/components/layout/admin/Topbar";
import Sidebar from "@/components/layout/admin/Sidebar";
import Loading from "./loading";
import "@/styles/tokens.css";
import "@/styles/admin.css";

export default function AdminLayout({ children }) {
	const { user, loading, logout } = useAuth();
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (isMounted) {
			if (!loading && !user) {
				router.push("/login");
			}
		}
	}, [user, loading, router, isMounted]);

	// ✅ SỬA LOGIC LOGOUT TẠI ĐÂY
	const handleLogout = () => {
		// 1. Xóa thông tin hiển thị UI
		localStorage.removeItem("currentUser");

		// 2. Gọi hàm logout của AuthContext
		if (logout) logout();

		// 3. 🔥 DÙNG window.location.href THAY VÌ router.push
		// Để ép trình duyệt xóa sạch CSS của trang Admin và reset lại trạng thái Auth
		window.location.href = "/login";
	};

	if (!isMounted || loading || !user) {
		return <Loading />;
	}

	return (
		// ... (phần render giữ nguyên)
		<div className="h-screen w-screen bg-black">
			<div className="h-full w-full rounded-xl overflow-hidden grid grid-cols-[160px_1fr] bg-gray-100">
				<aside className="bg-softYellow h-full">
					<Sidebar onLogout={handleLogout} />
				</aside>
				<div className="flex flex-col h-full overflow-hidden">
					<div className="shadow sticky top-0 z-50 px-11 py-3 bg-white/80 backdrop-blur-md">
						<Topbar />
					</div>
					<main className="admin-scroll flex-1 overflow-y-auto bg-gray-50">
						<div className="px-8 py-10 h-full">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}