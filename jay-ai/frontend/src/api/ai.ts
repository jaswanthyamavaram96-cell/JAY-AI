import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001'

export async function askJay(question: string, top_k = 5) {
	const res = await axios.post(`${API_BASE}/qa/ask`, { question, top_k })
	return res.data as { answer: string; sources: { title: string; url: string; snippet?: string }[] }
}

export async function generateImage(prompt: string, size = '1024x1024', style?: string, provider?: string) {
	const res = await axios.post(`${API_BASE}/images/generate`, { prompt, size, style, provider })
	return res.data as { image_url: string; provider: string }
}

export async function generateVideo(prompt: string, provider?: string) {
	const res = await axios.post(`${API_BASE}/videos/generate`, { prompt, provider })
	return res.data as { video_url: string; provider: string }
}

export async function generateSong(prompt: string, provider?: string) {
	const res = await axios.post(`${API_BASE}/songs/generate`, { prompt, provider })
	return res.data as { song_url: string; provider: string; metadata?: Record<string, any> }
}