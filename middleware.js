import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // 1. Lấy cả 2 token (để tránh bị đá ra khi Access Token hết hạn nhưng Refresh Token còn)
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const isAuthenticated = !!accessToken || !!refreshToken;

    const isAuthPage = pathname.startsWith("/login");
    const isAdminPage = pathname.startsWith("/admin");

    // 2. LOGIC CHẶN & ĐIỀU HƯỚNG
    if (isAdminPage && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthPage && isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    const response = NextResponse.next();

    if (isAdminPage) {
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};