import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { toyService } from '../services/toy.service.js'
import { NicePopup } from '../cmps/NicePopup.jsx'
import { Chat } from '../cmps/Chat.jsx'

export function ToyDetails() {
    const params = useParams()
    const [toy, setToy] = React.useState(null)
    const [isChatOpen, setIsChatOpen] = React.useState(false)

    React.useEffect(() => {
        toyService.getById(params.toyId).then(setToy)
    }, [params.toyId])

    if (!toy) return <section className="container">Loading…</section>

    const dateStr = new Date(toy.createdAt).toLocaleDateString()

    return (
        <section className="container">
            <div className="card">
                <h2>{toy.name}</h2>
                <div>Price: {toy.price}</div>
                <div>Status: {toy.inStock ? 'In stock' : 'Out of stock'}</div>
                <div>Created: {dateStr}</div>
                {toy.imgUrl && <img src={toy.imgUrl} alt={toy.name} style={{ maxWidth: 320, display: 'block', marginTop: 8 }} />}
                <div className="badges" style={{ marginTop: 8 }}>
                    {toy.labels.map(l => <span key={l} className="badge">{l}</span>)}
                </div>
                <div className="row" style={{ marginTop: 12 }}>
                    <Link className="btn" to="/toy">Back</Link>
                    <Link className="btn" to={`/toy/edit/${toy._id}`}>Edit</Link>
                    <button className="btn" onClick={() => setIsChatOpen(true)} aria-label="Open chat">💬 Chat</button>
                </div>
            </div>

            <NicePopup
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                heading={`Chat about "${toy.name}"`}
                footing={<button className="btn" onClick={() => setIsChatOpen(false)}>Close</button>}
            >
                <Chat />
            </NicePopup>
        </section>
    )
}
