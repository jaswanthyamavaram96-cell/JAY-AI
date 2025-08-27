import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { Features } from './pages/Features'
import { EngineersDay } from './pages/EngineersDay'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'

function App() {
	return (
		<BrowserRouter>
			<header className="sticky top-0 z-20 border-b border-white/10 backdrop-blur bg-black/30">
				<div className="container flex items-center justify-between py-3">
					<Link to="/" className="font-extrabold tracking-tight text-white">Jay<span className="text-cyan-300">AI</span></Link>
					<nav className="hidden md:flex gap-4 text-sm text-white/80">
						<Link to="/features">Features</Link>
						<Link to="/engineers-day">Engineer’s Day</Link>
						<Link to="/dashboard">Dashboard</Link>
					</nav>
					<div className="flex gap-2">
						<Link to="/login" className="px-3 py-2 rounded-lg border border-white/10">Login</Link>
						<Link to="/signup" className="px-3 py-2 rounded-lg bg-gradient-to-tr from-violet-500 to-cyan-400 text-black font-semibold">Sign Up</Link>
					</div>
				</div>
			</header>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/features" element={<Features />} />
				<Route path="/engineers-day" element={<EngineersDay />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
