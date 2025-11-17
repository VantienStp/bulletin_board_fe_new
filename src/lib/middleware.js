import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("refresh_token")?.value; // hoặc accessToken nếu dùng cookie
    const { pathname } = req.nextUrl;

    console.log("Middleware check:", { pathname, token, }, "chao em anh dung day tu chieu");

    // Nếu chưa đăng nhập mà vào /admin thì redirect
    if (!token && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
