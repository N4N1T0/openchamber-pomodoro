import { describe, expect, test } from 'bun:test';
import type { connectHost } from '@openchamber/sdk';
import { createRunStore, RUN_KEY } from './store';
import { MINUTE_MS, startRun, type Preset, type Run } from './timer';

type Host = ReturnType<typeof connectHost>;

const preset: Preset = { id: 'one', name: 'One', workMinutes: 1, restMinutes: 1, rounds: 2 };

/** A host whose storage is a plain map, so tests read exactly what was written. */
const fakeHost = (initial: Record<string, unknown> = {}) => {
  const data = new Map<string, unknown>(Object.entries(initial));
  const storage = {
    get: async (key: string) => data.get(key),
    set: async (key: string, value: unknown) => {
      data.set(key, JSON.parse(JSON.stringify(value)));
    },
    delete: async (key: string) => {
      data.delete(key);
    },
    keys: async () => [...data.keys()].sort(),
  };
  return { host: { storage } as unknown as Host, data };
};

describe('createRunStore', () => {
  test('a stored run in the past is settled and reports what it entered', async () => {
    // Started two minutes ago: work (1 min) ended, rest (1 min) ended, round 2 work is now on.
    const started = Date.now() - 2 * MINUTE_MS;
    const run = startRun(preset, started);
    const { host, data } = fakeHost({ [RUN_KEY]: run });

    const snapshot = await createRunStore(host).change((current) => current);

    expect(snapshot.entered.map((segment) => segment.phase)).toEqual(['rest', 'work']);
    expect(snapshot.run?.index).toBe(2);
    expect(snapshot.run?.status).toBe('running');
    expect(snapshot.finished).toBe(false);
    expect((data.get(RUN_KEY) as Run).index).toBe(2);
  });

  test('a run that ended while away is finished exactly once', async () => {
    const run = startRun(preset, Date.now() - 10 * MINUTE_MS);
    const { host, data } = fakeHost({ [RUN_KEY]: run });
    const store = createRunStore(host);

    const first = await store.change((current) => current);
    expect(first.finished).toBe(true);
    expect(first.run?.status).toBe('done');
    expect((data.get(RUN_KEY) as Run).status).toBe('done');

    const second = await store.change((current) => current);
    expect(second.finished).toBe(false);
  });

  test('a change is applied to the stored run and returned', async () => {
    const { host, data } = fakeHost();
    const store = createRunStore(host);

    const started = await store.change((current, now) => current ?? startRun(preset, now));
    expect(started.run?.status).toBe('running');
    expect(data.has(RUN_KEY)).toBe(true);

    const cleared = await store.change(() => null);
    expect(cleared.run).toBeNull();
    expect(data.has(RUN_KEY)).toBe(false);
  });

  test('an invalid stored value is treated as no run', async () => {
    const { host } = fakeHost({ [RUN_KEY]: { index: 'nope' } });
    const snapshot = await createRunStore(host).change((current) => current);
    expect(snapshot.run).toBeNull();
  });
});
