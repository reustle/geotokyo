<script lang="ts">
	import type { Project } from '$lib/content/types';
	/** Thumbnail for a project; falls back to a labelled placeholder when no image is set. */
	let { project, class: cls = '' }: { project: Project; class?: string } = $props();
</script>

<div class="relative overflow-hidden border border-rule bg-bg-deep {cls}">
	{#if project.image}
		<img
			src={project.image}
			alt=""
			class="absolute inset-0 h-full w-full object-cover"
			loading="lazy"
		/>
	{:else}
		<div
			class="absolute inset-0 grid place-items-center p-2 text-center text-[10px] leading-[1.4] text-faint"
		>
			{project.host}
		</div>
	{/if}
</div>
