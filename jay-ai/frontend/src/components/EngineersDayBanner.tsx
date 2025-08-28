import { Link } from 'react-router-dom'

export function EngineersDayBanner() {
	const now = new Date()
	const show = now.getMonth() === 8 && now.getDate() === 15 // September=8
	if (!show) return null
	return (
		<div className="bg-gradient-to-r from-violet-600/30 to-cyan-500/30 border border-white/10 rounded-xl p-3 text-center">
			<p className="font-semibold">Happy Engineer’s Day 🎉 — Unlocking Innovation with Jay AI</p>
			<Link to="/engineers-day" className="inline-block mt-1 px-3 py-1 rounded-lg border border-white/15">Play Engineer’s Quiz</Link>
		</div>
	)
}