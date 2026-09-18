<script lang="ts">
	import { FilterChips, MapListRow, PageShell, SeoMeta, SortToggle } from '$lib/components';
	import { sortMaps } from '$lib/content';
	import type { MapSort } from '$lib/content/types';

	let { data } = $props();
	let filter = $state('all');
	let sort = $state<MapSort>('date');

	const rows = $derived(
		sortMaps(filter === 'all' ? data.maps : data.maps.filter((m) => m.tags.includes(filter)), sort)
	);
</script>

<SeoMeta
	title="Map Links · {data.site.title}"
	siteName={data.site.title}
	description={data.site.mapsBlurb}
/>

<PageShell site={data.site} organizers={data.organizers} current="/maps">
	<div class="flex flex-col gap-[18px] border-b border-rule px-5 pt-14 pb-8 md:px-10">
		<h1 class="m-0 max-w-[700px] text-[36px] leading-[1.15] font-light text-pretty">
			{data.site.mapsIntro}
		</h1>
		<p class="m-0 max-w-[560px] text-[13px] leading-[1.7] text-muted">{data.site.mapsBlurb}</p>
		<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
			<FilterChips options={data.tags} bind:value={filter} />
			<SortToggle bind:value={sort} />
		</div>
	</div>

	<section class="flex flex-col px-5 pt-2 pb-10 md:px-10 md:pb-14">
		{#each rows as entry (entry.id)}
			<MapListRow {entry} />
		{:else}
			<p class="m-0 py-6 text-[12px] text-faint">Nothing tagged {filter} yet.</p>
		{/each}
	</section>
</PageShell>
