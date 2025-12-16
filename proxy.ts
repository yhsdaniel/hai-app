import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret })
    
    if(!token){
        if(pathname.match(/^\/chat/)){
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    if(token && (pathname === '/login' || pathname === '/register')){
        return NextResponse.redirect(new URL('chat', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/register', '/chat'],
}
