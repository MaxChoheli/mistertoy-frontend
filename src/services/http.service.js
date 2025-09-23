import axios from 'axios'

const rawBase = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || '')

const trimmed = rawBase.replace(/\/+$/, '')
const baseURL = trimmed.endsWith('/api') ? trimmed + '/' : trimmed + '/api/'

const http = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

export const httpService = {
    get(endpoint, params) { return ajax(endpoint, 'GET', params) },
    post(endpoint, data) { return ajax(endpoint, 'POST', data) },
    put(endpoint, data) { return ajax(endpoint, 'PUT', data) },
    delete(endpoint, data) { return ajax(endpoint, 'DELETE', data) },
}

async function ajax(endpoint, method, data) {
    try {
        const res = await http.request({
            url: endpoint,
            method,
            data,
            params: method === 'GET' ? data : null
        })
        return res.data
    } catch (err) {
        console.log(`Had Issues ${method}ing to ${endpoint}`, data)
        console.dir(err)
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
        }
        throw err
    }
}
