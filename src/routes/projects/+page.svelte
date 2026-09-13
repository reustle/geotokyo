<script lang="ts">
	import { pad2 } from '$lib/content/format';
	import { FilterChips, ProjectTable, PageShell, SectionLabel } from '$lib/components';

	let { data } = $props();
	let filter = $state('all');

	const rows = $derived(
		filter === 'all' ? data.projects : data.projects.filter((l) => l.tag === filter)
	);

	let submitUrl = $state('');
	const issueHref = $derived(
		`${data.site.githubUrl}/issues/new?title=${encodeURIComponent('Project: ' + submitUrl)}&body=${encodeURIComponent(
			`URL: ${submitUrl}\n\nOne-liner:\n\nEvent:\n`
		)}`
	);
	function submitProject(e: SubmitEvent) {
		e.preventDefault();
		if (submitUrl) window.open(issueHref, '_blank', 'noopener');
	}
</script>

<svelte:head>
	<title>Projects · {data.site.title}</title>
	<meta name="description" content={data.site.projectsIntro} />
</svelte:head>

<PageShell site={data.site} organizers={data.organizers} current="/projects">
	<div class="flex flex-col gap-[18px] border-b border-rule px-5 pt-14 pb-8 md:px-10">
		<div class="text-[11px] tracking-[.18em] text-accent">$ cat projects.md</div>
		<h1 class="m-0 max-w-[700px] text-[36px] leading-[1.15] font-light text-pretty">
			{data.site.projectsIntro}
		</h1>
		<p class="m-0 max-w-[560px] text-[13px] leading-[1.7] text-muted">{data.site.projectsBlurb}</p>
		<FilterChips options={data.tags} bind:value={filter} />
	</div>

	<div class="grid min-h-[600px] md:grid-cols-[minmax(0,1fr)_300px]">
		<div class="border-b border-rule md:border-r md:border-b-0">
			<ProjectTable
				projects={rows}
				footer="{pad2(data.projects.length)} projects · showing {filter}"
			/>
		</div>

		<aside class="flex flex-col gap-6 p-5 text-[12px] leading-[1.6] md:p-7">
			<div class="flex flex-col gap-2">
				<SectionLabel label="By event" class="text-[10px]" />
				<div class="flex flex-col gap-[6px]">
					{#each data.byEvent as row (row.label)}
						<span>
							{#if row.event}
								<a href="/events/{row.event.slug}" class="no-underline" style="color:{row.color}"
									>{row.label}</a
								>
							{:else}
								<span style="color:{row.color}">{row.label}</span>
							{/if}
							· {row.count}{row.planned ? ' planned' : ''}
						</span>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<SectionLabel label="Submit a project" class="text-[10px]" />
				<p class="m-0 text-muted">
					Presenting soon? Send the URL and a one-liner. It goes up with your talk.
				</p>
				<form onsubmit={submitProject} class="flex flex-col gap-[6px]">
					<input
						type="url"
						required
						bind:value={submitUrl}
						placeholder="https://"
						aria-label="Project URL"
						class="border border-rule-strong bg-transparent px-3 py-[10px] text-[12px] text-ink outline-none focus:border-ink"
					/>
					<button
						type="submit"
						class="cursor-pointer border-0 bg-ink px-3 py-[10px] text-[11px] tracking-[.08em] text-canvas hover:bg-accent-hover"
					>
						SUBMIT
					</button>
				</form>
				<p class="m-0 text-[11px] text-faint">Opens a pre-filled issue on GitHub.</p>
			</div>

			<div class="mt-auto flex flex-col gap-2">
				<SectionLabel label="Export" class="text-[10px]" />
				<div class="flex gap-3">
					<a href="/projects.json" class="text-[12px]">projects.json</a>
					<a href="/projects.xml" class="text-[12px]">RSS</a>
				</div>
			</div>
		</aside>
	</div>
</PageShell>
