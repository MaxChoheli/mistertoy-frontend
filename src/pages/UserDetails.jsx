import React from 'react'
import { useParams } from 'react-router-dom'
import { httpService } from '../services/http.service.js'
import { reviewService } from '../services/review.service.js'

export function UserDetails() {
    const { userId } = useParams()
    const [user, setUser] = React.useState(null)
    const [reviews, setReviews] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        let isActive = true
        setLoading(true)
        setError('')
        Promise.all([
            httpService.get(`user/${userId}`),
            reviewService.query({ userId })
        ])
            .then(([u, r]) => {
                if (!isActive) return
                setUser(u)
                setReviews(r)
            })
            .catch(() => {
                if (!isActive) return
                setError('Failed to load user')
            })
            .finally(() => {
                if (!isActive) return
                setLoading(false)
            })
        return () => { isActive = false }
    }, [userId])

    if (loading) return <section className="container">Loading…</section>
    if (error) return <section className="container">{error}</section>
    if (!user) return <section className="container">User not found</section>

    return (
        <section className="container">
            <h2>{user.fullname}</h2>
            <h3>Reviews</h3>
            <ul>
                {reviews.map(r => (
                    <li key={r._id}>
                        <em>{r.toy?.name}</em>: {r.txt}
                    </li>
                ))}
                {!reviews.length && <li>No reviews yet.</li>}
            </ul>
        </section>
    )
}
