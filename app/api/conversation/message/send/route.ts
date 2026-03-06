import { connect } from "@/config/mongodb";
import Message from "@/config/schema/message";
import Conversation from "@/config/schema/conversation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { conversationId, sender, receiver, text } = await req.json();

        if (!conversationId || !sender || !receiver || !text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Create message
        const message = await Message.create({
            conversationId,
            sender,
            receiver,
            text
        });

        // 2. Update conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            lastMessageAt: new Date()
        });

        return NextResponse.json({ message });
    } catch (error: any) {
        console.error("SEND_MESSAGE_ERROR", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
