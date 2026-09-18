<script lang="ts">
	import type { PresentedProjectResolved } from '$lib/content/types';
	/** Two-line row (name — presenter, then description) for a project presented at an event. Links out when a URL is given. */
	let { project }: { project: PresentedProjectResolved } = $props();

	const external = $derived(/^https?:\/\//.test(project.url ?? ''));
</script>

{#snippet inner()}
	<span class="flex items-baseline justify-between gap-4">
		<span class="text-[14px]">
			{project.name}
			{#if project.by}<span class="text-[12px] text-muted">— {project.by}</span>{/if}
		</span>
		{#if project.host}<span class="flex-none text-[11px] text-faint">{project.host}</span>{/if}
	</span>
	{#if project.description}
		<span class="text-[12px] leading-[1.6] text-muted">{project.description}</span>
	{/if}
{/snippet}

{#if project.url}
	<a
		href={project.url}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener' : undefined}
		class="flex flex-col gap-[6px] border-b border-dashed border-rule-mid py-[14px] text-[13px] text-ink no-underline hover:text-accent-hover"
	>
		{@render inner()}
	</a>
{:else}
	<div
		class="flex flex-col gap-[6px] border-b border-dashed border-rule-mid py-[14px] text-[13px] text-ink"
	>
		{@render inner()}
	</div>
{/if}
