import { io } from 'socket.io-client'

const base = import.meta.env.DEV
    ? 'http://localhost:3030'                           // dev: your Node server
    : (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL) // prod: Render backend

export const socket = io(base, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    path: '/socket.io'
})
