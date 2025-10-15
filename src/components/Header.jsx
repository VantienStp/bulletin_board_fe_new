// src/components/Header.jsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext'; 

export default function Header() {
  const { user, logout } = useAuth(); 
  const { totalQuantity } = useCart(); 

  return (
    <header className="bg-gray-800 p-4 shadow-md">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
          My Commerce
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/products" className="text-white hover:text-gray-300">
            Sản phẩm
          </Link>
          <Link href="/cart" className="text-white hover:text-gray-300 relative">
            🛒 Giỏ hàng
            {totalQuantity > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQuantity}
                </span>
            )}
          </Link>
          
          {user ? (
            <>
              <Link href="/myorders" className="text-white hover:text-gray-300"> 
                Đơn hàng đã đặt
              </Link>
              <span className="text-white font-medium">
                Xin chào, {user.username}
              </span>
              <button 
                onClick={logout}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link href="/login" className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}