import { useState, useMemo } from "react";

export function useCategoryDetailFilters(cards) {
    const [searchText, setSearchText] = useState("");

    const filteredCards = useMemo(() => {
        if (!cards) return [];

        return cards.filter(card => {
            return card.title.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [cards, searchText]);

    return {
        searchText, setSearchText,
        filteredCards
    };
}