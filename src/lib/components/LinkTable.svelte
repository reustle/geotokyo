<script lang="ts">
	import type { Link } from '$lib/content/types';
	import { pad2 } from '$lib/content/format';

	/** Table of links for the links index. Rows link out; event column coloured by event. */
	let { links, footer = '' }: { links: Link[]; footer?: string } = $props();

	const cols =
		'grid grid-cols-[36px_minmax(0,1fr)_88px] md:grid-cols-[36px_minmax(0,1fr)_120px_110px_120px] gap-4 px-5 md:px-10';
</script>

<div class="{cols} border-b border-rule py-3 text-[10px] tracking-[.18em] text-faint uppercase">
	<span>№</span><span>Project</span><span class="hidden md:inline">Type</span><span>Event</span
	><span class="hidden md:inline">Status</span>
</div>
{#each links as link, i (link.id)}
	<a
		href={link.url}
		class="{cols} items-start border-b border-rule-soft py-4 text-[13px] text-ink no-underline transition-colors hover:bg-bg-hover hover:text-ink"
	>
		<span class="text-[12px] text-faint">{pad2(i + 1)}</span>
		<span class="flex flex-col gap-1">
			<span>{link.name}</span>
			<span class="text-[12px] leading-[1.5] text-muted">{link.description}</span>
			<span class="text-[11px] text-faint"
				>{link.host} <span class="md:hidden">· {link.tag}</span></span
			>
		</span>
		<span class="hidden pt-[2px] text-[11px] text-muted md:inline">{link.tag}</span>
		<span class="pt-[2px] text-[11px]" style="color:{link.eventColor}">{link.eventLabel}</span>
		<span class="hidden pt-[2px] text-[11px] text-muted md:inline">{link.status}</span>
	</a>
{/each}
{#if footer}
	<div class="px-5 py-4 text-[11px] text-faint md:px-10">{footer}</div>
{/if}
