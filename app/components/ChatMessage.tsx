import { motion } from "framer-motion";

type ChatProps = {
    msg: {
        _id: string,
        text: string,
        sender: { _id: string },
        receiver: { _id: string },
    },
    index: number,
    userLogin: string,
}

export default function ChatMessage({ msg, index, userLogin }: ChatProps) {
    return (
        <>
            {
                msg?.receiver?._id === userLogin ? (
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
                : msg?.sender?._id === userLogin ? (
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
