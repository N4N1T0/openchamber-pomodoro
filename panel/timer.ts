/**
 * The timer itself: pure functions over plain data. Nothing here reads the
 * clock or the host; callers pass `now`, so every rule is testable.
 *
 * A preset is a number of rounds. Each round is work, then rest, except that
 * the last round has no rest after it (the same model as the Dungeons of
 * pomodoro-warrior: waves, combat, rest between waves).
 */

export const MINUTE_MS = 60_000;

export const LIMITS = {
  nameLength: 40,
  workMinutes: [1, 240],
  restMinutes: [0, 120],
  rounds: [1, 20],
} as const;

// Type aliases, not interfaces: the host's storage takes JSON values, and only
// an alias gets the index signature that JSON assignment needs.
export type Preset = {
  id: string;
  name: string;
  workMinutes: number;
  restMinutes: number;
  rounds: number;
};

export type Phase = 'work' | 'rest';

export interface Segment {
  phase: Phase;
  /** 1-based round this segment belongs to. */
  round: number;
  ms: number;
}

export type RunStatus = 'running' | 'paused' | 'done';

/**
 * One timer run. `endAt` is the epoch time the current segment ends, used
 * while running; `left` is the time still to go, used while paused. Both
 * are absolute, so a frame that sleeps or reloads picks up the right time.
 */
export type Run = {
  preset: Preset;
  index: number;
  status: RunStatus;
  endAt: number;
  left: number;
};

export const segmentsOf = (preset: Preset): Segment[] => {
  const segments: Segment[] = [];
  for (let round = 1; round <= preset.rounds; round += 1) {
    segments.push({ phase: 'work', round, ms: preset.workMinutes * MINUTE_MS });
    if (preset.restMinutes > 0 && round < preset.rounds) {
      segments.push({ phase: 'rest', round, ms: preset.restMinutes * MINUTE_MS });
    }
  }
  return segments;
};

export const startRun = (preset: Preset, now: number): Run => {
  const first = segmentsOf(preset)[0];
  if (!first) throw new Error('A preset needs at least one segment');
  return { preset, index: 0, status: 'running', endAt: now + first.ms, left: first.ms };
};

/**
 * Moves a running run past every segment that ended by `now`. Each segment
 * starts where the previous one really ended, so a long gap does not shift
 * the rest of the run. Returns the segments it entered, in order.
 */
export const settle = (run: Run, now: number): { run: Run; entered: Segment[] } => {
  if (run.status !== 'running') return { run, entered: [] };

  const segments = segmentsOf(run.preset);
  const entered: Segment[] = [];
  let index = run.index;
  let endAt = run.endAt;

  while (now >= endAt) {
    const next = segments[index + 1];
    if (!next) {
      return { run: { ...run, index, status: 'done', endAt: now, left: 0 }, entered };
    }
    index += 1;
    endAt += next.ms;
    entered.push(next);
  }

  return { run: { ...run, index, endAt }, entered };
};

export const remainingMs = (run: Run, now: number): number => {
  if (run.status === 'running') return Math.max(0, run.endAt - now);
  if (run.status === 'paused') return run.left;
  return 0;
};

export const pauseRun = (run: Run, now: number): Run =>
  run.status === 'running' ? { ...run, status: 'paused', left: Math.max(0, run.endAt - now) } : run;

export const resumeRun = (run: Run, now: number): Run =>
  run.status === 'paused' ? { ...run, status: 'running', endAt: now + run.left } : run;

/** Ends the current segment now and starts the next one in the same state. */
export const skipRun = (run: Run, now: number): Run => {
  if (run.status === 'done') return run;

  const next = segmentsOf(run.preset)[run.index + 1];
  if (!next) return { ...run, status: 'done', endAt: now, left: 0 };

  return run.status === 'paused'
    ? { ...run, index: run.index + 1, left: next.ms }
    : { ...run, index: run.index + 1, endAt: now + next.ms };
};

export const currentSegment = (run: Run): Segment | undefined => segmentsOf(run.preset)[run.index];

export const totalSegments = (preset: Preset): number => segmentsOf(preset).length;

export interface PresetInput {
  name: string;
  workMinutes: number;
  restMinutes: number;
  rounds: number;
}

/** Returns the first problem with a preset, or null when it is usable. */
export const validatePreset = (input: PresetInput): string | null => {
  const name = input.name.trim();
  if (name.length === 0) return 'Give the type a name.';
  if (name.length > LIMITS.nameLength) return `The name is at most ${LIMITS.nameLength} characters.`;

  const checks: Array<[number, readonly [number, number], string]> = [
    [input.workMinutes, LIMITS.workMinutes, 'Work'],
    [input.restMinutes, LIMITS.restMinutes, 'Rest'],
    [input.rounds, LIMITS.rounds, 'Rounds'],
  ];
  for (const [value, [min, max], label] of checks) {
    if (!Number.isInteger(value) || value < min || value > max) {
      return `${label} must be a whole number from ${min} to ${max}.`;
    }
  }
  return null;
};

/** mm:ss, rounded up so the last second still shows. */
export const formatClock = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};
