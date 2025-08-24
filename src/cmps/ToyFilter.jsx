import React from 'react'
import { toyService } from '../services/toy.service.js'
import { useDebounce } from '../hooks/useDebounce.js'

const ALL_VALUE = '__ALL__'

export function ToyFilter({ value, onChange }) {
    const [txt, setTxt] = React.useState(value.txt || '')
    const [inStock, setInStock] = React.useState(typeof value.inStock === 'undefined' ? '' : String(value.inStock))
    const [labels, setLabels] = React.useState(value.labels || [])
    const [sortBy, setSortBy] = React.useState(value.sortBy || 'name')
    const [sortDir, setSortDir] = React.useState(value.sortDir || 1)

    const debouncedTxt = useDebounce(txt, 300)
    const allLabels = React.useMemo(() => toyService.getLabels(), [])

    React.useEffect(() => {
        const parsedInStock = inStock === '' ? undefined : inStock === 'true'
        onChange({ txt: debouncedTxt, inStock: parsedInStock, labels, sortBy, sortDir })
    }, [debouncedTxt, inStock, labels, sortBy, sortDir])

    function onLabelsChange(e) {
        const selected = Array.from(e.target.selectedOptions).map(o => o.value)
        if (selected.includes(ALL_VALUE) || selected.length === 0) {
            setLabels([]) // empty = disable labels filtering
            return
        }
        setLabels(selected.filter(v => v !== ALL_VALUE))
    }

    return (
        <div className="row filter-controls">
            <input
                className="input search-input"
                placeholder="Search by name"
                value={txt}
                onChange={e => setTxt(e.target.value)}
                aria-label="Search by name"
            />

            <select
                className="select stock-select"
                value={inStock}
                onChange={e => setInStock(e.target.value)}
                aria-label="In stock"
            >
                <option value="">All</option>
                <option value="true">In stock</option>
                <option value="false">Out of stock</option>
            </select>

            <select
                className="select sortby-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Sort by"
            >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="created">Created</option>
            </select>

            <select
                className="select sortdir-select"
                value={String(sortDir)}
                onChange={e => setSortDir(Number(e.target.value))}
                aria-label="Sort direction"
            >
                <option value="1">Asc</option>
                <option value="-1">Desc</option>
            </select>

            <select
                multiple
                className="select labels-select"
                value={labels.length ? labels : [ALL_VALUE]}  // show “All” selected when none chosen
                onChange={onLabelsChange}
                aria-label="Labels"
            >
                <option value={ALL_VALUE}>(All)</option>
                {allLabels.map(l => (
                    <option key={l} value={l}>{l}</option>
                ))}
            </select>
        </div>
    )
}
