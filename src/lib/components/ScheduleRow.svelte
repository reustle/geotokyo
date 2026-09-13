<script lang="ts">
	import type { ScheduleItem } from '$lib/content/types';
	let { item }: { item: ScheduleItem } = $props();
</script>

<div
	class="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-rule pt-3 text-[13px] leading-[1.5]"
>
	<span class="text-accent">{item.time}</span>
	<span>{item.what}</span>
</div>
