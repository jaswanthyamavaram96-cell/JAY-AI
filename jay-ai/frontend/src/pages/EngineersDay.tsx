import { useState } from 'react'

const QUESTIONS = [
	{ q: 'Who formulated the laws of motion?', a: ['Einstein', 'Newton', 'Tesla', 'Feynman'], c: 1 },
	{ q: 'What does GPU stand for?', a: ['Graphic Processing Unit', 'Graphics Processing Unit', 'General Purpose Unit', 'Graphical Performance Unit'], c: 1 },
	{ q: 'Year of first programmable computer (Z3)?', a: ['1936', '1941', '1951', '1969'], c: 1 },
]

export function EngineersDay() {
	const [i, setI] = useState(0)
	const [score, setScore] = useState(0)
	const current = QUESTIONS[i]

	function pick(idx: number) {
		if (idx === current.c) setScore((s) => s + 1)
		if (i + 1 < QUESTIONS.length) setI((v) => v + 1)
	}

	return (
		<main className="container py-12 space-y-6">
			<h1 className="text-3xl font-bold">Engineer’s Day Special</h1>
			<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
				<h2 className="font-semibold">AI Tribute</h2>
				<video className="mt-3 rounded-lg border border-white/10" autoPlay loop muted playsInline>
					<source src="https://cdn.coverr.co/videos/coverr-circuit-board-technology-3478/1080p.mp4" />
				</video>
			</div>
			<div className="rounded-2xl border border-white/10 p-4 bg-white/5">
				<h2 className="font-semibold">Engineer’s Quiz</h2>
				{current ? (
					<div className="mt-3 space-y-3">
						<p className="font-medium">{current.q}</p>
						<div className="grid md:grid-cols-2 gap-2">
							{current.a.map((opt, idx) => (
								<button key={opt} onClick={() => pick(idx)} className="px-3 py-2 rounded-lg border border-white/10 text-left">{opt}</button>
							))}
						</div>
						<p className="text-white/60">Score: {score}</p>
					</div>
				) : (
					<p className="mt-3">Final Score: {score}/{QUESTIONS.length}</p>
				)}
			</div>
		</main>
	)
}