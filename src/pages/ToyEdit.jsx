import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toyService } from '../services/toy.service.js'
import { useToyStore } from '../app/store.jsx'

export function ToyEdit() {
    const params = useParams()
    const navigate = useNavigate()
    const { saveToy } = useToyStore()
    const [toy, setToy] = React.useState(toyService.getEmptyToy())
    const [labels, setLabels] = React.useState(toyService.getLabels())
    const toyId = params.toyId

    React.useEffect(() => {
        if (!toyId) return
        toyService.getById(toyId).then(t => {
            if (!t) return
            setToy(JSON.parse(JSON.stringify(t)))
        })
    }, [toyId])

    function onSubmit(e) {
        e.preventDefault()
        saveToy(toy).then(() => navigate('/toy'))
    }

    function onChange(field, val) {
        setToy(prev => ({ ...prev, [field]: val }))
    }

    return (
        <section className="container">
            <form className="card" onSubmit={onSubmit}>
                <h2>{toyId ? 'Edit Toy' : 'Add Toy'}</h2>
                <input className="input" placeholder="Name" value={toy.name} onChange={e => onChange('name', e.target.value)} />
                <input className="input" type="number" placeholder="Price" value={toy.price} onChange={e => onChange('price', Number(e.target.value))} />
                <input className="input" placeholder="Image URL" value={toy.imgUrl} onChange={e => onChange('imgUrl', e.target.value)} />
                <label className="row" style={{ marginTop: 8 }}>
                    <input type="checkbox" checked={toy.inStock} onChange={e => onChange('inStock', e.target.checked)} />
                    <span>In stock</span>
                </label>
                <label style={{ marginTop: 8 }}>Labels</label>
                <select
                    className="select"
                    multiple
                    value={toy.labels}
                    onChange={e => {
                        const opts = Array.from(e.target.options)
                        const next = opts.filter(o => o.selected).map(o => o.value)
                        onChange('labels', next)
                    }}
                >
                    {labels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <div className="row" style={{ marginTop: 12 }}>
                    <button className="btn primary" type="submit">Save</button>
                    <button className="btn" type="button" onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </form>
        </section>
    )
}
