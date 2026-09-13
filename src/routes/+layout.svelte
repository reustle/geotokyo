<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="{data.site.title} projects"
		href="/projects.xml"
	/>
</svelte:head>

{@render children()}
