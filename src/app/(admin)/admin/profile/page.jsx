"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // 🔥 1. Import motion
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import useArrowNavigation from "@/hooks/useArrowNavigation";

export default function ProfilePage() {
    const tabs = [
        { id: "profile", label: "Hồ sơ cá nhân" },
        { id: "security", label: "Bảo mật & Mật khẩu" },
    ];

    const [activeTab, setActiveTab] = useState("profile");
    const [tabsFocus, setTabsFocus] = useState(false);

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
                    {/* Container chứa tabs */}
                    <div className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-full p-1.5 shadow-inner border border-gray-200 relative">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                                    ${activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}
                                `}
                                style={{
                                    WebkitTapHighlightColor: "transparent",
                                }}
                            >
                                {/* 🔥 2. Phần nền trắng trượt qua lại nằm ở đây */}
                                {activeTab === tab.id && (
                                    <motion.span
                                        layoutId="active-pill" // ID này giúp Framer Motion nhận diện và tạo animation trượt
                                        className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-100 -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Label của tab */}
                                <span className="relative z-20">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center content */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100d:p-8 transition-all">
                    {renderTab()}
                </div>
            </div>
        </div>
    );
}