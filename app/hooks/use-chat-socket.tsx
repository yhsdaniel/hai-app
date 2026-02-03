import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

export function useChatSocket(
    userId: string | undefined,
    onReceiveMessage: (msg: any) => void
) {
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!userId) return

        const socket = io('http://localhost:4000', {
            query: { userId },
            transports: ['websocket'],
            autoConnect: true
        })
        
        socketRef.current = socket

        socket.on('connect', () => {
            console.log("Socket connected: ", socket.id)
        })
        
        socket.on('receive_message', (msg) => {
            onReceiveMessage(msg)
        })

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err)
        })
        
        return () => {
            socket.off('receive_message')
            socket.disconnect()
            socketRef.current = null
        }
    }, [userId, onReceiveMessage])

    return socketRef
}