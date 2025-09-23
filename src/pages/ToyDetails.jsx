import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { toyService } from '../services/toy.service.js'
import { NicePopup } from '../cmps/NicePopup.jsx'
import { userService } from '../services/user.service.js'
import { reviewService } from '../services/review.service.js'
import { ChatRoom } from '../cmps/ChatRoom.jsx'

export function ToyDetails() {
    const params = useParams()
    const [toy, setToy] = React.useState(null)
    const [isChatOpen, setIsChatOpen] = React.useState(false)
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
                {toy.imgUrl && (
                    <img
                        src={toy.imgUrl}
                        alt={toy.name}
                        style={{ maxWidth: 320, display: 'block', marginTop: 8 }}
                    />
                )}
                <div className="badges" style={{ marginTop: 8 }}>
                    {Array.isArray(toy.labels) &&
                        toy.labels.map((l) => (
                            <span key={l} className="badge">
                                {l}
                            </span>
                        ))}
                </div>

                <div className="row" style={{ marginTop: 12 }}>
                    <Link className="btn" to="/toy">
                        Back
                    </Link>
                </div>

                <div className="row" style={{ marginTop: 12 }}>
                    {isAdmin && (
                        <Link className="btn" to={`/toy/edit/${toy._id}`}>
                            Edit
                        </Link>
                    )}
                    <button
                        className="btn"
                        onClick={() => setIsChatOpen(true)}
                        aria-label="Open chat"
                    >
                        💬 Chat
                    </button>
                </div>

                <div style={{ marginTop: 24 }}>
                    <h3>Reviews</h3>
                    <ul>
                        {reviews.map((r) => (
                            <li key={r._id}>
                                <strong>{r.user?.fullname || 'User'}</strong>: {r.txt}
                            </li>
                        ))}
                    </ul>
                    {user ? (
                        <form onSubmit={onAddReview} style={{ marginTop: 12 }}>
                            <input
                                value={reviewTxt}
                                onChange={(e) => setReviewTxt(e.target.value)}
                                placeholder="Write a review"
                                required
                            />
                            <button className="btn" style={{ marginLeft: 8 }}>
                                Add Review
                            </button>
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
                footing={
                    <button className="btn" onClick={() => setIsChatOpen(false)}>
                        Close
                    </button>
                }
            >
                {user ? (
                    <ChatRoom toyId={toy._id} user={user} />
                ) : (
                    <p style={{ margin: 0 }}>Please log in to join the chat.</p>
                )}
            </NicePopup>
        </section>
    )
}
