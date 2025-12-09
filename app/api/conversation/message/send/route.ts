import Message from "@/config/schema/message"
import Conversation from "@/config/schema/conversation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const reqBody = await req.json()
    const { conversationId, sender, receiver, text } = reqBody

    if (!conversationId || !sender || !receiver || !text) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // create message
    const message = await Message.create({
        conversationId,
        sender,
        receiver,
        text
    })

    // update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastMessageAt: new Date()
    }).sort({ createdAt: -1 })

    return NextResponse.json({ message })
}
