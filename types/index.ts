export interface IUser {
    _id: string;
    username: string;
    email?: string;
    profilePicture?: string;
    name?: string;
}

export interface IMessage {
    _id: string;
    conversationId: string;
    sender: IUser | string;
    receiver: IUser | string;
    text: string;
    createdAt: string;
}

export interface IConversation {
    _id: string;
    participants: (IUser | string)[];
    lastMessage?: IMessage | string;
    lastMessageAt?: string;
}
