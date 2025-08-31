import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toyService } from '../services/toy.service.js'
import { useToyStore } from '../app/store.jsx'
import { useUnsavedChanges } from '../hooks/useUnsavedChanges.js'

function isValidUrl(v) {
    if (!v) return true
    try { new URL(v); return true } catch { return false }
}

export function ToyEdit() {
    const params = useParams()
    const navigate = useNavigate()
    const { saveToy } = useToyStore()
    const allLabels = React.useMemo(() => toyService.getLabels(), [])
    const toyId = params.toyId

    const { register, handleSubmit, reset, setValue, watch, formState } = useForm({
        mode: 'onChange',
        defaultValues: { name: '', price: 0, imgUrl: '', inStock: true, labels: [] }
    })

    const { errors, isDirty, isValid } = formState
    const { confirmNavigate } = useUnsavedChanges(isDirty)

    React.useEffect(() => {
        if (!toyId) return
        toyService.getById(toyId).then(t => {
            if (!t) return
            reset({ name: t.name || '', price: Number(t.price) || 0, imgUrl: t.imgUrl || '', inStock: !!t.inStock, labels: t.labels || [] })
        })
    }, [toyId, reset])

    function onSubmit(data) {
        const toy = { ...(toyId ? { _id: toyId } : {}), ...data, price: Number(data.price), createdAt: Date.now() }
        saveToy(toy).then(() => navigate('/'))
    }

    const labelsVal = watch('labels')

    return (
        <section className="container">
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <h2>{toyId ? 'Edit Toy' : 'Add Toy'}</h2>

                <div className="field">
                    <input
                        className="input"
                        placeholder="Name"
                        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                    />
                    {errors.name && <div className="error">{errors.name.message}</div>}
                </div>

                <div className="field">
                    <input
                        className="input"
                        type="number"
                        placeholder="Price"
                        {...register('price', {
                            valueAsNumber: true,
                            required: 'Price is required',
                            min: { value: 0, message: 'Price cannot be negative' }
                        })}
                    />
                    {errors.price && <div className="error">{errors.price.message}</div>}
                </div>

                <div className="field">
                    <input
                        className="input"
                        placeholder="Image URL"
                        {...register('imgUrl', { validate: v => isValidUrl(v) || 'Must be a valid URL' })}
                    />
                    {errors.imgUrl && <div className="error">{errors.imgUrl.message}</div>}
                </div>

                <label className="row" style={{ marginTop: 8 }}>
                    <input type="checkbox" {...register('inStock')} />
                    <span>In stock</span>
                </label>

                <label style={{ marginTop: 8, display: 'block' }}>Labels</label>
                <select
                    className="select"
                    multiple
                    value={labelsVal}
                    onChange={e => {
                        const next = Array.from(e.target.options).filter(o => o.selected).map(o => o.value)
                        setValue('labels', next, { shouldValidate: true, shouldDirty: true })
                    }}
                >
                    {allLabels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>

                <div className="row" style={{ marginTop: 12 }}>
                    <button className="btn primary" type="submit" disabled={!isValid}>Save</button>
                    <button className="btn" type="button" onClick={() => confirmNavigate('/')}>Cancel</button>
                </div>
            </form>
        </section>
    )
}
