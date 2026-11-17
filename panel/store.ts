import type { connectHost } from '@openchamber/sdk';
import { settle, type Preset, type Run, type RunStatus, type Segment } from './timer';

type Host = ReturnType<typeof connectHost>;

export const RUN_KEY = 'run';
export const PRESETS_KEY = 'presets';
/** A copy of the type selected in the panel, so Work Status can start it. */
export const SELECTED_KEY = 'selected';

const STATUSES: readonly RunStatus[] = ['running', 'paused', 'done'];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isPreset = (value: unknown): value is Preset =>
  isObject(value) &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  typeof value.workMinutes === 'number' &&
  typeof value.restMinutes === 'number' &&
  typeof value.rounds === 'number';

const isRun = (value: unknown): value is Run =>
  isObject(value) &&
  isPreset(value.preset) &&
  typeof value.index === 'number' &&
  STATUSES.some((status) => status === value.status) &&
  typeof value.endAt === 'number' &&
  typeof value.left === 'number';

const sameRun = (a: Run | null, b: Run | null): boolean => JSON.stringify(a) === JSON.stringify(b);

export const readCustomPresets = async (host: Host): Promise<Preset[]> => {
  const raw = await host.storage.get(PRESETS_KEY);
  return Array.isArray(raw) ? raw.filter(isPreset) : [];
};

export const writeCustomPresets = (host: Host, presets: Preset[]): Promise<void> =>
  host.storage.set(PRESETS_KEY, presets);

export const readSelected = async (host: Host): Promise<Preset | null> => {
  const raw = await host.storage.get(SELECTED_KEY);
  return isPreset(raw) ? raw : null;
};

export const writeSelected = (host: Host, preset: Preset): Promise<void> =>
  host.storage.set(SELECTED_KEY, preset);

const readRun = async (host: Host): Promise<Run | null> => {
  const raw = await host.storage.get(RUN_KEY);
  // The run carries a copy of its preset, so deleting a type never breaks it.
  return isRun(raw) ? raw : null;
};

const writeRun = (host: Host, run: Run | null): Promise<void> =>
  run ? host.storage.set(RUN_KEY, run) : host.storage.delete(RUN_KEY);

export interface Snapshot {
  run: Run | null;
  /** Segments this read moved the run into, oldest first. */
  entered: Segment[];
  /** True when this read is the one that finished the run. */
  finished: boolean;
}

/**
 * Every change to the stored run goes through one queue: read, apply, settle
 * to now, write if changed. The panel and the Work Status section share the
 * same storage, so each read sees what the other frame saved.
 */
export const createRunStore = (host: Host) => {
  let tail: Promise<unknown> = Promise.resolve();
  let syncing = false;

  const queue = <T>(job: () => Promise<T>): Promise<T> => {
    const next = tail.then(job);
    tail = next.catch(() => undefined);
    return next;
  };

  const change = (apply: (run: Run | null, now: number) => Run | null): Promise<Snapshot> =>
    queue(async () => {
      const now = Date.now();
      const stored = await readRun(host);
      const applied = apply(stored, now);
      const settled = applied ? settle(applied, now) : null;
      const next = settled ? settled.run : null;

      if (!sameRun(stored, next)) await writeRun(host, next);

      const finished = Boolean(settled && applied?.status !== 'done' && next?.status === 'done');
      return { run: next, entered: settled?.entered ?? [], finished };
    });

  /** Picks up what the other frame did; skipped while one read is already queued. */
  const sync = (): Promise<Snapshot> | null => {
    if (syncing) return null;
    syncing = true;
    return change((run) => run).finally(() => {
      syncing = false;
    });
  };

  /**
   * Reads the run settled to now without saving it. Only the panel saves
   * settled runs, so it is the one that sees every phase change; a frame that
   * only shows the clock uses this.
   */
  const peek = async (): Promise<Run | null> => {
    const stored = await readRun(host);
    return stored ? settle(stored, Date.now()).run : null;
  };

  return { change, sync, peek };
};
