import { io } from 'socket.io-client'

const base = import.meta.env.DEV
    ? 'http://localhost:3030'
    : (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL)

export const socket = io(base, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    path: '/socket.io'
})
