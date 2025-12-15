"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function DeleteModal({
    open,
    title = "Delete Item",
    message = "Hành động này không thể hoàn tác.",
    onCancel,
    onConfirm,
}) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "");
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white w-[90%] max-w-sm rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="font-semibold text-lg">{title}</h2>
                <p className="text-gray-600 text-sm">{message}</p>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
