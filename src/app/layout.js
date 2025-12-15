import { AuthProvider } from '../context/AuthContext';
import LightboxViewer from '@/components/share/Lightbox'; // 👈 nhớ import đúng path



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

          {/* 👇 Lightbox luôn nằm ở DOM để lắng nghe event */}
          <LightboxViewer />



        </AuthProvider>
      </body>
    </html>
  );
}
