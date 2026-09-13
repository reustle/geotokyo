<script lang="ts">
	import type { Project } from '$lib/content/types';
	import { pad2 } from '$lib/content/format';

	/** Table of projects for the projects index. Rows project out; event column coloured by event. */
	let { projects, footer = '' }: { projects: Project[]; footer?: string } = $props();

	const cols =
		'grid grid-cols-[36px_minmax(0,1fr)_88px] md:grid-cols-[36px_minmax(0,1fr)_120px_110px_120px] gap-4 px-5 md:px-10';
</script>

<div class="{cols} border-b border-rule py-3 text-[10px] tracking-[.18em] text-faint uppercase">
	<span>№</span><span>Project</span><span class="hidden md:inline">Type</span><span>Event</span
	><span class="hidden md:inline">Status</span>
</div>
{#each projects as project, i (project.id)}
	<a
		href={project.url}
		class="{cols} items-start border-b border-rule-soft py-4 text-[13px] text-ink no-underline transition-colors hover:bg-bg-hover hover:text-ink"
	>
		<span class="text-[12px] text-faint">{pad2(i + 1)}</span>
		<span class="flex flex-col gap-1">
			<span>{project.name}</span>
			<span class="text-[12px] leading-[1.5] text-muted">{project.description}</span>
			<span class="text-[11px] text-faint"
				>{project.host} <span class="md:hidden">· {project.tag}</span></span
			>
		</span>
		<span class="hidden pt-[2px] text-[11px] text-muted md:inline">{project.tag}</span>
		<span class="pt-[2px] text-[11px]" style="color:{project.eventColor}">{project.eventLabel}</span
		>
		<span class="hidden pt-[2px] text-[11px] text-muted md:inline">{project.status}</span>
	</a>
{/each}
{#if footer}
	<div class="px-5 py-4 text-[11px] text-faint md:px-10">{footer}</div>
{/if}
