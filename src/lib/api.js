export const API_BASE_URL = 'http://localhost:5000/api'; 
export const BASE_URL = 'http://localhost:5000'; 


export async function fetchAllProducts() {
    console.log('Fetching products from:', `${API_BASE_URL}/products`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            cache: 'no-store', 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('❌ Error in fetchAllProducts:', error);
        throw new Error('Không thể kết nối đến Backend hoặc lỗi dữ liệu.');
    }
}

export async function loginUser(username, password) {
    const response = await fetch(`${API_BASE_URL}/users/login`, { // ⭐ Thay đổi endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
    }
    return data;
}

export async function createProduct(productData, token) {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Lỗi: Không được phép tạo sản phẩm.');
    }
    return result;
}

export async function fetchProductById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`❌ Error fetching product ${id}:`, error);
        throw new Error('Không thể tải chi tiết sản phẩm.');
    }
}

export async function placeOrder(orderData, token) {
    const response = await fetch(`${API_BASE_URL}/orders`, { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderData),
    });

    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || 'Lỗi khi đặt hàng từ Server.');
    }
    
    return result; 
}

export async function fetchMyOrders(token) {
    const response = await fetch(`${API_BASE_URL}/orders/myorders`, { 
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}` 
        },
        cache: 'no-store' // Đảm bảo luôn fetch dữ liệu mới nhất
    });

    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || 'Lỗi khi tải lịch sử đơn hàng.');
    }
    
    return result; 
}

export async function getOrderDetails(orderId, token) {
    console.log("token   :", token)
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Lỗi khi lấy chi tiết đơn hàng.');
    }
    return result;
}

export async function getPayPalClientId() {
    const response = await fetch(`${API_BASE_URL}/config/paypal`, { method: 'GET' });
    const result = await response.text(); 
    if (!response.ok) {
        throw new Error('Lỗi khi lấy PayPal Client ID.');
    }
    return result;
}

export async function payOrder(orderId, paymentResult, token) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentResult),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Lỗi khi cập nhật trạng thái thanh toán.');
    }
    return result;
}



// ========================= CARDS =========================
export async function fetchAllCards() {
    const response = await fetch(`${API_BASE_URL}/cards`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi lấy danh sách cards');
    return result;
}

export async function fetchCardById(id) {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi lấy chi tiết card');
    return result;
}

export async function fetchCardsByCategory(categoryId) {
    const response = await fetch(`${API_BASE_URL}/cards/category/${categoryId}`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi lấy cards theo category');
    return result;
}

export async function createCard(cardData, token) {
    const response = await fetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cardData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi tạo card');
    return result;
}

export async function updateCard(id, cardData, token) {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cardData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi cập nhật card');
    return result;
}

export async function deleteCard(id, token) {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi xóa card');
    return result;
}

// ========================= CATEGORIES =========================
export async function fetchAllCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi lấy danh sách categories');
    return result;
}

export async function fetchCategoryById(id) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi lấy chi tiết category');
    return result;
}

export async function createCategory(categoryData, token) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi tạo category');
    return result;
}

export async function updateCategory(id, categoryData, token) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi cập nhật category');
    return result;
}

export async function deleteCategory(id, token) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi xóa category');
    return result;
}

// ========================= GRIDLAYOUTS =========================
export async function fetchAllGridLayouts() {
    const response = await fetch(`${API_BASE_URL}/gridLayouts`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi lấy danh sách gridLayouts');
    return result;
}

export async function fetchGridLayoutById(id) {
    const response = await fetch(`${API_BASE_URL}/gridLayouts/${id}`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi lấy chi tiết gridLayout');
    return result;
}

export async function createGridLayout(layoutData, token) {
    const response = await fetch(`${API_BASE_URL}/gridLayouts`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(layoutData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi tạo gridLayout');
    return result;
}

export async function updateGridLayout(id, layoutData, token) {
    const response = await fetch(`${API_BASE_URL}/gridLayouts/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(layoutData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi cập nhật gridLayout');
    return result;
}

export async function deleteGridLayout(id, token) {
    const response = await fetch(`${API_BASE_URL}/gridLayouts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lỗi khi xóa gridLayout');
    return result;
}