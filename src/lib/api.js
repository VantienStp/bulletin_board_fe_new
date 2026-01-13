import { authFetch } from "@/lib/auth";
function detectBaseUrl() {
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host.startsWith("192.168.")) {
            return `http://${host}:10000`;
        }
        if (host === "localhost" || host === "127.0.0.1") {
            return "http://localhost:10000";
        }
    }
    return process.env.NEXT_PUBLIC_BASE_URL ||
        "https://bulletin-board-be-new.onrender.com";
}

export const BASE_URL = detectBaseUrl();
export const API_BASE_URL = `${BASE_URL}/api`;

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

export async function createCard(cardData) {
    const response = await authFetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
    });
    if (!response || !response.ok) throw new Error('Lỗi khi tạo card');
    return await response.json();
}

export async function updateCard(id, cardData) {
    const response = await authFetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
    });
    if (!response || !response.ok) throw new Error('Lỗi khi cập nhật card');
    return await response.json();
}

export async function deleteCard(id) {
    const response = await authFetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'DELETE',
    });
    if (!response || !response.ok) throw new Error('Lỗi khi xóa card');
    return await response.json();
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