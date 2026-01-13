export const userAdapter = (data) => {

    if (!data) {
        return null;
    }

    const result = {
        id: data.id || data._id,
        username: data.username || "Unknown",
        email: data.email || "",
        role: data.role || "user",
        avatar: data.avatar || "",
        avatarInitial: data.username ? data.username[0].toUpperCase() : "?",
        roleLabel: (data.role || "user").charAt(0).toUpperCase() + (data.role || "user").slice(1),
    };

    return result;
};