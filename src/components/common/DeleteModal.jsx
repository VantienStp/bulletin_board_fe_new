"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function DeleteModal({
    open,
    title = "Xóa dữ liệu?",
    message = "Hành động này không thể hoàn tác.",
    onCancel,
    onConfirm,
    isLoading
}) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "");
    }, [open]);

    if (!open) return null;

    // Dùng Portal để modal luôn nằm trên cùng bất kể z-index của cha
    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                onClick={isLoading ? undefined : onCancel}
            ></div>

            {/* MODAL CONTENT */}
            <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 space-y-4 animate-[scaleIn_0.2s_ease-out]">
                <h2 className="font-bold text-lg text-gray-900">
                    {title}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3 pt-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang xóa...</span>
                            </>
                        ) : (
                            <span>Xóa ngay</span>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}