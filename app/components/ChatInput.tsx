import { SendHorizontal } from 'lucide-react'
import React, { FormEvent, useState } from 'react'

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
    const [input, setInput] = useState('')
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        onSend(input.trim())
        setInput('')
    }
    return (
        <form onSubmit={handleSubmit} className='mt-auto flex items-center gap-2 p-2'>
            <input
                type="text"
                placeholder="Type your message here ..."
                className="input rounded-2xl flex-1 bg-transparent text-black/80 border border-gray-300 focus:border-black/80 focus:ring-0 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button 
                className='btn btn-md btn-circle btn-primary text-white rounded-full flex items-center justify-center cursor-pointer' 
                type="submit"
            >
                <SendHorizontal />
            </button>
        </form>
    )
}
