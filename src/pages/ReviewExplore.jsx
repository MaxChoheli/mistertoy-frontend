import React from 'react'
import { reviewService } from '../services/review.service.js'

export function ReviewExplore() {
    const [reviews, setReviews] = React.useState([])
    const [txt, setTxt] = React.useState('')

    React.useEffect(() => { load() }, [txt])

    async function load() {
        const r = await reviewService.query({ txt })
        setReviews(r)
    }

    return (
        <section className="container">
            <h2>All Reviews</h2>
            <input value={txt} onChange={e => setTxt(e.target.value)} placeholder="Filter reviews" />
            <ul style={{ marginTop: 12 }}>
                {reviews.map(r => (
                    <li key={r._id}>
                        <strong>{r.user?.fullname}</strong> on <em>{r.toy?.name}</em>: {r.txt}
                    </li>
                ))}
            </ul>
        </section>
    )
}
