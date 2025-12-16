import React from 'react'

type ButtonContactProps = {
    profilePicture: string,
    contact: string,
    onClick: () => void,
    isSelected: boolean
}

export default function ButtonContact({ profilePicture, contact, onClick, isSelected }: ButtonContactProps) {
    return (
        <>
            <button className={isSelected ? "bg-purple-100 rounded-4xl ease-in-out duration-200" : "bg-transparent ease-in-out duration-200"} data-tip="Settings" onClick={onClick}>
                <div className="avatar m-2 w-10">
                    <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                        <img src={profilePicture} />
                    </div>
                </div>
                <div className='flex-col w-full truncate px-4'>
                    <p className='text-black font-bold'>{contact}</p>
                    {/* <p className='text-black/70'>{p}</p> */}
                </div>
            </button>
        </>
    )
}
