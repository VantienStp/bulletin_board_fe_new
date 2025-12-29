export const isCardActive = (card) => {
    if (!card) return false;

    const now = new Date();
    const startDate = card.startDate ? new Date(card.startDate) : new Date(0);
    const endDate = card.endDate ? new Date(card.endDate) : null;

    // Kiểm tra thứ (0: Chủ Nhật, 6: Thứ Bảy)
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    // Điều kiện thời gian
    const isWithinTime = startDate <= now && (!endDate || endDate >= now);

    // Điều kiện ngày hành chính
    const isWorkDayOk = !(card.isWorkDaysOnly && isWeekend);

    return isWithinTime && isWorkDayOk;
};