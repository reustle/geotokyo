<script lang="ts">
	import { page } from '$app/state';

	/**
	 * <title>, description and Open Graph / Twitter card tags for a page.
	 * Absolute URLs use the prerender origin (SITE_ORIGIN at build time).
	 */
	let {
		title,
		description,
		siteName,
		image = '/favicon.png',
		type = 'website'
	}: {
		title: string;
		description: string;
		siteName: string;
		/** Path under static/ or absolute URL. Defaults to the square site icon. */
		image?: string;
		type?: 'website' | 'article';
	} = $props();

	const url = $derived(new URL(page.url.pathname, page.url.origin).href);
	const imageUrl = $derived(new URL(image, page.url.origin).href);
	// Square icon reads best as a small card; real photos get the large one.
	const card = $derived(image === '/favicon.png' ? 'summary' : 'summary_large_image');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content={card} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
