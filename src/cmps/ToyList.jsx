import { ToyPreview } from './ToyPreview.jsx'

export function ToyList({ toys, onRemove, isAdmin }) {
    return (
        <section className="grid">
            {toys.map(t => (
                <ToyPreview key={t._id} toy={t} onRemove={onRemove} isAdmin={isAdmin} />
            ))}
        </section>
    )
}
