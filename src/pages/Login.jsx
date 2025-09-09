import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service.js'

export function Login() {
    const navigate = useNavigate()
    const [cred, setCred] = useState({ username: '', password: '', fullname: '' })
    const [error, setError] = useState('')

    function handleChange(ev) {
        const { name, value } = ev.target
        setCred(prev => ({ ...prev, [name]: value }))
    }

    async function onLogin(ev) {
        ev.preventDefault()
        setError('')
        try {
            await userService.login({
                username: cred.username.trim(),
                password: cred.password,
            })
            navigate('/')
        } catch (err) {
            setError('Invalid username or password')
        }
    }

    async function onSignup(ev) {
        ev.preventDefault()
        setError('')
        try {
            await userService.signup({
                username: cred.username.trim(),
                password: cred.password,
                fullname: cred.fullname.trim(),
            })
            navigate('/')
        } catch (err) {
            setError('Signup failed')
        }
    }

    return (
        <section className="login-page">
            <h2>Login or Signup</h2>

            <form className="login-form">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={cred.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={cred.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="fullname"
                    placeholder="Full name (for signup)"
                    value={cred.fullname}
                    onChange={handleChange}
                />

                {error && <p className="error">{error}</p>}

                <div className="btn-group">
                    <button type="button" onClick={onLogin}>Login</button>
                    <button type="button" onClick={onSignup}>Signup</button>
                </div>
            </form>
        </section>
    )
}
