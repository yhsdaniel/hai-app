import axios from "axios"
import { useState } from "react"

export type Participant = {
    _id: string,
    username: string,
    profilePicture?: string
}

export function useParticipants(
    initialParticipants: Participant[],
    userLogin?: string
){
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants || [])
    const [currentContact, setCurrentContact] = useState<number>(0)

    const activeParticipant = participants[currentContact]?._id;

    const addParticipant = async (username: string) => {
        if(!userLogin) return;

        try {
            const res = await axios.post('/api/conversation/add-user-conversation', {
                myUserId: userLogin,
                targetUsername: username,
            });

            const { user } = res.data

            setParticipants((prev) => 
                prev.some(p => p._id === user._id) ? prev : [...prev, user]
            )
        } catch (error) {
            console.log(error)
        } 
    }

    return {
        participants,
        currentContact,
        setCurrentContact,
        activeParticipant,
        addParticipant
    }
}