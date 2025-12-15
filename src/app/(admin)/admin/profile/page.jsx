"use client";

import { useState } from "react";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab"

import SessionsTab from "./tabs/SessionsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import BillingTab from "./tabs/BillingTab";

export default function ProfilePage() {
    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "security", label: "Security" },
        { id: "sessions", label: "Sessions" },
        { id: "notifications", label: "Notifications" },
        { id: "billing", label: "Billing" },
    ];

    const [activeTab, setActiveTab] = useState("profile");

    const renderTab = () => {
        switch (activeTab) {
            case "profile": return <ProfileTab />;
            case "security": return <SecurityTab />;
            case "sessions": return <SessionsTab />;
            case "notifications": return <NotificationsTab />;
            case "billing": return <BillingTab />;
        }
    };

    return (
        <div className="px-2">
            <h1 className="text-3xl font-bold mb-6 text-center">Account Settings</h1>

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
