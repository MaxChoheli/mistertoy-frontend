import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const ENTITY = 'toyDB'
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

export const toyService = {
    query,
    getById,
    remove,
    save,
    getEmptyToy,
    getLabels,
}

const USE_BACKEND = true

if (!USE_BACKEND) _createDemoData()

function query(filterBy = {}) {
    if (USE_BACKEND) return httpService.get('toy', normalizeFilter(filterBy))
    return storageService.query(ENTITY, 50).then(toys => applyClientFilter(toys, filterBy))
}

function getById(id) {
    if (USE_BACKEND) return httpService.get(`toy/${id}`)
    return storageService.get(ENTITY, id)
}

function remove(id) {
    if (USE_BACKEND) return httpService.delete(`toy/${id}`)
    return storageService.remove(ENTITY, id)
}

function save(toy) {
    if (USE_BACKEND) {
        if (toy._id) return httpService.put(`toy/${toy._id}`, toy)
        return httpService.post('toy', toy)
    }
    if (toy._id) return storageService.put(ENTITY, toy)
    toy._id = utilService.makeId()
    toy.createdAt = Date.now()
    return storageService.post(ENTITY, toy)
}

function getEmptyToy() {
    return { name: '', imgUrl: '', price: 0, labels: [], createdAt: Date.now(), inStock: true, msgs: [] }
}

function getLabels() {
    return labels.slice()
}

function normalizeFilter(filterBy = {}) {
    const out = {}
    if (typeof filterBy.txt === 'string') out.txt = filterBy.txt.trim()
    if (typeof filterBy.inStock !== 'undefined') out.inStock = filterBy.inStock
    if (Array.isArray(filterBy.labels)) out.labels = filterBy.labels
    if (filterBy.sortBy) out.sortBy = filterBy.sortBy
    if (typeof filterBy.sortDir !== 'undefined') out.sortDir = filterBy.sortDir
    return out
}

function applyClientFilter(toys, filterBy = {}) {
    let res = toys.slice()
    if (typeof filterBy.txt === 'string') {
        const t = filterBy.txt.trim()
        if (t) {
            const regex = new RegExp(t, 'i')
            res = res.filter(item => regex.test(item.name))
        }
    }
    if (typeof filterBy.inStock !== 'undefined') {
        res = res.filter(item => item.inStock === filterBy.inStock)
    }
    if (Array.isArray(filterBy.labels) && filterBy.labels.length > 0) {
        res = res.filter(item => Array.isArray(item.labels) && item.labels.some(l => filterBy.labels.includes(l)))
    }
    if (filterBy.sortBy) {
        const dir = filterBy.sortDir === -1 ? -1 : 1
        if (filterBy.sortBy === 'name') res.sort((a, b) => a.name.localeCompare(b.name) * dir)
        if (filterBy.sortBy === 'price') res.sort((a, b) => (a.price - b.price) * dir)
        if (filterBy.sortBy === 'created') res.sort((a, b) => (a.createdAt - b.createdAt) * dir)
    }
    return res
}

function _createDemoData() {
    const curr = JSON.parse(localStorage.getItem(ENTITY) || 'null')
    if (curr && Array.isArray(curr) && curr.length) return
    const seed = [
        { _id: utilService.makeId(), name: 'Talking Doll', imgUrl: '', price: 123, labels: ['Doll', 'Battery Powered', 'Baby'], createdAt: 1631031801011, inStock: true },
        { _id: utilService.makeId(), name: 'Puzzle 500', imgUrl: '', price: 72, labels: ['Puzzle', 'Box game'], createdAt: 1632031801011, inStock: false },
        { _id: utilService.makeId(), name: 'Kick Scooter', imgUrl: '', price: 260, labels: ['On wheels', 'Outdoor'], createdAt: 1633031801011, inStock: true }
    ]
    localStorage.setItem(ENTITY, JSON.stringify(seed))
}
