"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaUser, FaGear, FaRightFromBracket } from "react-icons/fa6";
import useOutsideClick from "@/hooks/useOutsideClick";
import NotificationCenter from "./NotificationCenter";

function formatSegment(seg) {
	return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Topbar() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);

	const [user, setUser] = useState({ username: "Admin", email: "", avatar: "/avatar1.png", role: "viewer" });
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const profileRef = useRef(null);
	useOutsideClick(profileRef, () => setIsProfileOpen(false));

	useEffect(() => {
		const storedUser = localStorage.getItem("currentUser");
		if (storedUser) {
			try {
				const parsed = JSON.parse(storedUser);
				setUser({ ...parsed, avatar: parsed.avatar || "/avatar1.png" });
			} catch (e) { console.error(e); }
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("currentUser");
		localStorage.removeItem("token");
		window.location.href = "/login";
	};

	return (
		<div className="sticky top-0 z-40 w-full ">
			<div className="flex justify-between items-center h-full gap-4">

				{/* LEFT: BREADCRUMBS */}
				<div className="flex items-center text-lg font-bold text-gray-800">
					{segments.length === 1 && segments[0] === "admin" ? (
						<span className="text-indigo-600">Dashboard</span>
					) : (
						<div className="flex items-center">
							{segments.slice(1).map((seg, idx) => (
								<div key={idx} className="flex items-center">
									<span className="text-gray-300 mx-2">/</span>
									{idx !== segments.length - 2 ? (
										<Link href={"/admin/" + segments.slice(1, idx + 2).join("/")} className="text-gray-500  transition font-bold">
											{formatSegment(seg)}
										</Link>
									) : (
										<span className="text-indigo-600 font-bold px-2 py-0.5 rounded-md">{formatSegment(seg)}</span>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="flex-1"></div>

				{/* RIGHT: ACTIONS */}
				<div className="flex items-center gap-4">
					<NotificationCenter />
					<div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>
					<div className="relative" ref={profileRef}>
						<button
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							className={`flex items-center gap-3 p-1 rounded-full border transition-all bg-white ${isProfileOpen ? 'border-indigo-200 shadow-md ring-4 ring-indigo-50' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
								}`}
						>
							<img src={user.avatar} className="w-9 h-9 rounded-full object-cover shrink-0" alt="Avatar" />
							<div className="hidden sm:block text-left pr-2">
								<p className="text-[13px] font-bold text-gray-700 leading-tight">{user.username}</p>
								<p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{user.role}</p>
							</div>
							<FaChevronDown className={`text-gray-300 text-[10px] mr-2 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
						</button>

						{isProfileOpen && (
							<div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 space-y-1 z-50">
								<Link href="/admin/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
									<FaUser className="text-gray-400 text-xs" /> Hồ sơ cá nhân
								</Link>
								{user.role === 'admin' && (
									<Link href="/admin/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
										<FaGear className="text-gray-400 text-xs" /> Cài đặt hệ thống
									</Link>
								)}
								<div className="h-[1px] bg-gray-100 my-1 mx-2"></div>
								<button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium">
									<FaRightFromBracket className="text-xs" /> Đăng xuất
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}