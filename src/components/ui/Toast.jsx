// components/ui/Toast.jsx
"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

export default function Toast({ id, message, type = "success", onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsVisible(true);
        });

        const timer = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setIsLeaving(true);

        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    const styles = {
        success: "border-l-4 border-green-500 bg-white",
        error: "border-l-4 border-red-500 bg-white",
        info: "border-l-4 border-blue-500 bg-white",
    };

    const icons = {
        success: <FaCheckCircle className="text-green-500 text-lg" />,
        error: <FaExclamationCircle className="text-red-500 text-lg" />,
        info: <FaExclamationCircle className="text-blue-500 text-lg" />,
    };

    return (
        <div
            className={`
                flex items-center gap-3 px-5 py-4 
                rounded-lg shadow-lg min-w-[320px] max-w-sm mb-3 bg-white
                transition-all duration-150 ease-in-out transform
                ${styles[type]}
                ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
                ${isLeaving ? "h-0 mb-0 py-0 opacity-0 overflow-hidden" : "h-auto"}
            `}
        >
            <div className="shrink-0">{icons[type]}</div>

            <div className="flex-1">
                <h4 className="font-bold text-sm capitalize">
                    {type === "success" ? "Thành công" : "Thông báo"}
                </h4>
                <p className="text-sm text-gray-600 mt-0.5">{message}</p>
            </div>

            <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition p-1"
            >
                <FaTimes />
            </button>
        </div>
    );
}