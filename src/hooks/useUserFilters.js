import { useState, useMemo } from "react";

export function useUserFilters(users) {
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState({
        role: []
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

    const clearFilters = () => setFilters({ role: [] });

    const filteredUsers = useMemo(() => {
        if (!users) return [];

        return users.filter(user => {
            const lowerSearch = searchText.toLowerCase();
            const matchesSearch =
                user.username.toLowerCase().includes(lowerSearch) ||
                user.email.toLowerCase().includes(lowerSearch);

            const matchesRole = filters.role.length === 0 || filters.role.includes(user.role);

            return matchesSearch && matchesRole;
        });
    }, [users, searchText, filters]);

    return {
        searchText, setSearchText,
        filters, toggleFilter, clearFilters,
        filteredUsers
    };
}