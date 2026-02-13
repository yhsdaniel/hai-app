import { connect } from "@/config/mongodb";
import User from "@/config/schema/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

connect()

export async function POST(req: NextRequest) {
    const reqBody = await req.json()
    const { email, password } = reqBody

    try {
        const existUser = await User.findOne({ email })

        if(!existUser){
            return NextResponse.json({ error: 'Your account not found' }, { status: 403 })
        }

        const isMatchPassword = await bcrypt.compare(password, existUser.password)

        if(!isMatchPassword){
            return NextResponse.json({ error: 'Incorrect email / password' }, { status: 403 })
        }

        // const payload = {
        //     id: existUser.id,
        //     username: existUser.username
        // }

        // const token = jwt.sign(payload, 'thisismysecretkey', {
        //     expiresIn: '7d'
        // })

        const sessionId = crypto.randomUUID();

        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                id: existUser.id,
                username: existUser.username,
                email: existUser.email,
            }),
            "EX",
            60 * 60 * 24 * 7 // 7 days
        )

        const response = NextResponse.json({ message: 'Login success' })

        // set cookie
        response.cookies.set("session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })  

        return response
        
    } catch (error) {
        //Handle any unexpected errors
        return NextResponse.json({ error: 'Request login failed' }, { status: 500 })
    }
}