"use client";

import { useState } from "react";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab"

export default function ProfilePage() {
    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "security", label: "Security" },
    ];

    const [activeTab, setActiveTab] = useState("profile");

    const renderTab = () => {
        switch (activeTab) {
            case "profile": return <ProfileTab />;
            case "security": return <SecurityTab />;
        }
    };

    return (
        <div className="px-2">
            {/* Tabs */}
            <div className="flex gap-6 border-b pb-2 mb-8 justify-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-2 text-sm font-semibold transition 
                            ${activeTab === tab.id
                                ? "text-black border-b-2 border-yellow-500"
                                : "text-gray-500 hover:text-black"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Center content */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-3xl">
                    {renderTab()}
                </div>
            </div>
        </div>
    );
}
