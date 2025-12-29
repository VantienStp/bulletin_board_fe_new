"use client";

import { useAuth } from "@/context/AuthContext";
import Topbar from "@/components/layout/admin/Topbar";
import Sidebar from "@/components/layout/admin/Sidebar";
import { usePathname } from "next/navigation";
import "@/styles/tokens.css";
import "@/styles/admin.css";
import { AuthProvider } from "@/context/AuthContext";


export default function AdminLayout({ children }) {
	const { user, loading } = useAuth();
	const pathname = usePathname();

	if (loading) return <div className="checking">Đang kiểm tra quyền truy cập...</div>;

	if (!user) {
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
		return null;
	}

	const handleLogout = () => {
		router.push("/admin/login");
	};

	return (
		<AuthProvider>
			<div className="h-screen w-screen bg-black">
				<div className="h-full w-full rounded-xl overflow-hidden grid grid-cols-[160px_1fr] bg-gray-100">
					{/* SIDEBAR */}
					<aside className="bg-softYellow h-full">
						<Sidebar onLogout={handleLogout} />
					</aside>
					{/* RIGHT SIDE */}
					<div className="flex flex-col h-full overflow-hidden">
						{/* TOPBAR */}
						<div className="shadow sticky top-0 z-50 px-11 py-3">
							<Topbar />
						</div>
						{/* MAIN CONTENT + ANIMATION */}
						<main className="admin-scroll flex-1 overflow-y-auto">
							<div key={pathname} className="admin-page-fade px-8 py-10 h-full">
								{children}
							</div>
						</main>

					</div>

				</div>

			</div>
		</AuthProvider>
	);
}
