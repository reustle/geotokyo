<script lang="ts">
	import { formatShort, pad2, timeRange } from '$lib/content/format';
	import {
		Contour,
		CtaLink,
		EventGrid,
		MapRow,
		SectionLabel,
		SiteFooter,
		SiteHeader
	} from '$lib/components';

	let { data } = $props();
	const { site, organizers, nextEvent, pastEvents, recentPast, recentMaps, mapCount } =
		$derived(data);

	const earliest = $derived(pastEvents[pastEvents.length - 1]);
	const firstHidden = $derived(pastEvents[recentPast.length]);
	const earlierRange = $derived(
		firstHidden && earliest ? `${firstHidden.label} … ${earliest.label}` : ''
	);
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content="Tokyo mapping meetup. Irregular since 2025." />
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-[1400px] flex-col">
	<!-- Hero: next meetup on a contour-map background -->
	<div
		class="relative flex min-h-[560px] flex-col overflow-hidden border-b border-rule md:min-h-[600px]"
	>
		<div class="absolute inset-0">
			<Contour width={390} height={560} levels={16} class="md:hidden" />
			<Contour width={1100} height={600} levels={18} class="hidden md:block" />
		</div>
		<div
			class="absolute inset-0"
			style="background:linear-gradient(to top,#1e1c19 0%,rgba(30,28,25,.65) 42%,transparent 78%)"
		></div>

		<SiteHeader nav={site.nav} overlay />

		<div
			class="relative mt-auto flex flex-wrap items-end justify-between gap-x-10 gap-y-6 px-5 pb-7 md:px-12 md:pb-12"
		>
			{#if nextEvent}
				<div class="flex min-w-0 flex-[1_1_480px] flex-col gap-[14px]">
					<a
						href="/meetups/{nextEvent.slug}"
						class="flex flex-col gap-2 text-ink no-underline hover:text-accent-hover"
					>
						<span class="text-[clamp(30px,4.2vw,46px)] leading-[1.1] font-light text-balance">
							{nextEvent.title}
						</span>
						{#if nextEvent.subtitle}
							<span class="text-[clamp(18px,2.4vw,26px)] leading-[1.2] font-light text-muted">
								{nextEvent.subtitle}
							</span>
						{/if}
					</a>
					<div class="flex flex-wrap gap-x-7 gap-y-[10px] text-[13px] leading-[1.7] text-muted">
						<span>
							<span class="text-ink">{formatShort(nextEvent.date)}</span>
							{#if nextEvent.startTime}· {timeRange(nextEvent.startTime, nextEvent.endTime)}{/if}
						</span>
						<span>
							<span class="text-ink">{nextEvent.venue}</span>
							{#if nextEvent.city}· {nextEvent.city.split(',')[0]}{/if}
						</span>
						{#if nextEvent.hosts?.length}
							<span>{nextEvent.hosts.join(' & ')}</span>
						{/if}
					</div>
				</div>
				{#if nextEvent.lumaUrl}
					<CtaLink href={nextEvent.lumaUrl} class="w-full md:w-auto">RSVP ON LUMA →</CtaLink>
				{/if}
			{:else}
				<div class="flex min-w-0 flex-[1_1_480px] flex-col gap-[14px]">
					<div class="text-[clamp(30px,4.2vw,46px)] leading-[1.1] font-light text-balance">
						The next Geo Tokyo meetup isn't scheduled yet.
					</div>
					<div class="text-[13px] text-muted">Subscribe below and we'll email you when it is.</div>
				</div>
				<CtaLink href="#subscribe" class="w-full md:w-auto">GET NOTIFIED →</CtaLink>
			{/if}
		</div>
	</div>

	<!-- Past meetups -->
	<section
		id="events"
		class="flex flex-col gap-[18px] border-b border-rule px-5 py-6 md:px-12 md:py-8"
	>
		<SectionLabel label="Past meetups · {pad2(pastEvents.length)}">
			{#snippet aside()}<a href="/meetups">all →</a>{/snippet}
		</SectionLabel>
		<EventGrid
			events={recentPast}
			earlierHref={firstHidden ? '/meetups' : undefined}
			{earlierRange}
		/>
	</section>

	<!-- Recent Japanese maps -->
	<section id="maps" class="flex flex-col gap-2 px-5 pt-6 pb-8 md:px-12 md:pt-10 md:pb-14">
		<SectionLabel label="Recent Japanese maps · Data, tools, cartography" class="mb-3">
			{#snippet aside()}{pad2(mapCount)} total{/snippet}
		</SectionLabel>
		{#each recentMaps as entry (entry.id)}
			<MapRow {entry} />
		{/each}
		<a href="/maps" class="border-t border-rule pt-4 text-[12px]">All Japanese maps →</a>
	</section>

	<SiteFooter {site} {organizers} />
</div>
