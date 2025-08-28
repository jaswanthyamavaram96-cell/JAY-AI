import axios from 'axios'
import { useState } from 'react'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001'

export function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [token, setToken] = useState('')
	async function submit(e: React.FormEvent) {
		e.preventDefault()
		const form = new URLSearchParams()
		form.set('username', email)
		form.set('password', password)
		form.set('grant_type', 'password')
		const res = await axios.post(`${API_BASE}/auth/login`, form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
		setToken(res.data.access_token)
		localStorage.setItem('jayai-token', res.data.access_token)
	}
	return (
		<main className="container py-12">
			<h1 className="text-3xl font-bold">Login</h1>
			<form onSubmit={submit} className="mt-4 max-w-md space-y-3">
				<input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10" />
				<input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10" />
				<button className="px-3 py-2 rounded-lg bg-gradient-to-tr from-violet-500 to-cyan-400 text-black font-semibold">Login</button>
				{token && <p className="text-white/70 break-all">Token: {token}</p>}
			</form>
		</main>
	)
}