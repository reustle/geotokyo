<script lang="ts">
	import { MAP_SORTS } from '$lib/content';
	import type { MapSort } from '$lib/content/types';

	/** Order buttons for the Map Links list. `value` is bindable. */
	let { value = $bindable('date' as MapSort) }: { value?: MapSort } = $props();
</script>

<div class="mt-2 flex items-center gap-[6px]" role="group" aria-label="Sort">
	<span class="text-[11px] tracking-[.04em] text-faint">sort</span>
	{#each MAP_SORTS as opt (opt.value)}
		<button
			type="button"
			aria-pressed={value === opt.value}
			onclick={() => (value = opt.value)}
			class="cursor-pointer border border-rule-strong px-3 py-[6px] text-[11px] tracking-[.04em] transition-colors
				{value === opt.value ? 'bg-ink text-canvas' : 'bg-transparent text-muted hover:text-ink'}"
		>
			{opt.label}
		</button>
	{/each}
</div>
