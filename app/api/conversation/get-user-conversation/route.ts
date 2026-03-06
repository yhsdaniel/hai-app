import { connect } from "@/config/mongodb";
import Conversation from "@/config/schema/conversation";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { myUserId, targetId } = await req.json();

        if (!myUserId || !targetId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Sort IDs to ensure consistent cache keys and queries
        const participantIds = [myUserId, targetId].sort();
        const cacheKey = `conversations:${participantIds[0]}:${participantIds[1]}`;

        // 1. Try Cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return NextResponse.json({
                conversation: typeof cached === 'string' ? JSON.parse(cached) : cached
            });
        }

        // 2. Fallback to DB
        const conversation = await Conversation.findOne({
            participants: { $all: participantIds }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // 3. Update Cache
        await redis.set(cacheKey, JSON.stringify(conversation), "EX", 86400);

        return NextResponse.json({ conversation });
    } catch (error: any) {
        console.error("GET_CONVERSATION_ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}