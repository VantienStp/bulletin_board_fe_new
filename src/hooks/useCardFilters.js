import { useState, useMemo } from "react";

export function useCardFilters(cards) {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({
        status: [],
        type: []
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

    const clearFilters = () => setFilters({ status: [], type: [] });

    // Logic lọc dữ liệu
    const filteredCards = useMemo(() => {
        if (!cards) return [];

        return cards.filter(card => {
            // 1. Lọc theo Search Text (Title)
            const matchesSearch = card.title.toLowerCase().includes(searchText.toLowerCase());

            // 2. Lọc theo Status (Live, Pending, Expired)
            const matchesStatus = filters.status.length === 0 || filters.status.includes(card.status);

            // 3. Lọc theo Type (T2-T6, Full)
            const typeLabel = card.isWorkDaysOnly ? "T2-T6" : "Full";
            const matchesType = filters.type.length === 0 || filters.type.includes(typeLabel);

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [cards, searchText, filters]);

    return {
        searchText, setSearchText,
        filters, toggleFilter, clearFilters,
        filteredCards
    };
}