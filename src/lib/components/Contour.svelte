<script lang="ts">
	/**
	 * Procedural contour-line background, ported from the design's contour().
	 * Deterministic: same seed produces the same paths on server and client.
	 */
	let {
		width = 1100,
		height = 600,
		levels = 18,
		seed = 2.9,
		class: cls = ''
	}: { width?: number; height?: number; levels?: number; seed?: number; class?: string } = $props();

	const paths = $derived.by(() => {
		const out: { d: string; major: boolean }[] = [];
		const cx = width * 0.62;
		const cy = height * 0.45;
		const n = 120;
		for (let k = 1; k <= levels; k++) {
			const pts: string[] = [];
			for (let i = 0; i <= n; i++) {
				const t = (i / n) * Math.PI * 2;
				const r =
					(k / levels) *
					Math.min(width, height) *
					0.75 *
					(1 +
						0.16 * Math.sin(3 * t + seed + k * 0.35) +
						0.1 * Math.sin(5 * t - seed * 1.3 + k * 0.6) +
						0.05 * Math.sin(9 * t + k * 1.1));
				pts.push((cx + Math.cos(t) * r * 1.5).toFixed(1) + ',' + (cy + Math.sin(t) * r).toFixed(1));
			}
			out.push({ d: 'M' + pts.join('L') + 'Z', major: k % 4 === 0 });
		}
		return out;
	});
</script>

<svg
	viewBox="0 0 {width} {height}"
	width="100%"
	height="100%"
	preserveAspectRatio="xMidYMid slice"
	class="absolute inset-0 block {cls}"
	aria-hidden="true"
>
	{#each paths as p, i (i)}
		<path
			d={p.d}
			fill="none"
			stroke="var(--color-contour)"
			stroke-width={p.major ? 1.1 : 0.6}
			opacity={p.major ? 0.95 : 0.55}
		/>
	{/each}
</svg>
