export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// export const BASE_URL = "https://bulletin-board-be-new.onrender.com";
export const API_BASE_URL = `${BASE_URL}/api`;
console.log('API_BASE_URL: hahaah', API_BASE_URL);

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

// #region ========================= CARDS ========================= 
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
// #endregion

// #region ========================= CATEGORIES ========================= 
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
// #endregion

// #region ========================= GRIDLAYOUTS ========================= 
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

// #endregion