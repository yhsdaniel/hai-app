import { connect } from "@/config/mongodb";
import Conversation from "@/config/schema/conversation";
import User from "@/config/schema/user";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(req: NextRequest) {
    const reqBody = await req.json()
    const { myUserId, targetId } = reqBody
    try {
        // Find user target
        // const targetUser = await User.findOne({ _id: targetId })

        // if (!targetUser) {
        //     return NextResponse.json({ error: 'Username not found' }, { status: 404 })
        // }
    
        // if (targetUser._id.toString() === myUserId) {
        //     return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 });
        // }

        // // GET FROM DB
        // const participantIds = [myUserId, targetUser._id.toString()];
        // participantIds.sort();

        // let conversationIds = await Conversation.findOne({
        //     participants: participantIds,
        // });
        const participantsIds = [myUserId, targetId]

        // GET FROM REDIS
        const conversation = await redis.get(`conversations:${participantsIds[0]}:${participantsIds[1]}`)

        if(!conversation) {
            return NextResponse.json({ error: 'Conversation not found in cache ' }, { status: 404 })
        }

        return NextResponse.json({
            conversation: JSON.parse(conversation)
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}