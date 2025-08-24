export const storageService = { query, get, remove, put, post }

function query(entity, delay = 0) {
    const data = JSON.parse(localStorage.getItem(entity) || '[]')
    return new Promise(resolve => setTimeout(() => resolve(data), delay))
}

function get(entity, id) {
    return query(entity).then(list => list.find(item => item._id === id))
}

function remove(entity, id) {
    return query(entity).then(list => {
        const idx = list.findIndex(item => item._id === id)
        if (idx === -1) return Promise.reject('Not found')
        list.splice(idx, 1)
        localStorage.setItem(entity, JSON.stringify(list))
        return id
    })
}

function put(entity, item) {
    return query(entity).then(list => {
        const idx = list.findIndex(curr => curr._id === item._id)
        if (idx === -1) return Promise.reject('Not found')
        list[idx] = item
        localStorage.setItem(entity, JSON.stringify(list))
        return item
    })
}

function post(entity, item) {
    return query(entity).then(list => {
        list.unshift(item)
        localStorage.setItem(entity, JSON.stringify(list))
        return item
    })
}
