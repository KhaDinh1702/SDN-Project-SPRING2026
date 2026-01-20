import { useState } from 'react'

export default function AuthForm() {
  const [mode, setMode] = useState('login') 
  const [data, setData] = useState({ username: '', first_name: '', last_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const url = `${backend}/auth/${mode === 'login' ? 'login' : 'register'}`
      const body = mode === 'login' ? { email: data.email, password: data.password } : data

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Request failed')

      if (json.token) {
        localStorage.setItem('token', json.token)
        setMessage({ type: 'success', text: 'Login successful — token saved.' })
      } else if (json.success) {
        setMessage({ type: 'success', text: 'Registered successfully. You can now login.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        {message && (
          <div className={`auth-msg ${message.type}`}>{message.text}</div>
        )}
        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <>
              <input name="username" placeholder="Username" value={data.username} onChange={handleChange} required />
              <input name="first_name" placeholder="First name" value={data.first_name} onChange={handleChange} required />
              <input name="last_name" placeholder="Last name" value={data.last_name} onChange={handleChange} required />
            </>
          )}
          <input name="email" type="email" placeholder="Email" value={data.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={data.password} onChange={handleChange} required />

          <button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Register'}</button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <p>
              Don't have an account? <button className="link-btn" onClick={() => { setMode('register'); setMessage(null) }}>Register</button>
            </p>
          ) : (
            <p>
              Already have an account? <button className="link-btn" onClick={() => { setMode('login'); setMessage(null) }}>Sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
