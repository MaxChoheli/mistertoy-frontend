import { Link } from 'react-router-dom'

export function ToyPreview({ toy, onRemove }) {
    return (
        <article className="card product">
            <div className="product-media">
                {toy.imgUrl ? <img src={toy.imgUrl} alt={toy.name} /> : <div className="placeholder">No Image</div>}
            </div>
            <div className="product-body">
                <h3 className="product-title">{toy.name}</h3>
                <div className="product-meta">
                    <span className="price">${toy.price}</span>
                    <span className={'stock ' + (toy.inStock ? 'in' : 'out')}>{toy.inStock ? 'In stock' : 'Out of stock'}</span>
                </div>
                <div className="badges">
                    {Array.isArray(toy.labels) ? toy.labels.map(l => <span key={l} className="badge">{l}</span>) : null}
                </div>
                <div className="row product-actions">
                    <Link className="btn" to={`/toy/${toy._id}`}>Details</Link>
                    <Link className="btn" to={`/toy/edit/${toy._id}`}>Edit</Link>
                    <button className="btn danger" onClick={() => onRemove(toy._id)}>Delete</button>
                </div>
            </div>
        </article>
    )
}
