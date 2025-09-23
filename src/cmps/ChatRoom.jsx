import { useEffect, useRef, useState } from 'react'
import { socket } from '../services/socket.service'
import { httpService } from '../services/http.service'

export function ChatRoom({ toyId, user }) {
    const [msgs, setMsgs] = useState([])
    const [txt, setTxt] = useState('')
    const [typing, setTyping] = useState(null)
    const typingRef = useRef(null)

    useEffect(() => {
        socket.emit('room:join', toyId)
        socket.on('chat:new', onNew)
        socket.on('chat:typing', ({ user, isTyping }) => setTyping(isTyping ? user : null))
        return () => {
            socket.off('chat:new', onNew)
            socket.off('chat:typing')
        }
    }, [toyId])

    useEffect(() => {
        loadHistory()
    }, [toyId])

    function onNew(m) { setMsgs(prev => [...prev, m]) }

    async function loadHistory() {
        const toy = await httpService.get(`toy/${toyId}`)
        const history = Array.isArray(toy.msgs) ? toy.msgs : []
        setMsgs(history)
    }

    function emitTyping(isTyping) {
        socket.emit('chat:typing', { room: toyId, user: user.fullname || user.username, isTyping })
    }

    async function send() {
        if (!txt.trim()) return
        const msg = { txt, fullname: user.fullname || user.username }
        await httpService.post(`toy/${toyId}/msg`, { txt })
        setTxt('')
    }

    function onChange(e) {
        setTxt(e.target.value)
        if (typingRef.current) clearTimeout(typingRef.current)
        emitTyping(true)
        typingRef.current = setTimeout(() => emitTyping(false), 800)
    }

    return (
        <div className="chat-room">
            <div className="msgs">
                {msgs.map(m => (
                    <div key={m.id || m.createdAt}>
                        <b>{m.fullname || m.by || 'user'}:</b> {m.txt}
                    </div>
                ))}
                {typing && <div className="typing">{typing} is typing…</div>}
            </div>
            <div className="compose">
                <input value={txt} onChange={onChange} placeholder="Type a message" />
                <button onClick={send}>Send</button>
            </div>
        </div>
    )
}
