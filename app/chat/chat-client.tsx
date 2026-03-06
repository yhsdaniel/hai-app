'use client'

import { MessageCirclePlus } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'

import ContactList from '../components/contact-list'
import ChatInput from '../components/chat-input'
import ChatMessage from '../components/chat-message'
import SkeletonLoader from '../components/ui/skeleton-loader'
import ModalAddUser from '../components/modal-add-user'
import Avatar from '../components/avatar'
import ProfileSettings from '../components/profile-settings'
import Settings from '../components/setting'

import { fetchProfilePicture } from './api'
import { useChatSocket } from '../hooks/use-chat-socket'
import { useParticipants } from '../hooks/use-participants'
import { useConversation } from '../hooks/use-conversation'
import { scrolltoBottom } from '../hooks/use-scrollBottom'
import ChatWrapper from '../components/chat-wrapper'

type Props = {
    initialParticipants: any[]
    initialMessages: any[]
    serverUser: any
}

export default function ChatClient({
    initialParticipants,
    serverUser
}: Props) {
    const userLogin = serverUser?.id
    const [profilePicture, setProfilePicture] = useState('')
    const ref = useRef<HTMLDivElement | null>(null)
    const socketRef = useChatSocket(userLogin, msg => {
        setMessages(prev => [...prev, msg])
    })

    const {
        participants,
        currentContact,
        setCurrentContact,
        activeParticipant,
        addParticipant
    } = useParticipants(initialParticipants, userLogin)

    const {
        messages,
        setMessages,
        sendMessage,
        isLoading
    } = useConversation(userLogin, activeParticipant, socketRef, ref)

    useEffect(() => {
        if (!isLoading) {
            scrolltoBottom(ref)
        }
    }, [messages.length, isLoading])

    useEffect(() => {
        if (!serverUser?.id) return
        fetchProfilePicture(serverUser.id).then(setProfilePicture)
    }, [serverUser?.id])

    return (
        <>
            <div className="drawer lg:drawer-open bg-white/80">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                {/* Left Side */}
                <aside className="drawer-side min-h-screen flex flex-col pr-4 border-r-2 border-gray-200 bg-white text-black w-80 p-4 overflow-hidden">
                    <Avatar serverUser={serverUser} profilePicture={profilePicture} />

                    <div className="w-full flex items-center justify-between h-11 mb-4">
                        <h1 className="text-xl font-bold">HAIAPP</h1>
                        <button
                            className="btn btn-primary btn-circle cursor-pointer"
                            onClick={() =>
                                (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal()
                            }
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

                {/* Right Side / Chat Section */}
                <ChatWrapper
                    participants={!participants[currentContact]}
                    profilePicture={participants[currentContact]?.profilePicture}
                    username={participants[currentContact]?.username}
                >
                    <div className="w-full h-[calc(100vh-120px)] p-2 overflow-y-scroll grow bg-gray-50">
                        {isLoading ? (
                            <div className="flex flex-col gap-4 p-4">
                                <SkeletonLoader />
                                <SkeletonLoader />
                                <SkeletonLoader />
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <ChatMessage
                                        key={msg._id}
                                        msg={msg}
                                        index={i}
                                        userLogin={userLogin}
                                    />
                                ))}
                                <div ref={ref}></div>
                            </>
                        )}
                    </div>

                    <ChatInput onSend={sendMessage} />
                </ChatWrapper>

                {/* ============= MODAL SETTINGS AND PROFILE ======= */}
                <ProfileSettings serverUser={serverUser} profilePicture={profilePicture} />
                <Settings />
            </div>

            <ModalAddUser
                submitParticipants={async (e, username) => {
                    e.preventDefault()
                    await addParticipant(username)
                        ; (document.getElementById('my_modal_1') as HTMLDialogElement)?.close()
                }}
            />
        </>
    )
}