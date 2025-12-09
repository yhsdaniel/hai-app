import { connect } from "@/config/mongodb";
import User from "@/config/schema/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

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

        const payload = {
            id: existUser.id,
            username: existUser.username
        }

        const token = jwt.sign(payload, 'thisismysecretkey')
        const cookiesToken = req.cookies.get('token')

        if(!cookiesToken){
            return NextResponse.json({ token }, { status: 200 })
        } else {
            return NextResponse.json({ token }, { status: 200 })
        }
    } catch (error) {
        //Handle any unexpected errors
        return NextResponse.json({ error: 'Request login failed' }, { status: 500 })
    }
}