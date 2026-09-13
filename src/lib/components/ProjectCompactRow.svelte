<script lang="ts">
	import type { Project } from '$lib/content/types';
	/** One-line project row used on event pages. */
	let { project }: { project: Project } = $props();
</script>

<a
	href={project.url}
	class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-dashed border-rule-mid py-[10px] text-[13px] text-ink no-underline hover:text-accent-hover md:grid-cols-[minmax(0,1fr)_auto_auto]"
>
	<span>{project.name} <span class="text-[12px] text-faint">— {project.description}</span></span>
	<span class="text-[11px] text-faint">{project.tag}</span>
	<span class="col-span-2 text-[11px] text-faint md:col-span-1">{project.host}</span>
</a>
