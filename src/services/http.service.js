import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE || '/api/'

axios.defaults.withCredentials = true

export const httpService = {
    get(endpoint, params) {
        return ajax(endpoint, 'GET', params)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    },
}

async function ajax(endpoint, method = 'GET', data = null) {
    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: method === 'GET' ? data : null,
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
