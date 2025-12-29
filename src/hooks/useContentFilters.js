import { useState, useMemo } from "react";

export function useContentFilters(contents) {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({
        type: [] // image, video, pdf
    });

    const toggleFilter = (key, value) => {
        setFilters(prev => {
            const current = prev[key] || [];
            return {
                ...prev,
                [key]: current.includes(value)
                    ? current.filter(v => v !== value)
                    : [...current, value]
            };
        });
    };

    const clearFilters = () => setFilters({ type: [] });

    const filteredContents = useMemo(() => {
        if (!contents) return [];

        return contents.filter(c => {
            // 1. Search (Tìm trong mô tả hoặc URL)
            const lowerSearch = searchText.toLowerCase();
            const matchesSearch =
                (c.description || "").toLowerCase().includes(lowerSearch) ||
                (c.url || "").toLowerCase().includes(lowerSearch);

            // 2. Filter by Type
            const matchesType = filters.type.length === 0 || filters.type.includes(c.type);

            return matchesSearch && matchesType;
        });
    }, [contents, searchText, filters]);

    return {
        searchText, setSearchText,
        filters, toggleFilter, clearFilters,
        filteredContents
    };
}