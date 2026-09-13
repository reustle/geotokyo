<script lang="ts">
	import type { Link } from '$lib/content/types';
	/** One-line link row used on event pages. */
	let { link }: { link: Link } = $props();
</script>

<a
	href={link.url}
	class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-dashed border-rule-mid py-[10px] text-[13px] text-ink no-underline hover:text-accent-hover md:grid-cols-[minmax(0,1fr)_auto_auto]"
>
	<span>{link.name} <span class="text-[12px] text-faint">— {link.description}</span></span>
	<span class="text-[11px] text-faint">{link.tag}</span>
	<span class="col-span-2 text-[11px] text-faint md:col-span-1">{link.host}</span>
</a>
