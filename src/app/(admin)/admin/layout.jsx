"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Dùng router của Next.js để chuyển trang mượt
import { useAuth } from "@/context/AuthContext";
import Topbar from "@/components/layout/admin/Topbar";
import Sidebar from "@/components/layout/admin/Sidebar";
import Loading from "./loading"; // Tận dụng lại cái Loading đẹp
import "@/styles/tokens.css";
import "@/styles/admin.css";

// ⚠️ QUAN TRỌNG: Đã có AuthProvider ở RootLayout rồi thì KHÔNG bọc lại ở đây nữa
// Nếu bọc lại sẽ gây reset state user liên tục.

export default function AdminLayout({ children }) {
	const { user, loading } = useAuth();
	const router = useRouter();

	// 1. Logic bảo vệ trang (Protected Route)
	useEffect(() => {
		// Chỉ chạy khi đã load xong data auth
		if (!loading && !user) {
			router.push("/login"); // Chuyển trang phía Client (nhanh hơn window.location)
		}
	}, [user, loading, router]);

	// 2. Xử lý Logout
	const handleLogout = () => {
		// Gọi hàm logout từ context (nếu có) hoặc xóa token
		// Sau đó đẩy về trang login
		router.push("/admin/login");
	};

	// 3. Hiển thị màn hình chờ xịn xò trong lúc check user
	if (loading) {
		return <Loading />;
	}

	// 4. Nếu chưa có user (đang đợi redirect) thì không render gì cả để tránh lộ giao diện
	if (!user) return null;

	return (
		<div className="h-screen w-screen bg-black">
			<div className="h-full w-full rounded-xl overflow-hidden grid grid-cols-[160px_1fr] bg-gray-100">
				{/* SIDEBAR */}
				<aside className="bg-softYellow h-full">
					<Sidebar onLogout={handleLogout} />
				</aside>

				{/* RIGHT SIDE */}
				<div className="flex flex-col h-full overflow-hidden">
					{/* TOPBAR */}
					<div className="shadow sticky top-0 z-50 px-11 py-3 bg-white/80 backdrop-blur-md"> {/* Thêm backdrop-blur cho đẹp */}
						<Topbar />
					</div>

					{/* MAIN CONTENT */}
					<main className="admin-scroll flex-1 overflow-y-auto bg-gray-50">
						{/* Bỏ admin-page-fade nếu nó gây giật, hoặc giữ lại nếu thấy mượt */}
						<div className="px-8 py-10 h-full">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}