<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Organizer, Site } from '$lib/content/types';
	import SiteHeader from './SiteHeader.svelte';
	import SiteFooter from './SiteFooter.svelte';

	/** Header + footer chrome for every non-home page. */
	let {
		site,
		organizers,
		current = '',
		children
	}: { site: Site; organizers: Organizer[]; current?: string; children: Snippet } = $props();
</script>

<div class="mx-auto flex min-h-screen max-w-[1400px] flex-col">
	<SiteHeader nav={site.nav} {current} />
	{@render children()}
	<SiteFooter {site} {organizers} />
</div>
