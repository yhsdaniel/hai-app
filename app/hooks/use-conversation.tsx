import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { scrolltoBottom } from "./use-scrollBottom";
import { IMessage } from "@/types";

export function useConversation(
    userLogin?: string,
    receiverId?: string,
    socketRef?: React.MutableRefObject<any>,
    scrollRef?: React.RefObject<HTMLDivElement | null>
) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadConversation = useCallback(async () => {
        if (!userLogin || !receiverId) return;
        setIsLoading(true);
        try {
            const res = await axios.post('/api/conversation/get-user-conversation', {
                myUserId: userLogin,
                targetId: receiverId
            });

            const convoId = res.data.conversation?._id;
            if (!convoId) {
                setMessages([]);
                return;
            }

            const msgRes = await axios.get(`/api/conversation/message/${convoId}`);
            setMessages(msgRes.data.messages);

            setTimeout(() => scrolltoBottom(scrollRef), 100);
        } catch (error) {
            console.error("Failed to load conversation", error);
        } finally {
            setIsLoading(false);
        }
    }, [userLogin, receiverId, scrollRef]);

    const sendMessage = async (text: string) => {
        if (!userLogin || !receiverId || !text.trim()) return;

        try {
            const convoRes = await axios.post('/api/conversation/get-user-conversation', {
                myUserId: userLogin,
                targetId: receiverId
            });
            const conversationId = convoRes.data.conversation._id;

            const res = await axios.post('/api/conversation/message/send', {
                conversationId,
                sender: userLogin,
                receiver: receiverId,
                text
            });

            const message = res.data.message;

            socketRef?.current?.emit('send_message', {
                to: receiverId,
                message,
                conversationId
            });

            setMessages(prev => [...prev, message]);
            setTimeout(() => scrolltoBottom(scrollRef), 100);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    useEffect(() => {
        loadConversation();
    }, [loadConversation]);

    return {
        messages,
        setMessages,
        sendMessage,
        isLoading
    };
}
