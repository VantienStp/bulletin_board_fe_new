export const userAdapter = (data) => {
    if (!data) return null;

    return {
        id: data._id,
        username: data.username || "Unknown",
        email: data.email || "",
        role: data.role || "user",

        avatarInitial: data.username ? data.username[0].toUpperCase() : "?",
        roleLabel: (data.role || "user").charAt(0).toUpperCase() + (data.role || "user").slice(1),
    };
};