
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useArrowNavigation from "@/hooks/useArrowNavigation";

export default function Sidebar({ onLogout }) {
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
    const prevOpenSectionRef = useRef(openSection)


    const [highlight, setHighlight] = useState({
        top: 0,
        height: 0,
        visible: false,
    });

    const menuConfig = {
        MAIN: [
            { id: "dashboard", href: "/admin", label: "Dashboard", icon: "fa-table-columns" },
            { id: "categories", href: "/admin/categories", label: "Category", icon: "fa-tags" },
            { id: "cards", href: "/admin/cards", label: "Card", icon: "fa-clone" },
            { id: "layouts", href: "/admin/layouts", label: "Layout", icon: "fa-layer-group" },
            { id: "users", href: "/admin/users", label: "User", icon: "fa-users" },
        ],
        GENERAL: [
            { id: "settings", href: "/admin/settings", label: "Settings", icon: "fa-gear" },
            { id: "profile", href: "/admin/profile", label: "Profile", icon: "fa-user" },
        ],
    };

    const mainMenu = menuConfig.MAIN ?? [];
    const generalMenu = menuConfig.GENERAL ?? [];

    const findSectionById = (id) => {
        for (const [section, items] of Object.entries(menuConfig)) {
            if (items.some(item => item.id === id)) {
                return section;
            }
        }
        return null;
    };

    // ================= SYNC ACTIVE BY URL =================
    useEffect(() => {
        const allItems = Object.values(menuConfig).flat();
        const current = allItems.find(item =>
            item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
        );
        setActiveId(current?.id ?? null);
    }, [pathname]);

    // ================= KEYBOARD NAV (MAIN) =================
    useArrowNavigation({
        items: menuConfig,
        activeId,
        setActiveId: (newId) => {
            setActiveId(newId);
            // TƯ DUY: Chỉ điều hướng khi dùng phím mũi tên
            const allItems = Object.values(menuConfig).flat();
            const target = allItems.find(i => i.id === newId);
            if (target && pathname !== target.href) {
                router.push(target.href);
            }
        },
        direction: "vertical",
        enabled: sidebarActive,
    });

    // ================= HIGHLIGHT POSITION (MAIN + GENERAL) =================
    useEffect(() => {
        if (!activeId) {
            setHighlight(h => ({ ...h, visible: false }));
            return;
        }

        const section = findSectionById(activeId);
        const isOpen = openSection[section];
        const wasJustOpened = !prevOpenSectionRef.current[section] && isOpen;

        if (!isOpen) {
            setHighlight(h => ({ ...h, visible: false }));
            prevOpenSectionRef.current = openSection;
            return;
        }

        const itemsInSection = menuConfig[section] || [];
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

            // Sau khi chạy xong, cập nhật trạng thái cũ để lần chuyển tiếp theo (cùng section) sẽ chạy nhanh
            prevOpenSectionRef.current = openSection;
        }, dynamicDelay);

        return () => clearTimeout(timer);
    }, [activeId, openSection]);


    // ================= RENDER SECTION =================
    const renderSection = (title, items) => {
        const isOpen = openSection[title];
        return (
            <div className="mt-6 pr-2">
                <p className="text-xs text-gray-400 mb-2 cursor-pointer flex justify-between"
                    onClick={() => setOpenSection(s => ({ ...s, [title]: !s[title] }))}
                >
                    {title}
                    <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>
                        ▸
                    </span>
                </p>

                <div className={`overflow-hidden transition-all 
                    ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}>
                    <div className="relative space-y-2">
                        {items.map((item, index) => {
                            const isActive = item.id === activeId;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    ref={el => { if (el) itemRefs.current[item.id] = el; }}
                                    onClick={() => setActiveId(item.id)}

                                    className={`relative z-10 flex items-center gap-3 px-2 py-3 rounded-xl
                                        transition-all ease-linear
                                        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
                                        ${isActive ? "text-white" : "hover:bg-gray-100 text-gray-700"}
                                    `}
                                    style={{
                                        transitionDelay: isOpen ? `${index * 80}ms` : "0ms",
                                    }}
                                >
                                    {item.icon && (

                                        <i
                                            style={{ transitionDelay: isOpen ? `${index * 80 + 100}ms` : "0ms" }}
                                            className={`fa-solid ${item.icon} ${isActive ? "text-yellow-300" : "text-black"}`}
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
            className="w-full h-full bg-white py-2 flex flex-col rounded-l-2xl"
        >
            <div className="text-center px-2 mb-2">
                <Link href="/admin">
                    <img src="/logo.png" className="w-20 mx-auto rounded-lg" alt="CloudFinz" />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pr-1">
                <div ref={containerRef} className="relative w-full">
                    <div
                        className={`absolute left-0 right-0 rounded-xl bg-black transition-all ease-linear duration-300 z-0 mr-2
                            ${highlight.visible ? "opacity-100" : "opacity-0"}
                        `}
                        style={{
                            top: highlight.top,
                            height: highlight.height,
                        }}
                    />

                    {renderSection("MAIN", mainMenu)}
                    {renderSection("GENERAL", generalMenu)}
                </div>

                <button
                    onClick={onLogout}
                    className="mt-4 px-2 py-2 text-red-500 hover:text-red-600"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
