import { motion } from "framer-motion";
import { IMessage, IUser } from "@/types";

type ChatProps = {
    msg: IMessage,
    index: number,
    userLogin: string,
}

const getUserId = (user: IUser | string) => {
    return typeof user === 'string' ? user : user._id;
};

export default function ChatMessage({ msg, index, userLogin }: ChatProps) {
    const senderId = getUserId(msg.sender);
    const receiverId = getUserId(msg.receiver);

    return (
        <>
            {
                receiverId === userLogin ? (
                    <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="chat chat-start"
                    >
                        <div className="chat-header text-black">
                            <time className="text-xs opacity-50">2 hours ago</time>
                        </div>
                        <div className="chat-bubble bg-gray-600 text-white">
                            {msg?.text}
                        </div>
                    </motion.div>
                )
                    : senderId === userLogin ? (
                        <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="chat chat-end"
                        >
                            <div className="chat-header">
                                <time className="text-xs opacity-50">2 hours ago</time>
                            </div>
                            <div className="chat-bubble bg-violet-500 text-white">{msg?.text}</div>
                            <div className="chat-footer text-gray-800">Seen</div>
                        </motion.div>
                    ) : null
            }
        </>
    )
}
