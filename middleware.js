import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;

    // Không có token → redirect về /login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // OK → cho chạy tiếp
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"], // chạy cho mọi route con trong /admin
};
