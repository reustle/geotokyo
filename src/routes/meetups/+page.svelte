<script lang="ts">
	import { pad2 } from '$lib/content/format';
	import { EventGrid, PageShell, SectionLabel } from '$lib/components';

	let { data } = $props();
</script>

<svelte:head>
	<title>Meetups · {data.site.title}</title>
</svelte:head>

<PageShell site={data.site} organizers={data.organizers} current="/meetups">
	<div class="flex flex-col gap-[18px] border-b border-rule px-5 pt-14 pb-8 md:px-10">
		<div class="text-[11px] tracking-[.18em] text-accent">$ ls meetups/</div>
		<h1 class="m-0 max-w-[700px] text-[36px] leading-[1.15] font-light text-pretty">
			Every Geo Tokyo meetup so far, and the next one.
		</h1>
	</div>

	{#if data.upcoming.length}
		<section class="flex flex-col gap-[18px] border-b border-rule px-5 py-6 md:px-10 md:py-8">
			<SectionLabel label="Upcoming · {pad2(data.upcoming.length)}" />
			<EventGrid events={data.upcoming} />
		</section>
	{/if}

	<section class="flex flex-col gap-[18px] px-5 py-6 md:px-10 md:py-8">
		<SectionLabel label="Past meetups · {pad2(data.past.length)}" />
		<EventGrid events={data.past} />
	</section>
</PageShell>
