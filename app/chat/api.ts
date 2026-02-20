import axios from "axios"

export type Participants = {
    _id: string,
    username: string,
    profilePicture?: string | null
}

export const fetchConversationParticipants = async (userId?: string) => {
    if (!userId) return []
    const response = await axios.get('/api/conversation/chat-message/list', { params: { userId: userId } })
    return response.data.uniqueParticipants
}

export const sendMessage = async (conversationId: string, sender: string, receiver: string, text: string) => {
    if(!conversationId || !sender || !receiver) return null

    const response = await axios.post('/api/conversation/message/send', {
        conversationId,
        sender,
        receiver,
        text
    })

    return response.data.message
}

export const addUserConversation = async (myUserId: string, targetUsername: string) => {
    await axios.post('/api/conversation/add-user-conversation', {
        myUserId: myUserId,
        targetUsername: targetUsername
    })
        .then((response) => {
            return response.data
        })
}

export const fetchConversation = async (myUserId: string, targetId: string) => {
    if (!myUserId || !targetId) return null

    const response = await axios.post('/api/conversation/get-user-conversation', {
        myUserId,
        targetId
    })

    return response.data.conversation._id
}

export const fetchProfilePicture = async (serverUserId: string) => {
    try {
        const response = await axios.get(`/api/avatar/update-profile-picture?userId=${serverUserId}`);
        return response.data.profilePicture
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
};