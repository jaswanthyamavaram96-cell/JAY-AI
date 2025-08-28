import { useState } from 'react'
import { askJay, generateImage, generateSong, generateVideo } from '../api/ai'

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
	return (
		<button onClick={onClick} className={`px-4 py-2 rounded-xl border ${active ? 'bg-gradient-to-tr from-violet-500 to-cyan-400 text-black border-transparent' : 'border-white/10'}`}>{children}</button>
	)
}

export function Dashboard() {
	const [tab, setTab] = useState<'qa'|'image'|'video'|'song'>('qa')

	// QA
	const [q, setQ] = useState('How do rockets work?')
	const [answer, setAnswer] = useState('')
	const [sources, setSources] = useState<{title:string;url:string;snippet?:string}[]>([])
	const [loadingQA, setLoadingQA] = useState(false)
	const [errQA, setErrQA] = useState<string | null>(null)

	// Image
	const [imgPrompt, setImgPrompt] = useState('A neon futuristic city with flying cars')
	const [imgUrl, setImgUrl] = useState<string | null>(null)
	const [loadingImg, setLoadingImg] = useState(false)
	const [errImg, setErrImg] = useState<string | null>(null)

	// Video
	const [vidPrompt, setVidPrompt] = useState('Cinematic circuit board macro shot')
	const [vidUrl, setVidUrl] = useState<string | null>(null)
	const [loadingVid, setLoadingVid] = useState(false)
	const [errVid, setErrVid] = useState<string | null>(null)

	// Song
	const [songPrompt, setSongPrompt] = useState('Uplifting synthwave anthem with soaring lead')
	const [songUrl, setSongUrl] = useState<string | null>(null)
	const [loadingSong, setLoadingSong] = useState(false)
	const [errSong, setErrSong] = useState<string | null>(null)

	async function runQA() {
		setLoadingQA(true); setErrQA(null)
		try {
			const res = await askJay(q, 5)
			setAnswer(res.answer)
			setSources(res.sources)
		} catch (e: any) {
			setErrQA(e?.response?.data?.detail || 'Failed to fetch answer')
		} finally { setLoadingQA(false) }
	}

	async function runImage() {
		setLoadingImg(true); setErrImg(null)
		try { const res = await generateImage(imgPrompt); setImgUrl(res.image_url) } 
		catch (e: any) { setErrImg(e?.response?.data?.detail || 'Failed to generate image') } 
		finally { setLoadingImg(false) }
	}

	async function runVideo() {
		setLoadingVid(true); setErrVid(null)
		try { const res = await generateVideo(vidPrompt); setVidUrl(res.video_url) } 
		catch (e: any) { setErrVid(e?.response?.data?.detail || 'Failed to generate video') } 
		finally { setLoadingVid(false) }
	}

	async function runSong() {
		setLoadingSong(true); setErrSong(null)
		try { const res = await generateSong(songPrompt); setSongUrl(res.song_url) } 
		catch (e: any) { setErrSong(e?.response?.data?.detail || 'Failed to generate song') } 
		finally { setLoadingSong(false) }
	}

	return (
		<main className="container py-12 space-y-6">
			<h1 className="text-3xl font-bold">Jay AI Dashboard</h1>
			<div className="flex gap-2">
				<TabButton active={tab==='qa'} onClick={()=>setTab('qa')}>Ask Jay AI</TabButton>
				<TabButton active={tab==='image'} onClick={()=>setTab('image')}>Generate Image</TabButton>
				<TabButton active={tab==='video'} onClick={()=>setTab('video')}>Generate Video</TabButton>
				<TabButton active={tab==='song'} onClick={()=>setTab('song')}>Generate Song</TabButton>
			</div>

			{tab==='qa' && (
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<div className="flex gap-2">
						<input value={q} onChange={(e)=>setQ(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10" />
						<button onClick={runQA} className="px-4 py-2 rounded-lg bg-gradient-to-tr from-violet-500 to-cyan-400 text-black font-semibold">Ask</button>
					</div>
					{loadingQA && <p className="mt-2 text-white/60">Thinking…</p>}
					{errQA && <p className="mt-2 text-red-300">{errQA}</p>}
					{answer && <p className="mt-3 whitespace-pre-wrap text-white/80">{answer}</p>}
					{sources.length>0 && (
						<ul className="mt-3 text-sm text-white/60 list-disc pl-6">
							{sources.map((s)=> (
								<li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.title}</a></li>
							))}
						</ul>
					)}
				</div>
			)}

			{tab==='image' && (
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<div className="flex gap-2">
						<input value={imgPrompt} onChange={(e)=>setImgPrompt(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10" />
						<button onClick={runImage} className="px-4 py-2 rounded-lg border border-white/10">Generate</button>
					</div>
					{loadingImg && <p className="mt-2 text-white/60">Generating…</p>}
					{errImg && <p className="mt-2 text-red-300">{errImg}</p>}
					{imgUrl && <img src={imgUrl} alt="AI" className="mt-3 rounded-lg" />}
				</div>
			)}

			{tab==='video' && (
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<div className="flex gap-2">
						<input value={vidPrompt} onChange={(e)=>setVidPrompt(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10" />
						<button onClick={runVideo} className="px-4 py-2 rounded-lg border border-white/10">Generate</button>
					</div>
					{loadingVid && <p className="mt-2 text-white/60">Rendering…</p>}
					{errVid && <p className="mt-2 text-red-300">{errVid}</p>}
					{vidUrl && (
						<video className="mt-3 rounded-lg" controls>
							<source src={vidUrl} />
						</video>
					)}
				</div>
			)}

			{tab==='song' && (
				<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
					<div className="flex gap-2">
						<input value={songPrompt} onChange={(e)=>setSongPrompt(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10" />
						<button onClick={runSong} className="px-4 py-2 rounded-lg border border-white/10">Generate</button>
					</div>
					{loadingSong && <p className="mt-2 text-white/60">Composing…</p>}
					{errSong && <p className="mt-2 text-red-300">{errSong}</p>}
					{songUrl && (
						<audio className="mt-3 w-full" controls>
							<source src={songUrl} />
						</audio>
					)}
				</div>
			)}
		</main>
	)
}