export const formatCurrency = (amount) => {
    // Đảm bảo amount là số
    const number = Number(amount);
    if (isNaN(number)) {
        return 'N/A'; // Hoặc trả về giá trị mặc định khác
    }
    
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(number);
};