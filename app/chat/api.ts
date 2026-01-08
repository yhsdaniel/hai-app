import axios from "axios"

export type Participants = {
    id: string,
    username: string,
    profilePicture?: string | null
}

export const fetchConversationParticipants = async (userId?: string) => {
    if (!userId) return []
    const response = await axios.get('/api/conversation/chat-message/list', { params: { userId: userId } })
    return response.data.uniqueParticipants
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

export const fetchConversation = async (myUserId?: string, targetUsername?: string) => {
    if (!myUserId) return null

    const response = await axios.post('/api/conversation/get-user-conversation', {
        myUserId,
        targetUsername
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