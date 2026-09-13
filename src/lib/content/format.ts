/** Parse an ISO `YYYY-MM-DD` string as a local date without timezone drift. */
export function parseDate(iso: string): Date {
	const [y, m, d] = iso.split('-').map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Accept strings or Date objects (js-yaml turns unquoted dates into Date). */
export function toIsoDate(value: unknown): string {
	if (value instanceof Date) {
		return value.toISOString().slice(0, 10);
	}
	return String(value ?? '');
}

export function todayIso(): string {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

/** "Thu Sep 17" */
export function formatShort(iso: string): string {
	return parseDate(iso).toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});
}

/** "Wed, May 27 2026" */
export function formatLong(iso: string): string {
	const d = parseDate(iso);
	const wd = d.toLocaleDateString('en-US', { weekday: 'short' });
	const md = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	return `${wd}, ${md} ${d.getFullYear()}`;
}

/** "WED, MAY 27 · 18:00" */
export function formatCoverDate(iso: string, startTime?: string): string {
	const d = parseDate(iso);
	const wd = d.toLocaleDateString('en-US', { weekday: 'short' });
	const md = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	const base = `${wd}, ${md}`.toUpperCase();
	return startTime ? `${base} · ${startTime}` : base;
}

export function timeRange(start?: string, end?: string): string {
	if (start && end) return `${start} – ${end}`;
	return start ?? end ?? '';
}

export function pad2(n: number): string {
	return String(n).padStart(2, '0');
}

/** "protomaps.com" from a URL; "—" when it is not a real URL. */
export function hostOf(url: string): string {
	try {
		const u = new URL(url);
		return u.hostname.replace(/^www\./, '');
	} catch {
		return '—';
	}
}
