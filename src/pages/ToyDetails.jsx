import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { toyService } from '../services/toy.service.js'
import { NicePopup } from '../cmps/NicePopup.jsx'
import { Chat } from '../cmps/Chat.jsx'
import { userService } from '../services/user.service.js'
import { httpService } from '../services/http.service.js'
import { reviewService } from '../services/review.service.js'

export function ToyDetails() {
    const params = useParams()
    const [toy, setToy] = React.useState(null)
    const [isChatOpen, setIsChatOpen] = React.useState(false)
    const [msgTxt, setMsgTxt] = React.useState('')
    const [reviews, setReviews] = React.useState([])
    const [reviewTxt, setReviewTxt] = React.useState('')
    const user = userService.getLoggedinUser()
    const isAdmin = !!user?.isAdmin

    React.useEffect(() => {
        loadToy()
        loadReviews()
    }, [params.toyId])

    async function loadToy() {
        const t = await toyService.getById(params.toyId)
        setToy(t)
    }

    async function loadReviews() {
        const list = await reviewService.query({ toyId: params.toyId })
        setReviews(list)
    }

    async function onAddMsg(ev) {
        ev.preventDefault()
        if (!msgTxt.trim()) return
        await httpService.post(`toy/${params.toyId}/msg`, { txt: msgTxt.trim() })
        setMsgTxt('')
        await loadToy()
    }

    async function onAddReview(ev) {
        ev.preventDefault()
        if (!reviewTxt.trim()) return
        await reviewService.add({ toyId: params.toyId, txt: reviewTxt.trim() })
        setReviewTxt('')
        await loadReviews()
    }

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
                    {Array.isArray(toy.labels) && toy.labels.map(l => <span key={l} className="badge">{l}</span>)}
                </div>

                <div className="row" style={{ marginTop: 12 }}>
                    <Link className="btn" to="/toy">Back</Link>
                </div>

                {user && (
                    <form onSubmit={onAddMsg} style={{ marginTop: 12 }}>
                        <input
                            value={msgTxt}
                            onChange={e => setMsgTxt(e.target.value)}
                            placeholder="Write a message"
                            required
                        />
                        <button className="btn" style={{ marginLeft: 8 }}>Add Comment</button>
                    </form>
                )}

                <div className="row" style={{ marginTop: 12 }}>
                    {isAdmin && <Link className="btn" to={`/toy/edit/${toy._id}`}>Edit</Link>}
                    <button className="btn" onClick={() => setIsChatOpen(true)} aria-label="Open chat">💬 Chat</button>
                </div>

                <div style={{ marginTop: 16 }}>
                    <h3>Messages</h3>
                    <ul>
                        {(toy.msgs || []).map(m => (
                            <li key={m.id}>
                                <strong>{m.fullname || m.by || 'User'}</strong>: {m.txt}
                            </li>
                        ))}
                    </ul>
                    {!user && <p>Login to add a message.</p>}
                </div>

                <div style={{ marginTop: 24 }}>
                    <h3>Reviews</h3>
                    <ul>
                        {reviews.map(r => (
                            <li key={r._id}>
                                <strong>{r.user?.fullname || 'User'}</strong>: {r.txt}
                            </li>
                        ))}
                    </ul>
                    {user ? (
                        <form onSubmit={onAddReview} style={{ marginTop: 12 }}>
                            <input
                                value={reviewTxt}
                                onChange={e => setReviewTxt(e.target.value)}
                                placeholder="Write a review"
                                required
                            />
                            <button className="btn" style={{ marginLeft: 8 }}>Add Review</button>
                        </form>
                    ) : (
                        <p>Login to add a review.</p>
                    )}
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
