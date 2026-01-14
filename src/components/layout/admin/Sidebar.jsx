"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import useArrowNavigation from "@/hooks/useArrowNavigation";
import { API_BASE_URL } from "@/lib/api";

const MENU_CONFIG = {
    MAIN: [
        { id: "dashboard", href: "/admin", label: "Dashboard", icon: "fa-table-columns" },
        { id: "categories", href: "/admin/categories", label: "Category", icon: "fa-tags" },
        { id: "cards", href: "/admin/cards", label: "Card", icon: "fa-clone" },
        { id: "layouts", href: "/admin/layouts", label: "Layout", icon: "fa-layer-group" },
        { id: "users", href: "/admin/users", label: "User", icon: "fa-users" },   // 🔒 Admin Only
    ],
    GENERAL: [
        { id: "settings", href: "/admin/settings", label: "Settings", icon: "fa-gear" }, // 🔒 Admin Only (Tùy chọn)
        { id: "profile", href: "/admin/profile", label: "Profile", icon: "fa-user" },
    ],
};

const findSectionById = (id, config) => {
    for (const [section, items] of Object.entries(config)) {
        if (items.some(item => item.id === id)) {
            return section;
        }
    }
    return null;
};

export default function Sidebar() {
    const router = useRouter();
    const itemRefs = useRef({});
    const pathname = usePathname();

    const [sidebarActive, setSidebarActive] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const containerRef = useRef(null);

    const [openSection, setOpenSection] = useState({
        MAIN: true,
        GENERAL: true,
    });
    const prevOpenSectionRef = useRef(openSection);

    const [highlight, setHighlight] = useState({
        top: 0,
        height: 0,
        visible: false,
    });

    // 🆕 STATE: Lưu role người dùng
    const [userRole, setUserRole] = useState("viewer");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                try {
                    const u = JSON.parse(storedUser);
                    setUserRole(u.role || "viewer");
                } catch (e) {
                    console.error("Parse user error", e);
                }
            }
        }
    }, []);

    // 🆕 LOGIC: Lọc Menu dựa trên Role
    const filteredMenu = useMemo(() => {
        // Danh sách các ID chỉ dành cho Admin
        const adminOnlyIds = ["users", "devices", "settings"];

        // Nếu là Admin, trả về toàn bộ menu gốc
        if (userRole === "admin") {
            return MENU_CONFIG;
        }

        // Nếu không phải Admin, lọc bỏ các mục cấm
        return {
            MAIN: MENU_CONFIG.MAIN.filter(item => !adminOnlyIds.includes(item.id)),
            GENERAL: MENU_CONFIG.GENERAL.filter(item => !adminOnlyIds.includes(item.id)),
        };
    }, [userRole]);

    // ================= SYNC ACTIVE BY URL =================
    useEffect(() => {
        const allItems = Object.values(filteredMenu).flat();
        const current = allItems.find(item =>
            item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
        );
        setActiveId(current?.id ?? null);
    }, [pathname, filteredMenu]);

    // ================= KEYBOARD NAV (MAIN) =================
    useArrowNavigation({
        items: filteredMenu, // 🔥 Truyền menu đã lọc vào đây
        activeId,
        setActiveId: (newId) => {
            setActiveId(newId);
            const allItems = Object.values(filteredMenu).flat();
            const target = allItems.find(i => i.id === newId);
            if (target && pathname !== target.href) {
                router.push(target.href);
            }
        },
        direction: "vertical",
        enabled: sidebarActive,
    });

    // ================= HIGHLIGHT POSITION =================
    useEffect(() => {
        if (!activeId) {
            setHighlight(h => ({ ...h, visible: false }));
            return;
        }

        // Tìm section trong menu đã lọc
        const section = findSectionById(activeId, filteredMenu);
        if (!section) return;

        const isOpen = openSection[section];
        const wasJustOpened = !prevOpenSectionRef.current[section] && isOpen;

        if (!isOpen) {
            setHighlight(h => ({ ...h, visible: false }));
            prevOpenSectionRef.current = openSection;
            return;
        }

        const itemsInSection = filteredMenu[section] || [];
        const activeIndex = itemsInSection.findIndex(item => item.id === activeId);

        const dynamicDelay = wasJustOpened
            ? (activeIndex !== -1 ? activeIndex * 80 : 0) + 150
            : 150;

        const timer = setTimeout(() => {
            const el = itemRefs.current[activeId];
            const container = containerRef.current;
            if (!el || !container) return;

            const elRect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            setHighlight({
                top: elRect.top - containerRect.top,
                height: elRect.height,
                visible: true,
            });

            prevOpenSectionRef.current = openSection;
        }, dynamicDelay);

        return () => clearTimeout(timer);
    }, [activeId, openSection, filteredMenu]); // Thêm filteredMenu vào deps

    // ================= LOGOUT =================
    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };

    // ================= RENDER SECTION =================
    const renderSection = (title, items) => {
        if (!items || items.length === 0) return null; // Không render nếu section trống

        const isOpen = openSection[title];
        return (
            <div className="mt-6 pr-2">
                <p className="text-xs text-gray-400 mb-2 cursor-pointer flex justify-between select-none"
                    onClick={() => setOpenSection(s => ({ ...s, [title]: !s[title] }))}
                >
                    {title}
                    <span className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>
                        ▸
                    </span>
                </p>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}>
                    <div className="relative space-y-2 pt-1">
                        {items.map((item, index) => {
                            const isActive = item.id === activeId;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    ref={el => { if (el) itemRefs.current[item.id] = el; }}
                                    onClick={() => setActiveId(item.id)}

                                    className={`relative z-10 flex items-center gap-3 px-2 py-3 rounded-xl outline-none
                                        transition-all ease-linear
                                        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
                                        ${isActive ? "text-white" : "hover:bg-gray-100 text-gray-700"}
                                    `}
                                    style={{
                                        transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                                    }}
                                >
                                    {item.icon && (
                                        <i
                                            style={{ transitionDelay: isOpen ? `${index * 50 + 100}ms` : "0ms" }}
                                            className={`fa-solid ${item.icon} ${isActive ? "text-yellow-300" : "text-black"} w-5 text-center`}
                                        />
                                    )}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <aside
            tabIndex={0}
            onFocus={() => setSidebarActive(true)}
            onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setSidebarActive(false)}
            className="w-full h-full bg-white py-2 flex flex-col rounded-l-2xl outline-none"
        >
            <div className="text-center px-2 mb-2">
                <Link href="/admin">
                    <img src="/logo.png" className="w-14 mx-auto rounded-lg object-contain" alt="CloudFinz" />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pr-1 scrollbar-hide">
                <div ref={containerRef} className="relative w-full">
                    <div
                        className={`absolute left-0 right-0 rounded-xl bg-black transition-all ease-out duration-300 z-0 mr-2
                            ${highlight.visible ? "opacity-100" : "opacity-0"}
                        `}
                        style={{
                            top: highlight.top,
                            height: highlight.height,
                        }}
                    />

                    {/* 🔥 Render menu đã lọc */}
                    {renderSection("MAIN", filteredMenu.MAIN)}
                    {renderSection("GENERAL", filteredMenu.GENERAL)}
                </div>
            </div>

            <div className="px-4 pb-2 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center gap-3"
                >
                    <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
                    Logout
                </button>
            </div>
        </aside>
    );
}