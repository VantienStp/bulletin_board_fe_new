// src/components/common/ConfirmModal.jsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({
    open,
    title = "Xác nhận hành động",
    message = "Bạn có chắc chắn muốn thực hiện việc này?",
    onCancel,
    onConfirm,
    isLoading,
    confirmText = "Xác nhận",
    variant = "danger"
}) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "");
    }, [open]);

    if (!open) return null;

    const confirmBtnStyles = {
        danger: "bg-red-600 hover:bg-red-700 text-white",
        primary: "bg-black hover:bg-gray-800 text-white",
        info: "bg-blue-600 hover:bg-blue-700 text-white"
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                onClick={isLoading ? undefined : onCancel}
            ></div>

            <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 space-y-4 animate-[scaleIn_0.2s_ease-out]">
                <h2 className="font-bold text-lg text-gray-900">{title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

                <div className="flex justify-end gap-3 pt-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 flex items-center gap-2 min-w-[100px] justify-center ${confirmBtnStyles[variant]}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang xử lý...</span>
                            </>
                        ) : confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}