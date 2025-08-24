import React from 'react'

export function Chat() {
    const [msgs, setMsgs] = React.useState([])
    const [txt, setTxt] = React.useState('')

    function send(input) {
        const clean = input.trim()
        if (!clean) return
        const me = { id: crypto.randomUUID?.() || String(Date.now()), by: 'me', txt: clean, at: Date.now() }
        setMsgs(prev => [...prev, me])
        setTxt('')
        setTimeout(() => {
            const bot = { id: 'bot-' + Date.now(), by: 'bot', txt: 'bother someone who cares', at: Date.now() }
            setMsgs(prev => [...prev, bot])
        }, 600)
    }

    return (
        <div className="chat">
            <ul className="chat-list">
                {msgs.map(m => (
                    <li key={m.id} className={'chat-msg ' + m.by}>
                        <span className="chat-bubble">{m.txt}</span>
                    </li>
                ))}
            </ul>
            <form className="chat-input" onSubmit={e => { e.preventDefault(); send(txt) }}>
                <input
                    className="input"
                    placeholder="Say something…"
                    value={txt}
                    onChange={e => setTxt(e.target.value)}
                    aria-label="Chat input"
                />
                <button className="btn primary" type="submit">Send</button>
            </form>
        </div>
    )
}
