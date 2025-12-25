"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ onLogout }) {
    const pathname = usePathname();

    const mainMenu = [
        { href: "/admin", label: "Dashboard", icon: "fa-table-columns" },
        { href: "/admin/categories", label: "Categorie", icon: "fa-tags" },
        { href: "/admin/cards", label: "Card", icon: "fa-clone" },
        { href: "/admin/layouts", label: "Layout", icon: "fa-layer-group" },
        { href: "/admin/users", label: "User", icon: "fa-users" },
    ];

    const generalMenu = [
        { href: "/admin/settings", label: "Settings" },
        { href: "/admin/help", label: "Help" },
        { href: "/admin/profile", label: "Profile" },
    ];

    return (
        <aside className="w-full h-full bg-white px-4 py-2 flex flex-col rounded-l-2xl">
            {/* Logo */}
            <div className="text-center mb-6">
                <Link href="/admin">
                    <img
                        src="/logo.png"
                        className="w-16 mx-auto opacity-90"
                        alt="CloudFinz"
                        style={{ borderRadius: "10px" }}
                    />
                </Link>
            </div>

            {/* MAIN MENU */}
            <nav className="flex-1 overflow-y-auto">
                <ul className="mt-4 space-y-3 text-gray-700 font-semibold text-[14px]">

                    {mainMenu.map((item, idx) => {
                        const isActive = item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <li key={idx}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-2 py-3 rounded-xl w-full transition
      ${isActive
                                            ? "bg-black text-white shadow-md"
                                            : "hover:bg-gray-100 text-gray-700"
                                        }
  `}
                                >
                                    <div className="w-6 flex justify-center">
                                        <i
                                            className={`fa-solid ${item.icon} text-[18px]
                ${isActive ? "text-yellow-300" : ""}
            `}
                                        />
                                    </div>
                                    {item.label}
                                </Link>


                            </li>
                        );
                    })}

                </ul>
            </nav>

            {/* GENERAL */}
            <div className="mt-6 space-y-3 text-gray-600 font-semibold text-[14px]">
                <p className="text-xs text-gray-400">GENERAL</p>

                {generalMenu.map((item, idx) => {
                    const isActive = item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`
                                    block px-2 py-1 transition rounded-lg
                                    ${isActive
                                    ? "bg-black text-white shadow-md"
                                    : "hover:bg-gray-100 text-gray-700"
                                }
                                `}
                        >
                            {item.label}
                        </Link>
                    );
                })}

                <button
                    onClick={onLogout}
                    className="text-red-500 hover:text-red-600 mt-2"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
