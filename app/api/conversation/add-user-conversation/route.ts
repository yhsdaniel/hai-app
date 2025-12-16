import { connect } from "@/config/mongodb";
import Conversation from "@/config/schema/conversation";
import User from "@/config/schema/user";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { myUserId, targetUsername } = reqBody

        // Find user target
        const targetUser = await User.findOne({ username: targetUsername })

        if (!targetUser) {
            return NextResponse.json({ error: 'Username not found' }, { status: 404 })
        }

        if (targetUser._id.toString() === myUserId) {
            return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 });
        }

        const participantIds = [myUserId, targetUser._id.toString()];
        participantIds.sort();

        let conversation = await Conversation.findOne({
            participants: participantIds,
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: participantIds
            });
        }

        return NextResponse.json({
            message: "Chat ready",
            conversation: conversation,
            user: targetUser
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}