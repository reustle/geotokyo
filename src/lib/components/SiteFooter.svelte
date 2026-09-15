<script lang="ts">
	import type { Organizer, Site } from '$lib/content/types';
	import Wordmark from './Wordmark.svelte';
	import NewsletterForm from './NewsletterForm.svelte';

	let { site, organizers }: { site: Site; organizers: Organizer[] } = $props();
	const year = new Date().getFullYear();
</script>

<footer id="subscribe" class="mt-auto border-t border-rule bg-bg-deep">
	<div
		class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-12 gap-y-9 px-5 py-7 md:px-12 md:py-11"
	>
		<div class="flex flex-col gap-[14px]">
			<Wordmark size="lg" />
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- author-controlled content -->
			<span class="text-[12px] leading-[1.7] text-muted">{@html site.tagline}</span>
		</div>
		<div class="flex flex-col gap-[14px]">
			<div class="eyebrow">Organizers</div>
			{#each organizers as o (o.slug)}
				<div class="flex flex-col gap-[2px] text-[13px] leading-[1.5]">
					<span>{o.name}</span>
					<span class="text-[11px] text-muted">{o.role}</span>
				</div>
			{/each}
		</div>
		<div class="flex flex-col gap-3">
			<div class="eyebrow">Newsletter</div>
			<p class="m-0 text-[12px] leading-[1.6] text-muted">{site.newsletterBlurb}</p>
			<NewsletterForm />
		</div>
	</div>
	<div
		class="flex flex-wrap justify-between gap-x-5 gap-y-2 border-t border-rule-soft px-5 py-[18px] text-[11px] text-faint md:px-12"
	>
		<span>© {year} {site.title}</span>
		<span class="flex flex-wrap gap-5">
			<a
				href={site.lumaUrl}
				target="_blank"
				rel="noopener"
				class="text-faint no-underline hover:text-accent-hover">Luma</a
			>
			<a
				href={site.githubUrl}
				target="_blank"
				rel="noopener"
				class="text-faint no-underline hover:text-accent-hover">GitHub</a
			>
			<span>{site.coordinates}</span>
		</span>
	</div>
</footer>
