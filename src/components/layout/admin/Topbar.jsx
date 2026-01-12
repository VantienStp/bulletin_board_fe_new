"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBell, FaEnvelope, FaChevronDown } from "react-icons/fa";

function formatSegment(seg) {
	return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Topbar() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);

	const [user, setUser] = useState({
		username: "Admin",
		email: "admin@system.com",
		avatar: "/avatar1.png"
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUser = localStorage.getItem("currentUser");
			if (storedUser) {
				try {
					const parsedUser = JSON.parse(storedUser);
					setUser({
						username: parsedUser.username || "User",
						email: parsedUser.email || "",
						avatar: parsedUser.avatar || "/avatar1.png"
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

	return (
		<div className="sticky top-0 z-40 w-full">
			<div className="flex justify-between items-center h-full gap-4">

				{/* ================= LEFT: BREADCRUMBS ================= */}
				<div className="flex flex-col justify-center">
					<div className="flex items-center gap-2 text-xl font-bold text-gray-800">
						{segments.length === 1 && segments[0] === "admin" ? (
							<span>Dashboard</span>
						) : (
							segments.slice(1).map((seg, idx) => {
								const isLast = idx === segments.length - 2;
								return (
									<div key={idx} className="flex items-center gap-2">
										<span className="text-gray-400">/</span>
										{!isLast ? (
											<Link href={buildHref(idx)} className="text-gray-500 hover:text-black transition">
												{formatSegment(seg)}
											</Link>
										) : (
											<span className="text-gray-800">{formatSegment(seg)}</span>
										)}
									</div>
								);
							})
						)}
					</div>
					<p className="text-xs text-gray-400 hidden sm:block mt-0.5">
						Xin chào, {user.username}!
					</p>
				</div>

				<div className="flex-1"></div>

				{/* ================= RIGHT: ACTIONS & PROFILE ================= */}
				<div className="flex items-center gap-3 sm:gap-5">

					<div className="flex items-center gap-2 text-gray-500">
						<button className="p-2 hover:bg-gray-100 rounded-full transition relative">
							<FaEnvelope className="text-lg" />
						</button>
						<button className="p-2 hover:bg-gray-100 rounded-full transition relative">
							<FaBell className="text-lg" />
							<span className="absolute top-1.5 right-2 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
						</button>
					</div>

					<div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

					<div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group">
						<img
							src={user.avatar}
							className="w-9 h-9 rounded-full object-cover border border-gray-200 group-hover:border-green-500 transition-colors"
							alt="Avatar"
							onError={(e) => { e.target.src = "/avatar1.png" }}
						/>
						<div className="hidden sm:block text-left">
							<p className="text-[13px] font-bold text-gray-700 leading-tight group-hover:text-green-700 transition">
								{user.username}
							</p>
							<p className="text-[10px] text-gray-400 font-medium leading-tight">
								{user.role || "Admin"}
							</p>
						</div>
						<FaChevronDown className="text-gray-300 text-xs group-hover:text-gray-500 transition ml-1 hidden sm:block" />
					</div>

				</div>
			</div>
		</div>
	);
}