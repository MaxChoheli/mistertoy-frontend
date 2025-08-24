import { ToyPreview } from './ToyPreview.jsx'

export function ToyList({ toys, onRemove }) {
    return (
        <section className="grid">
            {toys.map(t => <ToyPreview key={t._id} toy={t} onRemove={onRemove} />)}
        </section>
    )
}
