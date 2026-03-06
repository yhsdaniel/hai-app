import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useChatSocket(
    userId: string | undefined,
    onReceiveMessage: (msg: any) => void
) {
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!userId) return

        const socket = io(SOCKET_URL, {
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