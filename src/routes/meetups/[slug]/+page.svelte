<script lang="ts">
	import { formatCoverDate, formatLong, formatShort, timeRange } from '$lib/content/format';
	import {
		CtaLink,
		EventCover,
		FilterChips,
		MapCompactRow,
		MetaList,
		PageShell,
		PhotoGrid,
		PresentedProjectRow,
		ScheduleRow,
		SectionLabel,
		SeoMeta,
		SpeakerRow
	} from '$lib/components';

	let { data } = $props();
	const { event, eventMaps, eventMapTags, nextEvent } = $derived(data);
	let mapFilter = $state('all');
	// Reset the tag filter when navigating to another meetup.
	$effect.pre(() => {
		void event.slug;
		mapFilter = 'all';
	});
	const visibleMaps = $derived(
		mapFilter === 'all' ? eventMaps : eventMaps.filter((m) => m.tags.includes(mapFilter))
	);
	const Body = $derived(event.body);

	const ogDescription = $derived(
		[
			`${formatLong(event.date)}${event.startTime ? `, ${timeRange(event.startTime, event.endTime)}` : ''} at ${[event.venue, event.city].filter(Boolean).join(', ')}.`,
			event.highlight
		]
			.filter(Boolean)
			.join(' ')
	);
	// Social cards can't use SVG covers; use the first raster photo if there is one.
	const ogImage = $derived(event.photos?.find((p) => /\.(jpe?g|png|webp)$/i.test(p.src))?.src);

	const meta = $derived([
		{
			term: 'when',
			value: [formatLong(event.date), timeRange(event.startTime, event.endTime)].filter(Boolean)
		},
		{ term: 'where', value: [event.venue, event.city ?? ''].filter(Boolean) },
		...(event.hosts?.length ? [{ term: 'hosts', value: event.hosts.join(', ') }] : []),
		...(event.lumaUrl
			? [{ term: 'luma', value: event.lumaUrl.replace(/^https?:\/\//, ''), href: event.lumaUrl }]
			: []),
		...(event.meetupUrl
			? [{ term: 'meetup', value: 'meetup.com/geotokyo', href: event.meetupUrl }]
			: [])
	]);
</script>

<SeoMeta
	title="{event.title}{event.subtitle ? ` ${event.subtitle}` : ''} · {data.site.title}"
	siteName={data.site.title}
	description={ogDescription}
	image={ogImage}
	type="article"
/>

<PageShell site={data.site} organizers={data.organizers} current="/meetups">
	<!-- Cover + summary -->
	<div class="grid border-b border-rule md:grid-cols-[minmax(0,1fr)_380px]">
		<div class="border-b border-rule md:border-r md:border-b-0">
			<EventCover {event} variant="full">
				<div class="flex justify-between text-[11px] font-medium tracking-[.08em]">
					<span>{formatCoverDate(event.date, event.startTime)}</span>
					<span class="uppercase">{event.venue}</span>
				</div>
			</EventCover>
		</div>
		<div class="flex flex-col gap-[18px] p-5 md:p-8">
			<div class="eyebrow">
				<a href="/meetups" class="text-muted no-underline hover:text-accent-hover">← meetups</a>
				· {event.upcoming ? 'Upcoming' : 'Past'}
			</div>
			<h1 class="m-0 text-[28px] leading-[1.2] font-light">
				{event.title}
				{#if event.subtitle}<span class="block text-[20px] text-muted">{event.subtitle}</span>{/if}
			</h1>
			<MetaList rows={meta} />
			{#if event.highlight}
				<p class="m-0 mt-auto text-[13px] leading-[1.7] text-muted">{event.highlight}</p>
			{/if}
			{#if event.upcoming && event.lumaUrl}
				<CtaLink href={event.lumaUrl} size="md">RSVP ON LUMA →</CtaLink>
			{/if}
		</div>
	</div>

	<!-- Speakers + schedule -->
	{#if event.speakers?.length || event.schedule?.length}
		<div class="grid border-b border-rule md:grid-cols-2">
			{#if event.speakers?.length}
				<div
					class="flex flex-col gap-5 border-b border-rule px-5 py-7 md:border-r md:border-b-0 md:px-10 md:py-9"
				>
					<SectionLabel label="Speakers" />
					{#each event.speakers as speaker (speaker.name)}
						<SpeakerRow {speaker} />
					{/each}
				</div>
			{/if}
			{#if event.schedule?.length}
				<div class="flex flex-col gap-5 px-5 py-7 md:px-10 md:py-9">
					<SectionLabel label="Schedule" />
					{#each event.schedule as item (item.time + item.what)}
						<ScheduleRow {item} />
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Notes (Markdown body) -->
	{#if event.hasBody}
		<div class="flex flex-col gap-5 border-b border-rule px-5 py-7 md:px-10 md:py-9">
			<SectionLabel label="Notes" />
			<div class="prose-geo max-w-[720px]"><Body /></div>
		</div>
	{/if}

	<!-- Photos -->
	{#if event.photos?.length}
		<div class="flex flex-col gap-5 border-b border-rule px-5 py-7 md:px-10 md:py-9">
			<SectionLabel label="Photos">
				{#snippet aside()}{event.photos?.length}{/snippet}
			</SectionLabel>
			<PhotoGrid photos={event.photos} />
		</div>
	{/if}

	<!-- Presented projects + map links discussed -->
	{#if event.projects.length || event.upcoming}
		<div class="flex flex-col gap-4 border-b border-rule px-5 py-7 md:px-10 md:py-9">
			<SectionLabel label={event.upcoming ? 'Projects to be presented' : 'Projects presented'} />
			{#each event.projects as project (project.name)}
				<PresentedProjectRow {project} />
			{:else}
				<p class="m-0 text-[12px] text-faint">Line-up to be announced.</p>
			{/each}
		</div>
	{/if}
	<div
		class="flex flex-col gap-4 px-5 py-7 md:px-10 md:py-9 {nextEvent ? 'border-b border-rule' : ''}"
	>
		<SectionLabel label={event.upcoming ? 'Map links on the agenda' : 'Map links discussed'}>
			{#snippet aside()}<a href="/maps">all map links →</a>{/snippet}
		</SectionLabel>
		{#if eventMapTags.length > 1}
			<FilterChips options={eventMapTags} bind:value={mapFilter} />
		{/if}
		<div class="flex flex-col gap-4">
			{#each visibleMaps as entry (entry.id)}
				<MapCompactRow {entry} />
			{:else}
				<p class="m-0 text-[12px] text-faint">Nothing here yet.</p>
			{/each}
		</div>
	</div>

	<!-- Next meetup, at the bottom of the page -->
	{#if nextEvent}
		<div
			class="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 px-5 py-7 md:px-10 md:py-9"
		>
			<div class="flex flex-col gap-3">
				<SectionLabel label="Next one" />
				<a
					href="/meetups/{nextEvent.slug}"
					class="text-[16px] leading-[1.4] text-ink no-underline hover:text-accent-hover"
				>
					{nextEvent.title}{#if nextEvent.subtitle}
						· {nextEvent.subtitle}{/if} · {formatShort(nextEvent.date)}<br />
					<span class="text-[13px] text-muted">{nextEvent.venue}</span>
				</a>
			</div>
			{#if nextEvent.lumaUrl}
				<CtaLink href={nextEvent.lumaUrl} size="md" class="w-full md:w-auto">RSVP →</CtaLink>
			{/if}
		</div>
	{/if}
</PageShell>
