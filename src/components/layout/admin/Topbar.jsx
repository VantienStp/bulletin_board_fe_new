"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaBell, FaEnvelope, FaChevronDown, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import useOutsideClick from "@/hooks/useOutsideClick";
import { API_BASE_URL } from "@/lib/api";

function formatSegment(seg) {
	return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Topbar() {
	const pathname = usePathname();
	const router = useRouter();
	const segments = pathname.split("/").filter(Boolean);

	// State User
	const [user, setUser] = useState({
		username: "Admin",
		email: "admin@system.com",
		avatar: "/avatar1.png",
		role: "viewer" // Mặc định là quyền thấp nhất để an toàn
	});

	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const profileRef = useRef(null);
	useOutsideClick(profileRef, () => setIsProfileOpen(false));

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUser = localStorage.getItem("currentUser");
			if (storedUser) {
				try {
					const parsedUser = JSON.parse(storedUser);
					setUser({
						username: parsedUser.username || "User",
						email: parsedUser.email || "",
						avatar: parsedUser.avatar || "/avatar1.png",
						role: parsedUser.role || "viewer"
					});
				} catch (error) {
					console.error("Lỗi đọc dữ liệu user:", error);
				}
			}
		}
	}, []);

	const buildHref = (idx) => {
		return "/" + segments.slice(0, idx + 2).join("/");
	};

	const handleLogout = async () => {
		try {
			await fetch(`${API_BASE_URL}/auth/logout`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
		} catch (error) {
			console.error("Lỗi khi gọi API logout:", error);
		} finally {
			localStorage.removeItem("currentUser");
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
	};

	return (
		<div className="sticky top-0 z-40 w-full ">
			<div className="flex justify-between items-center h-full gap-4">

				{/* LEFT: BREADCRUMBS */}
				<div className="flex flex-col justify-center">
					<div className="flex items-center gap-2 text-lg font-bold text-gray-800">
						{segments.length === 1 && segments[0] === "admin" ? (
							<span className="flex items-center gap-2">
								Dashboard
							</span>
						) : (
							<div className="flex items-center text-sm sm:text-base">
								{segments.slice(1).map((seg, idx) => {
									const isLast = idx === segments.length - 2;
									return (
										<div key={idx} className="flex items-center">
											<span className="text-gray-300 mx-2">/</span>
											{!isLast ? (
												<Link href={buildHref(idx)} className="text-gray-500 hover:text-black transition font-medium">
													{formatSegment(seg)}
												</Link>
											) : (
												<span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
													{formatSegment(seg)}
												</span>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				<div className="flex-1"></div>

				{/* RIGHT: ACTIONS & PROFILE */}
				<div className="flex items-center gap-3 sm:gap-4">
					{/* Icons */}
					<div className="flex items-center gap-1 text-gray-500">
						<button
							className="p-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition relative group"
							title="Tin nhắn"
						>
							<FaEnvelope className="text-lg" />
							<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
						</button>

						<button
							className="p-2.5 hover:bg-green-50 hover:text-green-600 rounded-full transition relative"
							title="Thông báo"
						>
							<FaBell className="text-lg" />
							<span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
						</button>
					</div>

					<div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

					{/* Profile Dropdown */}
					<div className="relative" ref={profileRef}>
						<button
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							className={`flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full border transition-all duration-200 group bg-white    
                                ${isProfileOpen ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'}
                            `}
						>
							<img
								src={user.avatar}
								className="w-9 h-9 rounded-full object-cover border border-gray-200 transition-colors"
								alt="Avatar"
								onError={(e) => { e.target.src = "/avatar1.png" }}
							/>
							<div className="hidden sm:block text-left">
								<p className="text-[13px] font-bold text-gray-700 leading-tight group-hover:hover:text-green-400 transition">
									{user.username}
								</p>
								<p className="text-[10px] text-gray-400 font-medium leading-tight uppercase tracking-wider">
									{user.role}
								</p>
							</div>
							<FaChevronDown
								className={`text-gray-300 text-xs ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 hover:text-green-400' : ''}`}
							/>
						</button>

						{isProfileOpen && (
							<div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
								<div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
									<p className="text-sm font-bold text-gray-800">{user.username}</p>
									<p className="text-xs text-gray-500 truncate">{user.email}</p>
								</div>

								<div className="p-1">
									<Link
										href="/admin/profile"
										onClick={() => setIsProfileOpen(false)}
										className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-green-400 rounded-lg transition-colors"
									>
										<FaUser className="text-gray-400" /> Hồ sơ cá nhân
									</Link>

									{/* 🔥 CHỈ HIỆN SETTINGS NẾU LÀ ADMIN */}
									{user.role === 'admin' && (
										<Link
											href="/admin/settings"
											onClick={() => setIsProfileOpen(false)}
											className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-green-400 rounded-lg transition-colors"
										>
											<FaCog className="text-gray-400" /> Cài đặt hệ thống
										</Link>
									)}
								</div>

								<div className="h-[1px] bg-gray-100 my-1 mx-2"></div>

								<div className="p-1">
									<button
										onClick={handleLogout}
										className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
									>
										<FaSignOutAlt /> Đăng xuất
									</button>
								</div>
							</div>
						)}
					</div>

				</div>
			</div>
		</div>
	);
}