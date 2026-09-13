<script lang="ts">
	/** Toggle chips. `value` is bindable; `all` is always the first option. */
	let {
		options,
		value = $bindable('all'),
		allLabel = 'all'
	}: { options: string[]; value?: string; allLabel?: string } = $props();

	const all = $derived([allLabel, ...options]);
</script>

<div class="mt-2 flex flex-wrap gap-[6px]" role="group" aria-label="Filter">
	{#each all as opt (opt)}
		<button
			type="button"
			aria-pressed={value === opt}
			onclick={() => (value = opt)}
			class="cursor-pointer border border-rule-strong px-3 py-[6px] text-[11px] tracking-[.04em] transition-colors
				{value === opt ? 'bg-ink text-canvas' : 'bg-transparent text-muted hover:text-ink'}"
		>
			{opt}
		</button>
	{/each}
</div>
