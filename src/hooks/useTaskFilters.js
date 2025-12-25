import { useState, useMemo } from "react";
import { selectTasks } from "@/data/adapters/taskSelectors";

export function useTaskFilters() {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({
        status: [],
        priority: [],
        assignees: [],
        tags: [],
    });

    const toggleFilter = (type, value) => {
        setFilters(prev => {
            const exists = prev[type].includes(value);
            return {
                ...prev,
                [type]: exists
                    ? prev[type].filter(v => v !== value)
                    : [...prev[type], value],
            };
        });
    };

    const clearFilters = () => setFilters({ status: [], priority: [], assignees: [], tags: [] });

    // Dùng useMemo để chỉ tính toán lại khi searchText hoặc filters thực sự thay đổi
    const filteredTasks = useMemo(() => {
        return selectTasks({
            searchText,
            ...filters
        });
    }, [searchText, filters]);

    return {
        searchText, setSearchText,
        filters, toggleFilter, clearFilters,
        filteredTasks
    };
}