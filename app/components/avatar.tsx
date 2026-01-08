'use client'

import UploadImage from '@/lib/upload-image'
import { LogOut, Settings, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Avatar({ serverUser, profilePicture }: { serverUser: any, profilePicture: string }) {
    const router = useRouter();

    const handleSignOut = () => {
        signOut({ redirect: false }).then(() => {
            toast.success('Logout successful')
            router.push('/login')
        })
    }

    return (
        <div className='w-full flex-center flex-col flex-nowrap gap-4 mb-4'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='text-md text-black font-bold'>My Profile</h1>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn rounded-full m-1 gap-2 bg-purple-50 hover:bg-purple-200">
                        <div className="avatar">
                            <div className="size-7 rounded-full ring-1">
                                <img src={profilePicture ? profilePicture : `https://ui-avatars.com/api/?name=${serverUser?.username}&background=random&color=white`} />
                            </div>
                        </div>
                        {serverUser?.username}
                    </div>
                    <ul tabIndex={-1} className="dropdown-content menu absolute bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
                        <li>
                            <div className="drawer-content">
                                <label htmlFor="my-drawer-5" className="drawer-button flex gap-2">
                                    <User className='w-4' />
                                    Profile
                                </label>
                            </div>
                        </li>
                        <li>
                            <div className="drawer-content">
                                <label htmlFor="my-drawer-6" className="drawer-button flex gap-2">
                                    <Settings className='w-4' />
                                    Settings
                                </label>
                            </div>
                        </li>
                        <li onClick={handleSignOut}><div>
                            <LogOut className='w-4' />
                            Logout
                        </div></li>
                    </ul>
                </div>
            </div>
            <div className="avatar">
                <UploadImage serverUser={serverUser} />
                <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                    <img src={profilePicture ? profilePicture : `https://ui-avatars.com/api/?name=${serverUser?.username}&background=random&color=white`} />
                </div>
            </div>
            <p className='text-black text-md font-bold'>@{serverUser?.username}</p>
        </div>
    )
}
