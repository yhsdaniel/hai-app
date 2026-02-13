import redis from "@/lib/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value

    if(session) {
        await redis.del(`session:${session}`)
    }

    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })

    response.cookies.set("session", "", {
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(0)
    })

    return response
}