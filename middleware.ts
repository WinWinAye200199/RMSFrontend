import { NextRequest, NextResponse } from "next/server";
import { COOKIE_TOKEN_KEY } from "./constants";

export async function middleware(request: NextRequest) {
    const cookies = request.cookies;

    if (!cookies.has(COOKIE_TOKEN_KEY)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const jwt = cookies.get(COOKIE_TOKEN_KEY)?.value;

    if (!jwt) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/attandances',
        '/',
        '/profile',
        '/settings',
        '/leaves',
        '/payroll',
        '/shifts',
        '/staffs'
    ]
}