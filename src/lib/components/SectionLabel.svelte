<script lang="ts">
	import type { Snippet } from 'svelte';
	/** Eyebrow row: uppercase label on the left, optional aside on the right. */
	let {
		label,
		aside,
		class: cls = ''
	}: { label: string; aside?: Snippet; class?: string } = $props();
</script>

<div class="flex justify-between gap-4 eyebrow {cls}">
	<span>{label}</span>
	{#if aside}<span class="tracking-normal normal-case">{@render aside()}</span>{/if}
</div>
