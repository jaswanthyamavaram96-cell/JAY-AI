import { Link } from 'react-router-dom'
import { EngineersDayBanner } from '../components/EngineersDayBanner'

export function Home() {
	return (
		<main>
			<section className="relative overflow-clip py-24">
				<div className="absolute inset-0 -z-10 opacity-60" aria-hidden>
					<div className="absolute -top-40 right-0 w-[60%] h-[60%] rounded-full blur-3xl bg-gradient-to-tr from-violet-500/30 to-cyan-400/30" />
				</div>
				<div className="container text-center">
					<h1 className="text-5xl md:text-6xl font-black tracking-tight">Meet Jay AI – The AI That Does It All</h1>
					<p className="mt-3 text-white/70 text-lg">Smarter answers. Stunning images. Cinematic videos. Beautiful songs. One assistant, endless possibilities.</p>
					<div className="mt-6 flex gap-3 justify-center flex-wrap">
						<Link to="/signup" className="px-5 py-3 rounded-xl bg-gradient-to-tr from-violet-500 to-cyan-400 text-black font-semibold">Try Jay AI Now</Link>
						<Link to="/features" className="px-5 py-3 rounded-xl border border-white/15">Explore Features</Link>
					</div>
					<div className="mt-6"><EngineersDayBanner /></div>
				</div>
			</section>

			<section className="py-16">
				<div className="container">
					<h2 className="text-3xl font-bold">Superpowers, unified</h2>
					<p className="text-white/60">Search genius, text‑to‑image, text‑to‑video, AI song maker, voice chat, coding helper, resume builder and more.</p>
					<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
						{[
							{ t: 'Search Genius', d: 'Aggregates Google, Bing, ChatGPT, Claude, Gemini, Perplexity.' },
							{ t: 'Image Generation', d: 'Ultra‑realistic images from prompts.' },
							{ t: 'Video Generation', d: 'Cinematic videos better than Runway.' },
							{ t: 'AI Song Maker', d: 'Lyrics, music, and vocals together.' },
							{ t: 'Voice + Multilingual', d: 'Talk to Jay AI in any language.' },
							{ t: 'Student & Engineer Tools', d: 'Reports, quizzes, coding, resumes.' },
						].map((f) => (
							<div key={f.t} className="rounded-2xl border border-white/10 p-4 bg-white/5">
								<div className="text-white font-semibold">{f.t}</div>
								<div className="text-white/60 text-sm">{f.d}</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	)
}