export const utilService = { makeId, saveToStorage, loadFromStorage }

function makeId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let out = ''
    for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length))
    return out
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key, defaultVal) {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultVal
    try { return JSON.parse(raw) } catch (e) { return defaultVal }
}
