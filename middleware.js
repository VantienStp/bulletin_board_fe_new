import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("access_token")?.value;

    const isAuthPage = req.nextUrl.pathname.startsWith("/login");

    if (!token) {
        if (!isAuthPage) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    } else {
        if (isAuthPage) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};