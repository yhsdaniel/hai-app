import { connect } from "@/config/mongodb";
import Conversation from "@/config/schema/conversation";
import User from "@/config/schema/user";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(req: NextRequest) {
    const reqBody = await req.json()
    const { myUserId, targetId } = reqBody
    try {
        console.log(myUserId, targetId)
        // Find user target
        const targetUser = await User.findOne({ _id: targetId })

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

        return NextResponse.json({
            conversation: conversation
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}