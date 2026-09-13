<script lang="ts">
	import type { Snippet } from 'svelte';
	/** Definition list: `when / where / hosts / luma`. Pass rows as [term, snippet-or-string]. */
	let {
		rows
	}: { rows: { term: string; value: string | string[]; href?: string; snippet?: Snippet }[] } =
		$props();
</script>

<dl class="m-0 grid grid-cols-[70px_minmax(0,1fr)] gap-x-[14px] gap-y-2 text-[13px] leading-[1.5]">
	{#each rows as row (row.term)}
		<dt class="text-faint">{row.term}</dt>
		<dd class="m-0">
			{#if row.snippet}
				{@render row.snippet()}
			{:else if row.href}
				<a href={row.href}>{row.value}</a>
			{:else if Array.isArray(row.value)}
				{#each row.value as line, i (i)}{line}{#if i < row.value.length - 1}<br />{/if}{/each}
			{:else}
				{row.value}
			{/if}
		</dd>
	{/each}
</dl>
