'use server'

import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import ChatClient from "./chat-client"
import { connect } from "@/config/mongodb"
import Conversation from "@/config/schema/conversation"
import Message from "@/config/schema/message"


export default async function ChatPage() {
    const session = await getServerSession(authOptions)

    if(!session?.user?.id) {
        redirect('/login')
    }

    await connect()

    //load conversations for this user
    const userId = String(session?.user?.id)
    const conversation = await Conversation.find({
        participants: userId
    })
        .populate('participants', 'username profilePicture')
        .populate('lastMessage')
        .sort({ lastMessageAt: -1 })

    // build unique participants list (excluding self)
    const participantsMap: Record<string, any> = {}
    conversation.forEach((convo) => {
        convo.participants.forEach((p: any) => {
            const pid = String(p._id)
            if (pid !== userId) participantsMap[pid] = p
        })
    })

    const initialParticipants = Object.values(participantsMap).map((p: any) => ({
        _id: String(p._id),
        username: p.username,
        profilePicture: p.profilePicture ?? null
    }))

    // pick first conversation to preload messages (if any)
    let initialMessage: any[] = []
    if(conversation.length > 0) {
        const firstConvo = conversation[0]
        const msgs = await Message.find({ conversationId: firstConvo._id })
            .sort({ createdAt: 1 })
            .populate('sender', 'username profilePicture')
            .populate('receiver', 'username profilePicture')
        
        initialMessage = msgs.map((m: any) => ({
            _id: String(m._id),
            conversationId: String(m.conversationId),
            text: m.text,
            createdAt: m.createdAt ? m.createdAt.toISOString() : null,
            sender: m.sender ? {
                _id: String(m.sender._id),
                username: m.sender.username,
                profilePicture: m.sender.profilePicture ?? null
            } : null,
            receiver: m.receiver ? {
                _id: String(m.receiver._id),
                username: m.receiver.username,
                profilePicture: m.receiver.profilePicture ?? null
            } : null
        }))
    }

    // plain server user object (avoid passing objects with toJSON)
    const serverUserPlain = {
        id: String(session.user?.id),
        username: session.user?.username ?? session.user?.name ?? null,
        name: session.user?.name ?? null,
        email: session.user?.email ?? null,
        image: session.user?.image ?? null
    }

    return (
        <ChatClient 
            initialParticipants={initialParticipants}
            initialMessages={initialMessage}
            serverUser={serverUserPlain}
        />
    )
}