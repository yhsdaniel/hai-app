'use client'

import { LogOut, MessageCirclePlus, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import ContactList from '../components/ContactList';
import ChatInput from '../components/ChatInput';
import axios from 'axios';
import { io } from 'socket.io-client';
import ChatMessage from '../components/ChatMessage';
import toast from 'react-hot-toast';

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

    const handleSignOut = () => {
        signOut({ redirect: false }).then(() => {
            toast.success('Logout successful')
            router.push('/login')
        })
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

    console.log(participants);

    return (
        <>
            <div className="drawer lg:drawer-open bg-white/80">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <nav className="navbar w-full bg-white/80 text-black">
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
                <div className="drawer-side pr-4 border-r-2 border-gray-300 bg-white text-black w-80 p-4 overflow-hidden">
                    <div className='w-full flex items-center justify-between h-11 mb-4'>
                        <h1 className='text-xl font-bold'>HAIAPP</h1>
                        <button
                            className='btn btn-primary btn-circle cursor-pointer'
                            onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement | null)?.showModal()}
                        >
                            <MessageCirclePlus />
                        </button>
                    </div>
                    <ul className="menu relative w-full h-[calc(100%-100px)] overflow-y-auto py-2">
                        <ContactList
                            participants={participants}
                            current={currentContact}
                            onChoose={setCurrentContact}
                        />
                    </ul>
                    <div className='h-14 w-full flex items-center justify-center'>
                        <div className="w-full dropdown dropdown-top">
                            <div tabIndex={0} role="button" className="btn btn-primary w-full rounded-4xl">{serverUser?.username}</div>
                            <ul tabIndex={-1} className="dropdown-content menu border border-gray-300 bg-white text-black rounded-xl z-20 w-full py-2 shadow-sm">
                                <li className='list-item'><a><User />Profile</a></li>
                                <li className='list-item'><a><Settings />Settings</a></li>
                                <li className='list-item' onClick={() => handleSignOut()}><a><LogOut />Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-white text-black shadow-md shadow-purple-300">
                    <h3 className="font-bold text-lg">Who are chat do you want ?</h3>
                    <form onSubmit={submitParticipants}>
                        <input
                            name="username"
                            className="my-4 p-2 w-full border border-violet-300 focus:border-violet-600 focus:ring-0 outline-none rounded-xl"
                            placeholder="Username / Name"
                        />
                        <button type="submit" className="btn btn-primary rounded-3xl float-right">Add to chat</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}
