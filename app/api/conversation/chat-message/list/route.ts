import Conversation from "@/config/schema/conversation"
import User from "@/config/schema/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId')
        if (!userId) {
            return NextResponse.json({ error: 'Missing userId query parameter' }, { status: 400 })
        }

        const conversation = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'username profilePicture')

        const participantMap: Record<string, any> = {};

        conversation.forEach(convo => {
            convo.participants.forEach((p: any) => {
                const pid = String(p._id);
                if (pid !== userId) {
                    participantMap[pid] = p;
                }
            });
        });

        const uniqueParticipants = Object.values(participantMap);

        return NextResponse.json({ uniqueParticipants })
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}