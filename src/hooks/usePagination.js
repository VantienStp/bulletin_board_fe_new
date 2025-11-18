"use client";
import { useState, useEffect } from "react";

export default function usePagination(data = [], itemsPerPage = 5) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const goToPage = (p) =>
        setCurrentPage(() => Math.min(Math.max(p, 1), totalPages));

    const ensureValidPage = () => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    };

    useEffect(() => {
        ensureValidPage();
    }, [data.length]);

    return {
        currentPage,
        totalPages,
        paginatedData,
        goPrev,
        goNext,
        goToPage,
        ensureValidPage,
    };
}
