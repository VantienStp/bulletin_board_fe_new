// src/context/CartContext.js
'use client'; 

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    // Khởi tạo trạng thái giỏ hàng từ Local Storage
    const [cartItems, setCartItems] = useState([]);
    
    // ⭐ 1. Tải Giỏ hàng từ Local Storage khi Component mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // ⭐ 2. Đồng bộ Giỏ hàng với Local Storage khi trạng thái thay đổi
    useEffect(() => {
        // Chỉ lưu khi cartItems không phải là mảng rỗng ban đầu (để tránh ghi đè lúc khởi tạo)
        if (cartItems.length > 0 || localStorage.getItem('cartItems')) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Hàm thêm sản phẩm vào giỏ
    const addItem = (product) => {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(item => item._id === product._id);

            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                return currentItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Nếu chưa tồn tại, thêm mới với số lượng là 1
                return [...currentItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Hàm xóa sản phẩm khỏi giỏ (giảm số lượng hoặc xóa hẳn)
    const removeItem = (productId) => {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(item => item._id === productId);

            if (existingItem.quantity === 1) {
                // Nếu số lượng là 1, xóa hẳn sản phẩm khỏi giỏ
                return currentItems.filter(item => item._id !== productId);
            } else {
                // Nếu số lượng lớn hơn 1, chỉ giảm số lượng
                return currentItems.map(item =>
                    item._id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
        });
    };
    
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }

    // Tính tổng số lượng và tổng tiền
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, totalQuantity, totalPrice, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom Hook để sử dụng Context
export const useCart = () => useContext(CartContext);