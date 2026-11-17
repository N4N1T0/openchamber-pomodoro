import { describe, expect, test } from 'bun:test';
import {
  currentSegment,
  formatClock,
  MINUTE_MS,
  pauseRun,
  remainingMs,
  resumeRun,
  segmentsOf,
  settle,
  skipRun,
  startRun,
  validatePreset,
  type Preset,
} from './timer';

const classic: Preset = { id: 'classic', name: 'Classic Dungeon', workMinutes: 25, restMinutes: 5, rounds: 4 };
const single: Preset = { id: 'one', name: 'One', workMinutes: 10, restMinutes: 0, rounds: 1 };
const T0 = 1_000_000;

describe('segmentsOf', () => {
  test('work and rest alternate, with no rest after the last round', () => {
    const segments = segmentsOf(classic);
    expect(segments).toHaveLength(7);
    expect(segments.map((segment) => segment.phase)).toEqual([
      'work', 'rest', 'work', 'rest', 'work', 'rest', 'work',
    ]);
    expect(segments[0]?.ms).toBe(25 * MINUTE_MS);
    expect(segments[1]?.ms).toBe(5 * MINUTE_MS);
    expect(segments.at(-1)?.round).toBe(4);
  });

  test('zero rest means work rounds only', () => {
    expect(segmentsOf({ ...classic, restMinutes: 0 })).toHaveLength(4);
  });

  test('a single round is one work segment', () => {
    expect(segmentsOf(single)).toEqual([{ phase: 'work', round: 1, ms: 10 * MINUTE_MS }]);
  });
});

describe('settle', () => {
  test('stays on the current segment before it ends', () => {
    const run = startRun(classic, T0);
    const { run: next, entered } = settle(run, T0 + 1000);
    expect(next.index).toBe(0);
    expect(entered).toEqual([]);
    expect(next.status).toBe('running');
  });

  test('moves to the next segment at its exact end time', () => {
    const run = startRun(classic, T0);
    const { run: next, entered } = settle(run, T0 + 25 * MINUTE_MS);
    expect(next.index).toBe(1);
    expect(entered).toEqual([{ phase: 'rest', round: 1, ms: 5 * MINUTE_MS }]);
    expect(next.endAt).toBe(T0 + 30 * MINUTE_MS);
  });

  test('a long gap walks through every boundary without drifting', () => {
    const run = startRun(classic, T0);
    const now = T0 + 62 * MINUTE_MS;
    const { run: next, entered } = settle(run, now);
    // Work 0-25, rest 25-30, work 30-55, rest 55-60, work 60-85: the boundary
    // at 60 is a real end, so the run is in round 3 with 23 minutes left.
    expect(next.index).toBe(4);
    expect(entered.map((segment) => segment.phase)).toEqual(['rest', 'work', 'rest', 'work']);
    expect(next.endAt).toBe(T0 + 85 * MINUTE_MS);
    expect(remainingMs(next, now)).toBe(23 * MINUTE_MS);
  });

  test('finishes the run after the last segment', () => {
    const run = startRun(single, T0);
    const { run: next, entered } = settle(run, T0 + 11 * MINUTE_MS);
    expect(next.status).toBe('done');
    expect(entered).toEqual([]);
    expect(remainingMs(next, T0 + 11 * MINUTE_MS)).toBe(0);
  });

  test('a paused run does not move', () => {
    const paused = pauseRun(startRun(classic, T0), T0 + 1000);
    const { run: next, entered } = settle(paused, T0 + 60 * MINUTE_MS);
    expect(next).toEqual(paused);
    expect(entered).toEqual([]);
  });
});

describe('pause and resume', () => {
  test('pausing keeps the time left, and resuming continues from it', () => {
    const running = startRun(classic, T0);
    const paused = pauseRun(running, T0 + 10 * MINUTE_MS);
    expect(paused.status).toBe('paused');
    expect(remainingMs(paused, T0 + 999 * MINUTE_MS)).toBe(15 * MINUTE_MS);

    const resumed = resumeRun(paused, T0 + 500 * MINUTE_MS);
    expect(resumed.status).toBe('running');
    expect(remainingMs(resumed, T0 + 500 * MINUTE_MS)).toBe(15 * MINUTE_MS);
  });

  test('pausing twice or resuming a running run changes nothing', () => {
    const running = startRun(classic, T0);
    expect(resumeRun(running, T0)).toEqual(running);
    const paused = pauseRun(running, T0 + 1000);
    expect(pauseRun(paused, T0 + 5000)).toEqual(paused);
  });
});

describe('skip', () => {
  test('skipping while running starts the next segment now', () => {
    const next = skipRun(startRun(classic, T0), T0 + 2 * MINUTE_MS);
    expect(next.index).toBe(1);
    expect(next.status).toBe('running');
    expect(next.endAt).toBe(T0 + 2 * MINUTE_MS + 5 * MINUTE_MS);
  });

  test('skipping while paused stays paused with the full next segment', () => {
    const next = skipRun(pauseRun(startRun(classic, T0), T0 + MINUTE_MS), T0 + 2 * MINUTE_MS);
    expect(next.status).toBe('paused');
    expect(next.left).toBe(5 * MINUTE_MS);
  });

  test('skipping the last segment completes the run', () => {
    const done = skipRun(startRun(single, T0), T0);
    expect(done.status).toBe('done');
  });
});

describe('currentSegment', () => {
  test('reports the segment the run is on', () => {
    const run = skipRun(startRun(classic, T0), T0);
    expect(currentSegment(run)).toEqual({ phase: 'rest', round: 1, ms: 5 * MINUTE_MS });
  });
});

describe('validatePreset', () => {
  const ok = { name: 'Sprint', workMinutes: 25, restMinutes: 5, rounds: 4 };

  test('accepts a usable preset', () => {
    expect(validatePreset(ok)).toBeNull();
    expect(validatePreset({ ...ok, restMinutes: 0 })).toBeNull();
  });

  test('rejects an empty or long name', () => {
    expect(validatePreset({ ...ok, name: '   ' })).toContain('name');
    expect(validatePreset({ ...ok, name: 'x'.repeat(41) })).toContain('40');
  });

  test('rejects values out of range or not whole', () => {
    expect(validatePreset({ ...ok, workMinutes: 0 })).toContain('Work');
    expect(validatePreset({ ...ok, workMinutes: 241 })).toContain('Work');
    expect(validatePreset({ ...ok, restMinutes: -1 })).toContain('Rest');
    expect(validatePreset({ ...ok, rounds: 2.5 })).toContain('Rounds');
    expect(validatePreset({ ...ok, rounds: Number.NaN })).toContain('Rounds');
    expect(validatePreset({ ...ok, rounds: 21 })).toContain('Rounds');
  });
});

describe('formatClock', () => {
  test('formats minutes and seconds, rounding up the last second', () => {
    expect(formatClock(25 * MINUTE_MS)).toBe('25:00');
    expect(formatClock(1500)).toBe('00:02');
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(61_000)).toBe('01:01');
  });
});
