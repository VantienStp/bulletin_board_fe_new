export const cardAdapter = (data) => {
    if (!data) return null;

    const now = new Date();
    const start = data.startDate ? new Date(data.startDate) : new Date();
    const end = data.endDate ? new Date(data.endDate) : null;

    let status = "active";
    if (start > now) status = "pending";
    if (end && end < now) status = "expired";

    return {
        id: data._id,
        title: data.title || "",

        // Giữ raw data để bind vào Form edit
        startDate: data.startDate,
        endDate: data.endDate,
        isWorkDaysOnly: data.isWorkDaysOnly,

        // Data đã format để hiển thị Table
        contentCount: Array.isArray(data.contents) ? data.contents.length : 0,
        startDateDisplay: start.toLocaleDateString("vi-VN"),
        endDateDisplay: end ? end.toLocaleDateString("vi-VN") : "Vĩnh viễn",
        typeLabel: data.isWorkDaysOnly ? "T2-T6" : "Full tuần",

        status: status,
    };
};