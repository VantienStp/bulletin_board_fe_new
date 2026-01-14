import { BASE_URL } from "@/lib/api";

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

export const contentAdapter = (data) => {
    if (!data) return null;

    const images = Array.isArray(data.images)
        ? data.images.map(img => getFullUrl(img))
        : [];

    return {
        id: data._id || data.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
        type: data.type || "image",
        url: data.url || "",
        description: data.description || "",
        qrCode: data.qrCode || "",
        externalLink: data.externalLink || "",

        images: images,

        fullUrl: getFullUrl(data.url),
        qrCodeUrl: getFullUrl(data.qrCode),

        isImage: data.type === "image",
        isVideo: data.type === "video",
        isPdf: data.type === "pdf",
    };
};