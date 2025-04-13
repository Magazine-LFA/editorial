// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth')?.value

  if (request.nextUrl.pathname === '/login' && authCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (request.nextUrl.pathname === '/admin' && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/login'],
}
