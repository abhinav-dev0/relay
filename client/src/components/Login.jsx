import { useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { LOGIN_API_URL, REGISTER_API_URL } from '../utils/constants'
import { useNavigate } from 'react-router'

const Login = () => {
    const [showLogin, setShowLogin] = useState(true)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const loginHandler = () => {
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        api.post(LOGIN_API_URL, {
            email, password
        }).then((response) => {
            const data = response.data;
            if (data.success) {
                useAuthStore.getState().login(data.data.auth_token)
                toast.success('Welcome back!')
                navigate('/tenant')
            } else {
                toast.error(data.message)
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || 'Login failed')
        }).finally(() => setLoading(false))
    }

    const registerHandler = () => {
        if (!name || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        api.post(REGISTER_API_URL, {
            name,
            email,
            password
        }).then((response) => {
            const data = response.data;
            if (data.success) {
                useAuthStore.getState().login(data.data.auth_token)
                toast.success('Account created!')
                navigate('/tenant')
            } else {
                toast.error(data.message)
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || 'Registration failed')
        }).finally(() => setLoading(false))
    }

    const handleKeyDown = (e, handler) => {
        if (e.key === 'Enter') handler();
    };

    return (
        <div className="auth-card">
            {showLogin ? (
                <>
                    <div className="auth-card-title">Sign in</div>
                    <div className="auth-card-subtitle">Enter your credentials to continue</div>
                    <div className="auth-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                className="input-field"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, loginHandler)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                className="input-field"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, loginHandler)}
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={loginHandler}
                            disabled={loading}
                            style={{ width: '100%', marginTop: '4px' }}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                    <div className="auth-toggle">
                        Don't have an account?{' '}
                        <button className="auth-toggle-link" onClick={() => setShowLogin(false)}>
                            Create one
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="auth-card-title">Create account</div>
                    <div className="auth-card-subtitle">Get started with Relay in seconds</div>
                    <div className="auth-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="register-name">Name</label>
                            <input
                                id="register-name"
                                className="input-field"
                                type="text"
                                placeholder="Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, registerHandler)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="register-email">Email</label>
                            <input
                                id="register-email"
                                className="input-field"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, registerHandler)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="register-password">Password</label>
                            <input
                                id="register-password"
                                className="input-field"
                                type="password"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, registerHandler)}
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={registerHandler}
                            disabled={loading}
                            style={{ width: '100%', marginTop: '4px' }}
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                    <div className="auth-toggle">
                        Already have an account?{' '}
                        <button className="auth-toggle-link" onClick={() => setShowLogin(true)}>
                            Sign in
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Login