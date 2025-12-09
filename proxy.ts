import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret })

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/register'],
}
