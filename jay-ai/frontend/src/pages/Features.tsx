import axios from 'axios'
import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001'

export function Features() {
	const [q, setQ] = useState('Why is the sky blue?')
	const [a, setA] = useState('')
	const [img, setImg] = useState<string | null>(null)
	const [video, setVideo] = useState<string | null>(null)
	const [song, setSong] = useState<string | null>(null)

	async function ask() {
		const res = await axios.post(`${API_BASE}/qa/ask`, { question: q })
		setA(res.data.answer)
	}
	async function genImage() {
		const res = await axios.post(`${API_BASE}/images/generate`, { prompt: 'A futuristic neon city at night' })
		setImg(res.data.url)
	}
	async function genVideo() {
		const res = await axios.post(`${API_BASE}/videos/generate`, { prompt: 'Circuit board technology cinematic b-roll' })
		setVideo(res.data.url)
	}
	async function genSong() {
		const res = await axios.post(`${API_BASE}/songs/generate`, { prompt: 'Chill lofi beat with airy vocals' })
		setSong(res.data.url)
	}

	return (
		<main className="container py-12 space-y-8">
			<h1 className="text-3xl font-bold">Interactive Demos</h1>
			<div className="grid md:grid-cols-2 gap-6">
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<h2 className="font-semibold">Ask a question</h2>
					<div className="flex gap-2 mt-2">
						<input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10" placeholder="Ask Jay AI" />
						<button onClick={ask} className="px-3 py-2 rounded-lg bg-gradient-to-tr from-violet-500 to-cyan-400 text-black font-semibold">Ask</button>
					</div>
					<p className="mt-2 text-white/70 min-h-6">{a}</p>
				</div>
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<h2 className="font-semibold">Image generation</h2>
					<button onClick={genImage} className="mt-2 px-3 py-2 rounded-lg border border-white/10">Generate image</button>
					{img && <img src={img} alt="AI" className="mt-3 rounded-lg" />}
				</div>
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<h2 className="font-semibold">Video generation</h2>
					<button onClick={genVideo} className="mt-2 px-3 py-2 rounded-lg border border-white/10">Generate video</button>
					{video && (
						<video className="mt-3 rounded-lg" controls>
							<source src={video} />
						</video>
					)}
				</div>
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<h2 className="font-semibold">Song generation</h2>
					<button onClick={genSong} className="mt-2 px-3 py-2 rounded-lg border border-white/10">Generate song</button>
					{song && (
						<audio className="mt-3 w-full" controls>
							<source src={song} />
						</audio>
					)}
				</div>
			</div>
		</main>
	)
}