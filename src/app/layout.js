import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Bản tin',
  description: 'Trang thông tin Toà Án',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-grid">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
