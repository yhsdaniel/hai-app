'use client'

import UploadImage from '@/lib/upload-image'
import axios from 'axios';
import { LogOut, Settings, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function Avatar({ serverUser }: { serverUser: any }) {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const router = useRouter();

    const handleSignOut = () => {
        signOut({ redirect: false }).then(() => {
            toast.success('Logout successful')
            router.push('/login')
        })
    }

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const response = await axios.get(`/api/user/update-profile-picture?userId=${serverUser?.id}`);
                const profilePicture = response.data.profilePicture
                setProfilePicture(profilePicture)
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };
        fetchProfilePicture();
    }, [profilePicture, serverUser?.id])

    return (
        <div className='w-full flex-center flex-col flex-nowrap gap-4 mb-4'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='text-md text-black font-bold'>My Profile</h1>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-primary rounded-full m-1 gap-2">
                        <div className="avatar">
                            <div className="size-7 rounded-full ring-1">
                                <img src={profilePicture ? profilePicture : `https://ui-avatars.com/api/?name=${serverUser?.username}&background=random&color=white`} />
                            </div>
                        </div>
                        {serverUser?.username}
                    </div>
                    <ul tabIndex="-1" className="dropdown-content menu absolute bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
                        <li><a>
                            <User className='w-4' />
                            Profile
                        </a></li>
                        <li><a>
                            <Settings className='w-4' />
                            Settings
                        </a></li>
                        <li onClick={handleSignOut}><a>
                            <LogOut className='w-4' />
                            Logout
                        </a></li>
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
