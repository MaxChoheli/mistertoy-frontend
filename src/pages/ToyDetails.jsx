import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { toyService } from '../services/toy.service.js'

export function ToyDetails() {
    const params = useParams()
    const [toy, setToy] = React.useState(null)

    React.useEffect(() => {
        toyService.getById(params.toyId).then(setToy)
    }, [params.toyId])

    if (!toy) return <section className="container">Loading…</section>

    const date = new Date(toy.createdAt)
    const dateStr = date.toLocaleDateString()

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
                </div>
            </div>
        </section>
    )
}
