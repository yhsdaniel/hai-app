'use client'

import { ImagePlus, LogOut, MessageCirclePlus, Settings, User } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import ContactList from '../components/ContactList';
import ChatInput from '../components/ChatInput';
import axios from 'axios';
import { io } from 'socket.io-client';
import ChatMessage from '../components/ChatMessage';
import toast from 'react-hot-toast';
import SkeletonLoader from '../components/ui/skeleton-loader';
import { CldUploadWidget } from 'next-cloudinary';
import UploadImage from '@/lib/upload-image';
import ModalAddUser from '../components/ModalAddUser';
import Avatar from './Avatar';

type Props = {
    initialParticipants: any[],
    initialMessages: any[],
    serverUser: any
}

export default function ChatClient({ initialParticipants, initialMessages, serverUser }: Props) {
    const router = useRouter()
    const ref = useRef<HTMLDivElement | null>(null)
    const socketRef = useRef<any>(null)
    const userLogin = serverUser?.id
    const [participants, setParticipants] = useState<any[]>(initialParticipants || [])
    const [messages, setMessages] = useState<any[]>(initialMessages || [])
    const [currentContact, setCurrentContact] = useState(0)

    const scrollToBottom = () => {
        if (ref.current) {
            (ref.current as HTMLDivElement).scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    const handleSend = async (text: string) => {
        let conversationId = messages.length > 0 ? messages[0].conversationId : null;
        const receiver = participants[currentContact]?._id;
        if (!receiver || !userLogin) return;

        if (!conversationId) {
            const createRes = await axios.post('/api/conversation/create', {
                user1: userLogin,
                user2: receiver
            });
            conversationId = createRes.data.conversation._id;
        }
        try {
            const res = await axios.post('/api/conversation/message/send', {
                conversationId,
                sender: userLogin,
                receiver,
                text
            });
            const message = res.data.message;
            socketRef.current.emit('send_message', {
                to: receiver,
                message,
                conversationId: conversationId
            })
            setMessages(prev => [...prev, message]);
        } catch (error) {
            console.log(error)
        }
    };

    const submitParticipants = (e: any) => {
        e.preventDefault();
        const val = (e.currentTarget.elements.namedItem('username') as any)?.value;
        if (val) {
            const newParticipant = {
                _id: `tmp-${Date.now()}`,
                username: val,
                profilePicture: null
            };
            setParticipants(prev => Array.isArray(prev) ? [...prev, newParticipant] : [newParticipant]);
            (document.getElementById('my_modal_1') as HTMLDialogElement | null)?.close()
        }
    }

    useEffect(() => {
        if (!userLogin) return;

        socketRef.current = io('http://localhost:4000', {
            query: { userId: userLogin },
            transports: ['websocket']
        })
        socketRef.current.connect()
        const receiveHandler = (msg: any) => {
            setMessages(prev => [...prev, msg]); // immutable update -> re-render
        };
        socketRef.current.on('receive_message', receiveHandler)
        return () => {
            socketRef.current.off("receive_message", receiveHandler);
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, [userLogin]);

    useEffect(() => {
        const loadConversation = async () => {
            const target = participants[currentContact]?._id;
            if (!target || !userLogin) return;
            const res = await axios.post('/api/conversation/get-user-conversation', {
                myUserId: userLogin,
                targetId: target
            })
            const convoId = res.data.conversation?._id;
            if (!convoId) {
                setMessages([]);
                return;
            }

            const msgRes = await axios.get(`/api/conversation/message/${convoId}`)
            setMessages(msgRes.data.messages);
        };
        loadConversation()
        scrollToBottom()
    }, [currentContact, participants, messages.length, userLogin]);

    useEffect(() => {
        scrollToBottom()
    }, [messages.length])

    return (
        <>
            <div className="drawer lg:drawer-open bg-white/80">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <nav className="navbar w-full bg-white/80 text-black border-b-2 border-gray-200 px-4 h-16 gap-4">
                        <div className="avatar">
                            <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                                <img src={`https://ui-avatars.com/api/?name=${participants[currentContact]?.username}&background=random&color=white`} />
                            </div>
                        </div>
                        <div className="px-4 font-bold">{participants[currentContact]?.username}</div>
                    </nav>
                    <div className="h-[calc(100vh-130px)] w-full p-2 overflow-y-scroll flex flex-col">
                        {messages.length !== 0 && messages.map((msg: any, index: number) => (
                            <ChatMessage key={msg._id} msg={msg} index={index} userLogin={userLogin} />
                        ))}
                        <div ref={ref}></div>
                    </div>
                    <ChatInput onSend={handleSend} />
                </div>
                <aside className="drawer-side min-h-screen flex flex-col pr-4 border-r-2 border-gray-200 bg-white text-black w-80 p-4 overflow-hidden">
                    <Avatar serverUser={serverUser} />
                    <div className='w-full flex items-center justify-between h-11 mb-4'>
                        <h1 className='text-xl font-bold'>HAIAPP</h1>
                        <button
                            className='btn btn-primary btn-circle cursor-pointer'
                            onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement | null)?.showModal()}
                        >
                            <MessageCirclePlus />
                        </button>
                    </div>
                    <nav className="menu relative w-full grow overflow-y-auto py-2">
                        <ul>
                            <Suspense fallback={<SkeletonLoader />}>
                                <ContactList
                                    participants={participants}
                                    current={currentContact}
                                    onChoose={setCurrentContact}
                                />
                            </Suspense>
                        </ul>
                    </nav>
                </aside>
            </div>

            <ModalAddUser submitParticipants={submitParticipants} />
        </>
    )
}
