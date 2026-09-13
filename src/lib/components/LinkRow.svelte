<script lang="ts">
	import type { Link } from '$lib/content/types';
	import LinkThumb from './LinkThumb.svelte';

	/** Feed row: thumbnail + name/description/meta. The whole row is the anchor. */
	let { link }: { link: Link } = $props();
</script>

<a
	href={link.url}
	class="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-[14px] border-t border-rule py-[18px] text-ink no-underline hover:text-accent-hover md:grid-cols-[minmax(160px,240px)_minmax(0,1fr)] md:gap-7"
>
	<LinkThumb {link} class="aspect-square md:aspect-[3/2]" />
	<div class="flex min-w-0 flex-col gap-2 pt-[2px]">
		<div class="text-[16px] leading-[1.35]">{link.name}</div>
		<div class="max-w-[520px] text-[13px] leading-[1.6] text-muted">{link.description}</div>
		<div class="mt-[2px] text-[11px] text-faint">
			↗ {link.host} · {link.tag} · shared at {link.eventLabel}
		</div>
	</div>
</a>
