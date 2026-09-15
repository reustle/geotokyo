<script lang="ts">
	import './layout.css';

	let { data, children } = $props();
</script>

<svelte:head>
	<link
		rel="alternate"
		type="application/rss+xml"
		title="{data.site.title} map links"
		href="/maps.xml"
	/>
</svelte:head>

{@render children()}
