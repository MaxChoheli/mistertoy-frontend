import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'

const ENTITY = 'toyDB'
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

export const toyService = {
    query,
    getById,
    remove,
    save,
    getEmptyToy,
    getLabels
}

_createDemoData()

function query(filterBy) {
    return storageService.query(ENTITY, 50).then(toys => {
        let res = toys.slice()

        if (filterBy && typeof filterBy.txt === 'string') {
            const t = filterBy.txt.trim()
            if (t.length) {
                const regex = new RegExp(t, 'i')
                res = res.filter(item => regex.test(item.name))
            }
        }

        if (filterBy && typeof filterBy.inStock !== 'undefined') {
            res = res.filter(item => item.inStock === filterBy.inStock)
        }

        if (filterBy && Array.isArray(filterBy.labels) && filterBy.labels.length > 0) {
            res = res.filter(item => {
                if (!Array.isArray(item.labels)) return false
                return item.labels.some(l => filterBy.labels.includes(l))
            })
        }

        if (filterBy && filterBy.sortBy) {
            const dir = filterBy.sortDir === -1 ? -1 : 1
            if (filterBy.sortBy === 'name') res.sort((a, b) => a.name.localeCompare(b.name) * dir)
            if (filterBy.sortBy === 'price') res.sort((a, b) => (a.price - b.price) * dir)
            if (filterBy.sortBy === 'created') res.sort((a, b) => (a.createdAt - b.createdAt) * dir)
        }

        return res
    })
}

function getById(id) {
    return storageService.get(ENTITY, id)
}

function remove(id) {
    return storageService.remove(ENTITY, id)
}

function save(toy) {
    if (toy._id) return storageService.put(ENTITY, toy)
    toy._id = utilService.makeId()
    toy.createdAt = Date.now()
    return storageService.post(ENTITY, toy)
}

function getEmptyToy() {
    return { name: '', imgUrl: '', price: 0, labels: [], createdAt: Date.now(), inStock: true }
}

function getLabels() {
    return labels.slice()
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
