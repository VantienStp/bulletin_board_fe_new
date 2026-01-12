"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

function formatSegment(seg) {
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // State lưu thông tin user
  const [user, setUser] = useState({
    username: "Admin",
    email: "admin@system.com",
    avatar: "/avatar1.png"
  });

  // Load từ LocalStorage khi component chạy
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
    <div className="sticky top-0 z-40">
      <div className="w-full flex justify-between items-center">
        {/* LEFT: Greeting */}
        <div className="flex items-center gap-2 text-2xl font-semibold">
          {segments.length === 1 && segments[0] === "admin" ? (
            <div className="flex flex-col">
              <span className="text-gray-900 flex items-center gap-2">
                Chào buổi sáng, {user.username}! 👋
              </span>
              <p className="text-xs font-normal text-gray-500 italic">
                Chúc bạn một ngày làm việc hiệu quả!
              </p>
            </div>
          ) : (
            // Breadcrumbs logic...
            segments.slice(1).map((seg, idx) => {
              const isLast = idx === segments.length - 2;
              return (
                <div key={idx} className="flex items-center gap-2">
                  {!isLast ? (
                    <Link href={buildHref(idx)} className="text-gray-400 hover:text-gray-600 transition">
                      {formatSegment(seg)}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-semibold">{formatSegment(seg)}</span>
                  )}
                  {!isLast && <span className="text-gray-400">›</span>}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT: Avatar & Info */}
        <div className="flex items-center gap-5 ml-auto">
          <div className="flex items-center gap-3 bg-green-600 text-black px-3 py-1.5 rounded-full shadow-lg shadow-green-200">
            <img
              src={user.avatar}
              className="w-9 h-9 rounded-full object-cover border-2 border-white"
              alt="Avatar"
              onError={(e) => { e.target.src = "/avatar1.png" }} // Fallback nếu ảnh lỗi
            />
            <div className="hidden sm:block text-left">
              <p className="text-[14px] font-semibold text-white leading-tight">
                {user.username}
              </p>
              <p className="text-[11px] text-white/90 leading-tight">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}