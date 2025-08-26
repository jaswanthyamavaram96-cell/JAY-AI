// Theme toggle
(function themeToggle() {
	const toggle = document.getElementById('themeToggle');
	const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
	const saved = localStorage.getItem('jayai-theme');
	if ((saved === 'light') || (!saved && prefersLight)) {
		document.documentElement.classList.add('light');
	}
	toggle?.addEventListener('click', () => {
		document.documentElement.classList.toggle('light');
		const isLight = document.documentElement.classList.contains('light');
		localStorage.setItem('jayai-theme', isLight ? 'light' : 'dark');
	});
})();

// Smooth scroll for anchor links
(function smoothScroll() {
	document.addEventListener('click', (e) => {
		const t = e.target;
		if (t instanceof HTMLAnchorElement && t.getAttribute('href')?.startsWith('#')) {
			e.preventDefault();
			const id = t.getAttribute('href').slice(1);
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
})();

// Reveal on scroll
(function revealOnScroll() {
	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		}
	}, { threshold: 0.12 });
	document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

// Particles canvas
(function particles() {
	const canvas = document.getElementById('particles');
	if (!(canvas instanceof HTMLCanvasElement)) return;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
	let particles = [];
	const NUM = 90;

	function resize() {
		width = canvas.clientWidth = canvas.offsetWidth;
		height = canvas.clientHeight = canvas.offsetHeight;
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	window.addEventListener('resize', resize);
	resize();

	function rand(min, max) { return Math.random() * (max - min) + min; }

	particles = Array.from({ length: NUM }, () => ({
		x: rand(0, width),
		y: rand(0, height),
		vx: rand(-0.25, 0.25),
		vy: rand(-0.25, 0.25),
		r: rand(0.5, 1.8),
		c: Math.random() < 0.5 ? 'rgba(124,92,255,0.9)' : 'rgba(25,227,255,0.9)'
	}));

	function step() {
		ctx.clearRect(0, 0, width, height);
		// subtle gradient
		const grad = ctx.createLinearGradient(0, 0, width, height);
		grad.addColorStop(0, 'rgba(124,92,255,0.08)');
		grad.addColorStop(1, 'rgba(25,227,255,0.06)');
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, width, height);

		for (const p of particles) {
			p.x += p.vx; p.y += p.vy;
			if (p.x < -10) p.x = width + 10; if (p.x > width + 10) p.x = -10;
			if (p.y < -10) p.y = height + 10; if (p.y > height + 10) p.y = -10;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			ctx.fillStyle = p.c;
			ctx.fill();
		}

		// connecting lines
		ctx.lineWidth = 0.6;
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const a = particles[i], b = particles[j];
				const dx = a.x - b.x, dy = a.y - b.y;
				const d2 = dx * dx + dy * dy;
				if (d2 < 110 * 110) {
					ctx.strokeStyle = 'rgba(124,92,255,0.10)';
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
				}
			}
		}
		requestAnimationFrame(step);
	}
	requestAnimationFrame(step);
})();

// QA demo (simulated reasoning)
(function qaDemo() {
	const input = document.getElementById('qaInput');
	const ask = document.getElementById('qaAsk');
	const answer = document.getElementById('qaAnswer');
	if (!(input instanceof HTMLInputElement) || !(ask instanceof HTMLButtonElement) || !answer) return;
	const responses = [
		"Jay AI aggregates trusted sources and explains in clear, cited steps.",
		"Combining web search with leading models, Jay AI crafts precise answers.",
		"It reasons across engines and presents the best, verified result.",
	];
	ask.addEventListener('click', () => {
		const q = input.value.trim();
		if (!q) { answer.textContent = "Ask me anything."; return; }
		answer.textContent = "Thinking…";
		setTimeout(() => {
			const r = responses[Math.floor(Math.random() * responses.length)];
			answer.textContent = r;
		}, 700);
	});
})();

// Engineer's Quiz (client‑side sample)
(function quiz() {
	const play = document.getElementById('playQuiz');
	const area = document.getElementById('quizArea');
	const qEl = document.getElementById('quizQuestion');
	const aEl = document.getElementById('quizAnswers');
	const rEl = document.getElementById('quizResult');
	if (!(play instanceof HTMLButtonElement) || !area || !qEl || !aEl || !rEl) return;

	const questions = [
		{ q: 'In which year was the first programmable computer demonstrated?', a: ['1936', '1943', '1951', '1969'], c: 1 },
		{ q: 'Who formulated the laws of motion?', a: ['Einstein', 'Tesla', 'Newton', 'Feynman'], c: 2 },
		{ q: 'What does GPU stand for?', a: ['Graphical Processing Unit', 'Graphics Processing Unit', 'General Purpose Unit', 'Graph Processor Utility'], c: 1 },
	];
	let idx = 0, score = 0;

	function render() {
		const { q, a, c } = questions[idx];
		qEl.textContent = q;
		aEl.innerHTML = '';
		a.forEach((opt, i) => {
			const btn = document.createElement('button');
			btn.className = 'btn';
			btn.textContent = opt;
			btn.addEventListener('click', () => {
				if (i === c) score++;
				idx++;
				if (idx < questions.length) render(); else finish();
			});
			aEl.appendChild(btn);
		});
		rEl.textContent = '';
	}
	function finish() {
		rEl.textContent = `Score: ${score}/${questions.length}`;
	}

	play.addEventListener('click', () => {
		idx = 0; score = 0;
		area.hidden = false;
		render();
		area.scrollIntoView({ behavior: 'smooth', block: 'center' });
	});
})();

// Footer year
(function year() {
	const y = document.getElementById('year');
	if (y) y.textContent = String(new Date().getFullYear());
})();