import { useState, useMemo } from "react";

export function useLayoutFilters(layouts) {
    const [searchText, setSearchText] = useState("");

    const filteredLayouts = useMemo(() => {
        if (!layouts) return [];

        return layouts.filter(layout => {
            const titleMatch = layout.title?.toLowerCase().includes(searchText.toLowerCase()) || false;
            const slugMatch = layout.slug?.toLowerCase().includes(searchText.toLowerCase()) || false;
            return titleMatch || slugMatch;
        });
    }, [layouts, searchText]);

    return {
        searchText, setSearchText,
        filteredLayouts
    };
}