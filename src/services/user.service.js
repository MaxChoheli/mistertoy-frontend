import { httpService } from './http.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    saveLocalUser,
}

async function login(credentials) {
    try {
        const user = await httpService.post('auth/login', credentials)
        if (user) {
            const saved = saveLocalUser(user)
            _notify(saved)
            window.location.href = '/'
            return saved
        }
    } catch (err) {
        console.error('Login failed', err)
        throw err
    }
}

async function signup(userCred) {
    try {
        if (!userCred.imgUrl) {
            userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
        }
        const user = await httpService.post('auth/signup', userCred)
        const saved = saveLocalUser(user)
        _notify(saved)
        window.location.href = '/'
        return saved
    } catch (err) {
        console.error('Signup failed', err)
        throw err
    }
}

async function logout() {
    try {
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        await httpService.post('auth/logout')
        _notify(null)
    } catch (err) {
        console.error('Logout failed', err)
        throw err
    }
}

function saveLocalUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}

const listeners = []

export function onUserChange(cb) {
    listeners.push(cb)
}

function _notify(user) {
    listeners.forEach(cb => cb(user))
}
