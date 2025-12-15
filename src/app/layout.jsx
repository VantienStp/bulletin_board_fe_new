import { AuthProvider } from '../context/AuthContext';
import LightboxViewer from '@/components/share/Lightbox';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-grid">
        <AuthProvider>
          {children}
          <LightboxViewer />
        </AuthProvider>
      </body>
    </html>
  );
}


