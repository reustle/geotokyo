import { describe, expect, it } from 'vitest';
import {
	formatCoverDate,
	formatLong,
	formatShort,
	hostOf,
	pad2,
	timeRange,
	toIsoDate
} from './format';

describe('date formatting', () => {
	it('formats short and long dates without timezone drift', () => {
		expect(formatShort('2026-09-17')).toBe('Thu, Sep 17');
		expect(formatLong('2026-05-27')).toBe('Wed, May 27 2026');
		expect(formatCoverDate('2026-05-27', '18:00')).toBe('WED, MAY 27 · 18:00');
	});

	it('normalises Date objects from YAML to ISO strings', () => {
		expect(toIsoDate(new Date(Date.UTC(2026, 8, 17)))).toBe('2026-09-17');
		expect(toIsoDate('2026-09-17')).toBe('2026-09-17');
	});

	it('builds time ranges', () => {
		expect(timeRange('18:00', '20:00')).toBe('18:00 – 20:00');
		expect(timeRange('18:00')).toBe('18:00');
		expect(timeRange()).toBe('');
	});
});

describe('hostOf', () => {
	it('strips www and handles non-URLs', () => {
		expect(hostOf('https://www.mlit.go.jp/plateau/')).toBe('mlit.go.jp');
		expect(hostOf('#')).toBe('—');
	});
});

describe('pad2', () => {
	it('zero-pads', () => {
		expect(pad2(8)).toBe('08');
		expect(pad2(12)).toBe('12');
	});
});
