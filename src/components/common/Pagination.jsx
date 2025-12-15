"use client";

import { useEffect, useRef } from "react";

export default function Pagination({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const containerRef = useRef(null);

    // ===== Không có trang thì không render =====
    // if (totalPages <= 1) return null;

    const scrollToSelf = () => {
        containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // ===== Keyboard navigation =====
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight" && currentPage < totalPages) {
                onPageChange(currentPage + 1);
                scrollToSelf();
            }
            if (e.key === "ArrowLeft" && currentPage > 1) {
                onPageChange(currentPage - 1);
                scrollToSelf();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentPage, totalPages, onPageChange]);

    // ===== Build pages safely =====
    if (totalPages === 0) return null;

    const pages = [];

    // Trang đầu
    pages.push(1);

    // Dấu ...
    if (currentPage > 3) {
        pages.push("...");
    }

    // Các trang xung quanh currentPage
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
            pages.push(i);
        }
    }

    // Dấu ...
    if (currentPage < totalPages - 2) {
        pages.push("...");
    }

    // Trang cuối (tránh trùng)
    if (totalPages !== 1) {
        pages.push(totalPages);
    }

    return (
        <div
            ref={containerRef}
            className="flex justify-center items-center gap-3 mt-6"
        >
            {/* PREVIOUS */}
            <button
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40 mr-10"
                disabled={currentPage === 1}
                onClick={() => {
                    onPageChange(currentPage - 1);
                    scrollToSelf();
                }}
            >
                Previous
            </button>

            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-2">
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-2">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            className={`px-3 py-2 rounded-xl border transition ${currentPage === p
                                ? "bg-yellow-400 border-yellow-500 text-white"
                                : "bg-white border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => {
                                onPageChange(p);
                                scrollToSelf();
                            }}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            {/* NEXT */}
            <button
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40 ml-10"
                disabled={currentPage === totalPages}
                onClick={() => {
                    onPageChange(currentPage + 1);
                    scrollToSelf();
                }}
            >
                Next
            </button>
        </div>
    );
}
