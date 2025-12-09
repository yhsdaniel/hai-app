import Conversation from "@/config/schema/conversation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { userId, targetUser } = await req.json()
        if (!userId) {
            return NextResponse.json({ error: 'Missing userId query parameter' }, { status: 400 })
        }

        let conversation = await Conversation.findOne({
            participants: { $all: { userId, targetUser } }
        })
        .populate("participants", "username profilePicture")
        .populate("lastMessage")

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId, targetUser],
                lastMessage: null,
                lastMessageAt: new Date()
            })
        }

        return NextResponse.json({ conversation })
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}