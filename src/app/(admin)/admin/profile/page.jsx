"use client";

import { useState } from "react";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import useArrowNavigation from "@/hooks/useArrowNavigation"; // 🔥 Import hook điều hướng phím

export default function ProfilePage() {
    const tabs = [
        { id: "profile", label: "Hồ sơ cá nhân" }, // Đặt tiếng Việt cho thân thiện
        { id: "security", label: "Bảo mật & Mật khẩu" },
    ];

    const [activeTab, setActiveTab] = useState("profile");
    const [tabsFocus, setTabsFocus] = useState(false); // State để quản lý focus bàn phím

    // Hook điều hướng bằng phím mũi tên
    useArrowNavigation({
        items: tabs,
        activeId: activeTab,
        setActiveId: setActiveTab,
        direction: "horizontal",
        enabled: tabsFocus,
    });

    const renderTab = () => {
        switch (activeTab) {
            case "profile": return <ProfileTab />;
            case "security": return <SecurityTab />;
            default: return null;
        }
    };

    return (
        <div className="animate-reveal">
            <div className="flex justify-center mb-6">
                <div
                    tabIndex={0}
                    onFocus={() => setTabsFocus(true)}
                    onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setTabsFocus(false)}
                    className="outline-none"
                >
                    <div className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-full p-1.5 shadow-inner border border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
                                    ${activeTab === tab.id
                                        ? "bg-white text-gray-900 shadow-sm border border-gray-100 scale-105" // Active: Trắng, nổi lên
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50" // Inactive: Xám
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center content */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all">
                    {renderTab()}
                </div>
            </div>
        </div>
    );
}