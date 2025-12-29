import { useState, useMemo } from "react";

export function useCategoryFilters(categories) {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({
        layout: [] // Lọc theo Layout ID
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

    const clearFilters = () => setFilters({ layout: [] });

    const filteredCategories = useMemo(() => {
        if (!categories) return [];

        return categories.filter(cat => {
            // 1. Search Text (Tìm trong Title hoặc Description)
            const matchesSearch =
                cat.title.toLowerCase().includes(searchText.toLowerCase()) ||
                cat.description.toLowerCase().includes(searchText.toLowerCase());

            // 2. Filter by Layout
            const matchesLayout = filters.layout.length === 0 || filters.layout.includes(cat.layoutId);

            return matchesSearch && matchesLayout;
        });
    }, [categories, searchText, filters]);

    return {
        searchText, setSearchText,
        filters, toggleFilter, clearFilters,
        filteredCategories
    };
}