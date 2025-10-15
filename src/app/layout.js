// src/app/layout.js
import "@fortawesome/fontawesome-free/css/all.min.css";

import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Bản tin',
  description: 'Trang thông tin Toà Án',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-grid">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
