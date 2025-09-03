import React from 'react'
import { Link } from 'react-router-dom'
import { toyService } from '../services/toy.service.js'
import { ToyList } from '../cmps/ToyList.jsx'
import { ToyFilter } from '../cmps/ToyFilter.jsx'

export function ToyIndex() {
    const [toys, setToys] = React.useState([])
    const [filterBy, setFilterBy] = React.useState({ txt: '', inStock: undefined, labels: [], sortBy: 'name', sortDir: 1 })

    function load() {
        toyService.query(filterBy).then(setToys)
    }

    React.useEffect(() => {
        load()
    }, [filterBy])

    function onRemove(id) {
        toyService.remove(id).then(load)
    }

    return (
        <>
            <section className="filters-bar">
                <div className="container filters-inner">
                    <div className="page-heading">
                        <h1 className="page-title">Toys</h1>
                        <span className="result-count">{toys.length}</span>
                    </div>
                    <div className="actions">
                        <Link className="btn primary" to="/toy/edit">Add Toy</Link>
                    </div>
                    <ToyFilter value={filterBy} onChange={setFilterBy} />
                </div>
            </section>

            <section className="store-section">
                <div className="container">
                    <div className="product-grid">
                        <ToyList toys={toys} onRemove={onRemove} />
                    </div>
                </div>
            </section>
        </>
    )
}
