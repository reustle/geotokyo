<script lang="ts">
	import type { Speaker } from '$lib/content/types';
	let { speaker }: { speaker: Speaker } = $props();
</script>

<div class="flex items-start gap-4 border-t border-rule pt-4">
	<div class="relative h-14 w-14 flex-none overflow-hidden rounded-full bg-bg-deep">
		{#if speaker.photo}
			<img src={speaker.photo} alt={speaker.name} class="h-full w-full object-cover" />
		{:else}
			<div class="grid h-full w-full place-items-center text-[10px] text-faint">photo</div>
		{/if}
	</div>
	<div class="flex flex-col gap-[5px]">
		<div class="text-[14px]">
			{speaker.name}
			{#if speaker.note}<span class="text-[11px] text-faint">{speaker.note}</span>{/if}
		</div>
		{#if speaker.role}<div class="text-[12px] text-muted">{speaker.role}</div>{/if}
		{#if speaker.talk}
			<div class="mt-1 text-[13px] leading-[1.5] text-ink">“{speaker.talk}”</div>
		{/if}
	</div>
</div>
