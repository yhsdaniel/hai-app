import { connect } from "@/config/mongodb";
import User from "@/config/schema/user";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { userId, profilePicture } = reqBody;
        
        const userCollection = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });

        if (!userCollection) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify({ message: "Profile picture updated successfully", user: userCollection }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }   
        const user = await User.findById(userId).select('profilePicture');
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ profilePicture: user.profilePicture }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}