import { useEffect, useRef, useState } from 'react'
import { addUserConversation, fetchConversation, fetchConversationParticipants } from '../chat/api'
import toast from 'react-hot-toast'

export default function UseChat(user?: { id?: string }) {
    const [participants, setParticipants] = useState<any[]>([])
    const [currentContact, setCurrentContact] = useState<number>(0)
    const [messages, setMessages] = useState<string[]>([])

    const loadParticipants = async () => {
        try {
            const list = await fetchConversationParticipants(user?.id)
            setParticipants(list)
        } catch (error) {
            console.error(error)
        }
    }

    const addParticipant = async (username: string) => {
        if (!user?.id) {
            return
        }
        try {
            await addUserConversation(user?.id, username)
            toast.success('New user added!')
            await loadParticipants()
        } catch (error) {
            console.error(error)
            toast.error('Could not add user.')
        }
    }

    const getMessageFromUserSelected = async (userId: string, username: string) => {
        if (!user?.id) {
            return
        }
        try {
            const conversationId = await fetchConversation(userId, username)
            return conversationId
        } catch (error) {
            console.error(error)
            toast.error('Could not add user.')
        }
    }

    useEffect(() => {
        if (!user?.id) return
        loadParticipants()
    }, [user?.id])

    return {
        participants,
        currentContact,
        setCurrentContact,
        messages,
        setMessages,
        addParticipant,
        getMessageFromUserSelected,
        reload: loadParticipants
    }
}
