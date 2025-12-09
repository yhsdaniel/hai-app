import Conversation from "@/config/schema/conversation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { user1, user2 } = await req.json();

        if (!user1 || !user2)
            return NextResponse.json({ error: "Missing participants" }, { status: 400 });

        const participants = [user1, user2].sort();

        let conversation = await Conversation.findOne({ participants });

        if (!conversation) {
            conversation = await Conversation.create({
                participants,
                lastMessage: null,
                lastMessageAt: new Date()
            });
        }

        return NextResponse.json({ conversation });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
