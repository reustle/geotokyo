<script lang="ts">
	/**
	 * Email signup. No provider is wired yet: on submit it shows an inline
	 * confirmation in place of the form. Swap `submit()` for the real call.
	 */
	let { variant = 'footer' }: { variant?: 'footer' | 'compact' } = $props();

	let email = $state('');
	let done = $state(false);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!email) return;
		done = true;
	}
</script>

{#if done}
	<p class="m-0 text-[12px] leading-[1.6] text-ink">
		Thanks. We'll email <span class="text-accent">{email}</span> when the next meetup is set.
	</p>
{:else if variant === 'footer'}
	<form onsubmit={submit} class="flex flex-wrap gap-2">
		<input
			type="email"
			required
			bind:value={email}
			placeholder="you@example.com"
			aria-label="Email address"
			class="min-w-0 flex-[1_1_180px] border border-rule-strong bg-transparent px-[14px] py-[13px] text-[13px] text-ink outline-none focus:border-ink"
		/>
		<button
			type="submit"
			class="min-h-11 flex-[1_0_auto] cursor-pointer border-0 bg-accent px-4 py-[13px] text-[12px] tracking-[.06em] text-canvas transition-colors hover:bg-accent-hover"
		>
			SUBSCRIBE
		</button>
	</form>
{:else}
	<form onsubmit={submit} class="flex border border-rule-strong">
		<input
			type="email"
			required
			bind:value={email}
			placeholder="newsletter: you@example.com"
			aria-label="Email address"
			class="min-w-0 flex-1 border-0 bg-transparent px-3 py-[11px] text-[12px] text-ink outline-none"
		/>
		<button
			type="submit"
			class="cursor-pointer border-0 bg-ink px-3 py-[11px] text-[11px] text-canvas hover:bg-accent-hover"
		>
			GO
		</button>
	</form>
{/if}
