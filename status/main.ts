import { connectHost } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';
import { createRunStore, readSelected } from '../panel/store';
import {
  currentSegment,
  formatClock,
  pauseRun,
  remainingMs,
  resumeRun,
  segmentsOf,
  startRun,
  type Preset,
  type Run,
} from '../panel/timer';

/**
 * The Work Status section: the clock, one control that pauses or resumes a
 * running session, and one that starts the type chosen in the panel when
 * nothing is running.
 */

const host = connectHost();
const store = createRunStore(host);

const clockEl = document.getElementById('clock')!;
const labelEl = document.getElementById('label')!;

type Controls = Parameters<typeof host.setStatusControls>[0];

let run: Run | null = null;
let selected: Preset | null = null;
let started = false;
let canControl = false;
let controlsKey = '';
let reading = false;

const isActive = (current: Run | null): current is Run => current !== null && current.status !== 'done';

const renderClock = (): void => {
  if (isActive(run)) {
    const segment = currentSegment(run);
    const phase = segment?.phase === 'rest' ? 'rest' : 'work';
    clockEl.textContent = formatClock(remainingMs(run, Date.now()));
    clockEl.dataset.phase = phase;
    clockEl.dataset.paused = String(run.status === 'paused');
    const paused = run.status === 'paused' ? ' · paused' : '';
    labelEl.textContent = `${phase === 'rest' ? 'Rest' : 'Work'} ${segment?.round ?? 0}/${run.preset.rounds}${paused}`;
    return;
  }

  clockEl.dataset.phase = 'idle';
  clockEl.dataset.paused = 'false';

  if (run) {
    clockEl.textContent = '00:00';
    labelEl.textContent = 'Session complete';
    return;
  }

  const first = selected ? segmentsOf(selected)[0] : undefined;
  clockEl.textContent = first ? formatClock(first.ms) : '--:--';
  labelEl.textContent = selected ? `${selected.name} · ready` : 'No type selected';
};

const renderControls = (): void => {
  if (!canControl) return;

  const key = `${isActive(run) ? run.status : 'idle'}|${selected?.id ?? ''}`;
  if (key === controlsKey) return;
  controlsKey = key;

  let controls: Controls = [];
  if (isActive(run)) {
    controls = [{ kind: 'button', id: 'toggle', label: run.status === 'paused' ? 'Resume' : 'Pause' }];
  } else if (selected) {
    controls = [{ kind: 'button', id: 'start', label: `Start ${selected.name}` }];
  }

  host.setStatusControls(controls).catch(() => {
    controlsKey = '';
  });
};

const apply = (next: Run | null): void => {
  run = next;
  renderClock();
  renderControls();
};

/** Only shows the run. It never saves it: the panel saves phase changes, so the frames cannot race. */
const tick = (): void => {
  renderClock();
  if (reading) return;
  reading = true;
  Promise.all([store.peek(), readSelected(host)])
    .then(([next, preset]) => {
      selected = preset;
      apply(next);
    }, () => undefined)
    .finally(() => {
      reading = false;
    });
};

host.onStatusControl(({ id }) => {
  if (id === 'toggle') {
    store
      .change((current, now) => {
        if (!current) return current;
        return current.status === 'running' ? pauseRun(current, now) : resumeRun(current, now);
      })
      .then((snapshot) => apply(snapshot.run), () => undefined);
    return;
  }

  if (id === 'start') {
    readSelected(host)
      .then((preset) => {
        if (!preset) return;
        return store
          .change((current, now) => (isActive(current) ? current : startRun(preset, now)))
          .then((snapshot) => apply(snapshot.run));
      })
      .catch(() => undefined);
  }
});

host.onReady((context) => {
  applyHostReady(context, document.documentElement);
  canControl = context.features?.statusControls === true;
  if (started) return;
  started = true;

  tick();
  setInterval(tick, 1000);
});
