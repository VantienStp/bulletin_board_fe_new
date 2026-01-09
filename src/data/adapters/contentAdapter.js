import { BASE_URL } from "@/lib/api";

// Helper private để xử lý URL
const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

export const contentAdapter = (data) => {
    if (!data) return null;

    return {
        // 🔥 QUAN TRỌNG: Tạo ID giả nếu server chưa trả về _id
        // Giúp React phân biệt được các item khi xóa/sửa
        id: data._id || data.id || `temp-${Math.random().toString(36).substr(2, 9)}`,

        type: data.type || "image",
        url: data.url || "",
        description: data.description || "",
        qrCode: data.qrCode || "",

        // Các trường đã xử lý để hiển thị (Display)
        fullUrl: getFullUrl(data.url),
        qrCodeUrl: getFullUrl(data.qrCode),

        // Check loại để render UI
        isImage: data.type === "image",
        isVideo: data.type === "video",
        isPdf: data.type === "pdf",
    };
};