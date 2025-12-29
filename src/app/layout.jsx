import { AuthProvider } from '../context/AuthContext';
import LightboxViewer from '@/components/share/Lightbox';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />

        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-D2v7dFpC9zOvM2mYVNl5xBlHfZjbxN+Nxzu3biYQYkZ9WYxQIr05o2N8SVD2jQi4cYjC2Kqk+wQgD8zO3Gm7hQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="app-grid">
        <AuthProvider>
          {children}
          <LightboxViewer />
        </AuthProvider>
      </body>
    </html>
  );
}


