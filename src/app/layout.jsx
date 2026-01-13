import { Roboto_Condensed } from "next/font/google";
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from "@/context/ToastContext";

const roboto = Roboto_Condensed({
	subsets: ["vietnamese", "latin"],
	weight: ["300", "400", "700"],
	display: "swap",
	variable: "--font-roboto",
});

export default function RootLayout({ children }) {
	return (
		<html lang="vi">
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
				/>
			</head>

			<body className={`app-grid ${roboto.className}`}>
				<ToastProvider>
					<AuthProvider>
						{children}
					</AuthProvider>
				</ToastProvider>
			</body>
		</html>
	);
}