import axios from "axios"
import { useEffect, useState } from "react"
import { scrolltoBottom } from "./use-scrollBottom"

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

        let conversationId = messages[0]?.conversationId

        if (!conversationId) {
            const createRes = await axios.post('/api/conversation/create', {
                user1: userLogin,
                user2: receiverId
            })
            conversationId = createRes.data.conversation._id
        }
        
        try {
            const res = await axios.post('/api/conversation/message/send', {
                conversationId,
                sender: userLogin,
                receiver: receiverId,
                text
            })
            const message = res.data.message
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