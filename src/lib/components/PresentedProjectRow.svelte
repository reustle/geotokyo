<script lang="ts">
	import type { PresentedProjectResolved } from '$lib/content/types';
	/** One-line row for a project presented at an event. Links out when a URL is given. */
	let { project }: { project: PresentedProjectResolved } = $props();
</script>

{#snippet inner()}
	<span>
		{project.name}
		{#if project.description}<span class="text-[12px] text-faint">— {project.description}</span
			>{/if}
	</span>
	{#if project.by}<span class="text-[11px] text-muted">{project.by}</span>{/if}
	{#if project.host}<span class="text-[11px] text-faint">{project.host}</span>{/if}
{/snippet}

{#if project.url}
	<a
		href={project.url}
		class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-dashed border-rule-mid py-[10px] text-[13px] text-ink no-underline hover:text-accent-hover md:grid-cols-[minmax(0,1fr)_auto_auto]"
	>
		{@render inner()}
	</a>
{:else}
	<div
		class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-dashed border-rule-mid py-[10px] text-[13px] text-ink md:grid-cols-[minmax(0,1fr)_auto_auto]"
	>
		{@render inner()}
	</div>
{/if}
