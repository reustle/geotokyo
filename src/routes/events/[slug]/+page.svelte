<script lang="ts">
	import { formatCoverDate, formatLong, formatShort, timeRange } from '$lib/content/format';
	import {
		CtaLink,
		EventCover,
		ProjectCompactRow,
		MetaList,
		NewsletterForm,
		PageShell,
		PhotoGrid,
		ScheduleRow,
		SectionLabel,
		SpeakerRow
	} from '$lib/components';

	let { data } = $props();
	const { event, eventProjects, nextEvent } = $derived(data);
	const Body = $derived(event.body);

	const meta = $derived([
		{
			term: 'when',
			value: [formatLong(event.date), timeRange(event.startTime, event.endTime)].filter(Boolean)
		},
		{ term: 'where', value: [event.venue, event.city ?? ''].filter(Boolean) },
		...(event.hosts?.length ? [{ term: 'hosts', value: event.hosts.join(', ') }] : []),
		...(event.lumaUrl
			? [{ term: 'luma', value: event.lumaUrl.replace(/^https?:\/\//, ''), href: event.lumaUrl }]
			: [])
	]);
</script>

<svelte:head>
	<title>{event.title} · {data.site.title}</title>
	{#if event.highlight}<meta name="description" content={event.highlight} />{/if}
</svelte:head>

<PageShell site={data.site} organizers={data.organizers} current="/events">
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
				<a href="/events" class="text-muted no-underline hover:text-accent-hover">← events</a>
				· {event.upcoming ? 'Upcoming' : 'Past'}
			</div>
			<h1 class="m-0 text-[28px] leading-[1.2] font-light">{event.title}</h1>
			<MetaList rows={meta} />
			<div class="prose-geo mt-auto"><Body /></div>
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

	<!-- Photos -->
	{#if event.photos?.length}
		<div class="flex flex-col gap-5 border-b border-rule px-5 py-7 md:px-10 md:py-9">
			<SectionLabel label="Photos">
				{#snippet aside()}{event.photos?.length}{/snippet}
			</SectionLabel>
			<PhotoGrid photos={event.photos} />
		</div>
	{/if}

	<!-- Projects + next-event aside -->
	<div class="grid md:grid-cols-[minmax(0,1fr)_380px]">
		<div
			class="flex flex-col gap-4 border-b border-rule px-5 py-7 md:border-r md:border-b-0 md:px-10 md:py-9"
		>
			<SectionLabel
				label={event.upcoming ? 'Projects queued for this event' : 'Projects from this event'}
			>
				{#snippet aside()}<a href="/projects">all projects →</a>{/snippet}
			</SectionLabel>
			{#each eventProjects as project (project.id)}
				<ProjectCompactRow {project} />
			{:else}
				<p class="m-0 text-[12px] text-faint">Nothing here yet.</p>
			{/each}
		</div>
		<div class="flex flex-col gap-[14px] px-5 py-7 md:px-8 md:py-9">
			{#if nextEvent}
				<SectionLabel label="Next one" />
				<div class="text-[16px] leading-[1.4]">
					{nextEvent.shortName ?? nextEvent.title} · {formatShort(nextEvent.date)}<br />
					<span class="text-[13px] text-muted">{nextEvent.venue}</span>
				</div>
				{#if nextEvent.lumaUrl}
					<CtaLink href={nextEvent.lumaUrl} size="md">RSVP →</CtaLink>
				{/if}
			{:else}
				<SectionLabel label="Newsletter" />
				<p class="m-0 text-[12px] leading-[1.6] text-muted">{data.site.newsletterBlurb}</p>
			{/if}
			<div class="mt-2"><NewsletterForm variant="compact" /></div>
		</div>
	</div>
</PageShell>
