
type ChatWrapperProps = {
    children: React.ReactNode,
    participants: boolean,
    profilePicture: string | undefined,
    username: string
}

export default function ChatWrapper({ children, participants, profilePicture, username }: ChatWrapperProps) {
    return (
        <div className={`${participants && 'hidden'} drawer-content flex flex-col`}>
            <nav className="navbar w-full bg-white/80 text-black border-b-2 border-gray-200 px-4 h-16 gap-4">
                <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                        <img src={profilePicture ? profilePicture : `https://ui-avatars.com/api/?name=${username}&background=random&color=white`} />
                    </div>
                </div>
                <div className="px-4 font-bold">{username}</div>
            </nav>
            {children}
        </div>
    )
}
