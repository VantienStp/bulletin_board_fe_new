import { useState, useMemo } from "react";

export function useLayoutFilters(layouts) {
    const [searchText, setSearchText] = useState("");

    const filteredLayouts = useMemo(() => {
        if (!layouts) return [];

        return layouts.filter(layout => {
            // Tìm kiếm trong Title hoặc Slug
            return (
                layout.title.toLowerCase().includes(searchText.toLowerCase()) ||
                layout.slug.toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [layouts, searchText]);

    return {
        searchText, setSearchText,
        filteredLayouts
    };
}