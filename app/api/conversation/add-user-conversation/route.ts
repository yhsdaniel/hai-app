import { connect } from "@/config/mongodb";
import Conversation from "@/config/schema/conversation";
import User from "@/config/schema/user";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { myUserId, targetUsername } = await req.json();

        if (!myUserId || !targetUsername) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const targetUser = await User.findOne({ username: targetUsername });
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (targetUser._id.toString() === myUserId) {
            return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 });
        }

        const participantIds = [myUserId, targetUser._id.toString()].sort();
        const cacheKey = `conversations:${participantIds[0]}:${participantIds[1]}`;

        let conversation = await Conversation.findOne({
            participants: { $all: participantIds },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: participantIds
            });
        }

        await redis.set(cacheKey, JSON.stringify(conversation), "EX", 86400);

        return NextResponse.json({
            message: "Chat ready",
            conversation,
            user: {
                _id: targetUser._id,
                username: targetUser.username,
                profilePicture: targetUser.profilePicture
            }
        });
    } catch (error: any) {
        console.error("ADD_CONVERSATION_ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}