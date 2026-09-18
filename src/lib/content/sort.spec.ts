import { describe, expect, it } from 'vitest';
import { sortMaps } from './index';
import type { JapaneseMap } from './types';

function entry(name: string, date: string, event?: number): JapaneseMap {
	return {
		name,
		date,
		event,
		url: `https://example.com/${name}`,
		description: '',
		id: name.toLowerCase(),
		host: 'example.com',
		tags: ['tool'],
		status: 'discussed',
		eventColor: '#000',
		body: (() => {}) as unknown as JapaneseMap['body']
	};
}

describe('sortMaps', () => {
	const entries = [
		entry('Beta', '2026-01-02'),
		entry('alpha', '2026-09-17', 8),
		entry('Zulu', '2026-09-17', 9),
		entry('Charlie', '')
	];

	it('orders by date added, newest first, with undated entries last', () => {
		expect(sortMaps(entries, 'date').map((m) => m.name)).toEqual([
			'Zulu',
			'alpha',
			'Beta',
			'Charlie'
		]);
	});

	it('orders alphabetically by name, ignoring case', () => {
		expect(sortMaps(entries, 'name').map((m) => m.name)).toEqual([
			'alpha',
			'Beta',
			'Charlie',
			'Zulu'
		]);
	});

	it('does not mutate the input', () => {
		const before = entries.map((m) => m.name);
		sortMaps(entries, 'name');
		expect(entries.map((m) => m.name)).toEqual(before);
	});
});
