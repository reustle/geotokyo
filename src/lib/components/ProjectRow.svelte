<script lang="ts">
	import type { Project } from '$lib/content/types';
	import ProjectThumb from './ProjectThumb.svelte';

	/** Feed row: thumbnail + name/description/meta. The whole row is the anchor. */
	let { project }: { project: Project } = $props();
</script>

<a
	href={project.url}
	class="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-[14px] border-t border-rule py-[18px] text-ink no-underline hover:text-accent-hover md:grid-cols-[120px_minmax(0,1fr)] md:gap-6"
>
	<ProjectThumb {project} class="aspect-square md:aspect-[3/2]" />
	<div class="flex min-w-0 flex-col gap-2 pt-[2px]">
		<div class="text-[16px] leading-[1.35]">{project.name}</div>
		<div class="max-w-[520px] text-[13px] leading-[1.6] text-muted">{project.description}</div>
		<div class="mt-[2px] text-[11px] text-faint">
			↗ {project.host} · {project.tag} · shared at {project.eventLabel}
		</div>
	</div>
</a>
