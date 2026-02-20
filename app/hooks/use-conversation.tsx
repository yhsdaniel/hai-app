import axios from "axios"
import { useEffect, useState } from "react"
import { scrolltoBottom } from "./use-scrollBottom"
import redis from "@/lib/redis"

export type Message = {
    _id: string
    conversationId: string
    sender: string
    receiver: string
    text: string
}

export function useConversation(
    userLogin?: string,
    receiverId?: string,
    socketRef?: any,
    ref?: any
) {
    const [messages, setMessages] = useState<Message[]>([])

    const sendMessage = async (text: string) => {
        if (!userLogin || !receiverId) return
        
        try {
            // GETTING ID FROM CONVERSATION API
            const conversationId = await axios.post('/api/conversation/get-user-conversation', {
                myUserId: userLogin,
                targetId: receiverId
            })
            const idForConversation = conversationId.data.conversation._id

            // SEND MESSAGE API
            const res = await axios.post('/api/conversation/message/send', {
                conversationId: idForConversation,
                sender: userLogin,
                receiver: receiverId,
                text
            })
            const message = res.data.message
            // SOCKET FOR SEND MESSAGE
            socketRef?.current?.emit('send_message', {
                to: receiverId,
                message,
                conversationId
            })
    
            setMessages(prev => [...prev, message])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userLogin || !receiverId) return

        const loadConversation = async () => {
            const res = await axios.post('/api/conversation/get-user-conversation', {
                myUserId: userLogin,
                targetId: receiverId
            })

            const convoId = res.data.conversation?._id
            if (!convoId) {
                setMessages([])
                return
            }

            const msgRes = await axios.get(`/api/conversation/message/${convoId}`)
            setMessages(msgRes.data.messages)
        }

        loadConversation()
        scrolltoBottom(ref)
    }, [userLogin, receiverId, messages.length])

    return {
        messages,
        setMessages,
        sendMessage
    }
}