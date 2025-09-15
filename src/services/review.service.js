import { httpService } from './http.service.js'

export const reviewService = { query, add, remove }

function query(filterBy = {}) {
    return httpService.get('review', filterBy)
}
function add({ toyId, txt }) {
    return httpService.post('review', { toyId, txt })
}
function remove(id) {
    return httpService.delete(`review/${id}`)
}
