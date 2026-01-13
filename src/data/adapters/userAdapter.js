export const userAdapter = (data) => {
    console.log("🛠️ Adapter đang xử lý data:", data);

    if (!data) {
        console.warn("Adapter nhận data null/undefined");
        return null;
    }

    const result = {
        id: data.id || data._id, // Ưu tiên id, nếu không có thì lấy _id
        username: data.username || "Unknown",
        email: data.email || "",
        role: data.role || "user",
        avatar: data.avatar || "",
        avatarInitial: data.username ? data.username[0].toUpperCase() : "?",
        roleLabel: (data.role || "user").charAt(0).toUpperCase() + (data.role || "user").slice(1),
    };

    console.log("✅ Kết quả Adapter:", result);
    return result;
};