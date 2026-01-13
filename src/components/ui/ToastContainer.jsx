"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ToastContainer({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted
        ? createPortal(
            <div className="fixed top-5 right-5 z-[9999] flex flex-col items-end pointer-events-none">
                <div className="pointer-events-auto">
                    {children}
                </div>
            </div>,
            document.body
        )
        : null;
}