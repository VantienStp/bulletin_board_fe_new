export const userAdapter = (data) => {
    if (!data) return null;

    return {
        id: data._id,
        username: data.username || "Unknown",
        email: data.email || "",
        role: data.role || "user", // Mặc định là user nếu thiếu

        // Tạo avatar từ chữ cái đầu của username (Viết hoa)
        avatarInitial: data.username ? data.username[0].toUpperCase() : "?",

        // Label hiển thị cho Role (có thể customize màu sắc ở đây nếu thích)
        roleLabel: (data.role || "user").charAt(0).toUpperCase() + (data.role || "user").slice(1),
    };
};