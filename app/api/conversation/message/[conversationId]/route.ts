import { connect } from "@/config/mongodb"
import Message from "@/config/schema/message"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
    const { conversationId } = await params

    if(!conversationId) {
        return NextResponse.json({ error: "Missing conversationId" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return NextResponse.json({ error: "Invalid conversationId" }, { status: 400 })
    }

    try {
        await connect()
        const messages = await Message.find({ conversationId: conversationId.toString() })
            .sort({ createdAt: 1 })
            .populate("sender", "username profilePicture")
            .populate("receiver", "username profilePicture")
    
        return NextResponse.json({ messages })
    } catch (error) {
        console.log(error)
    }
}
