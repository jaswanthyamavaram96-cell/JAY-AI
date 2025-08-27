import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001'

export function Dashboard() {
	const [email, setEmail] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	useEffect(() => {
		const token = localStorage.getItem('jayai-token')
		if (!token) { setError('Not logged in'); return }
		axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` }})
			.then((res)=> setEmail(res.data.email))
			.catch(()=> setError('Invalid token'))
	}, [])
	return (
		<main className="container py-12 space-y-6">
			<h1 className="text-3xl font-bold">Dashboard</h1>
			{email ? <p className="text-white/70">Welcome, {email}</p> : <p className="text-white/60">{error}</p>}
			<div className="grid md:grid-cols-3 gap-4">
				<Link to="/features" className="rounded-2xl border border-white/10 p-4 bg-white/5">Try Demos</Link>
				<a href="#" className="rounded-2xl border border-white/10 p-4 bg-white/5">PDF Assistant</a>
				<a href="#" className="rounded-2xl border border-white/10 p-4 bg-white/5">Coding Helper</a>
			</div>
		</main>
	)
}