import { connectHost } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';
import { createRunStore } from '../panel/store';
import { currentSegment, formatClock, pauseRun, remainingMs, resumeRun, type Run } from '../panel/timer';

/** The Work Status section: the clock and one pause control, nothing else. */

const host = connectHost();
const store = createRunStore(host);

const clockEl = document.getElementById('clock')!;
const labelEl = document.getElementById('label')!;

type Controls = Parameters<typeof host.setStatusControls>[0];

let run: Run | null = null;
let started = false;
let canControl = false;
let controlsKey = '';

const renderClock = (): void => {
  if (!run) {
    clockEl.textContent = '--:--';
    labelEl.textContent = 'No session running';
    return;
  }

  if (run.status === 'done') {
    clockEl.textContent = '00:00';
    labelEl.textContent = 'Session complete';
    return;
  }

  const segment = currentSegment(run);
  const name = segment?.phase === 'rest' ? 'Rest' : 'Work';
  const paused = run.status === 'paused' ? ' · paused' : '';
  clockEl.textContent = formatClock(remainingMs(run, Date.now()));
  labelEl.textContent = `${name} ${segment?.round ?? 0}/${run.preset.rounds}${paused}`;
};

const renderControls = (): void => {
  if (!canControl) return;

  const key = run && run.status !== 'done' ? run.status : 'none';
  if (key === controlsKey) return;
  controlsKey = key;

  const controls: Controls =
    key === 'none' ? [] : [{ kind: 'button', id: 'toggle', label: key === 'paused' ? 'Resume' : 'Pause' }];
  host.setStatusControls(controls).catch(() => {
    controlsKey = '';
  });
};

const apply = (next: Run | null): void => {
  run = next;
  renderClock();
  renderControls();
};

let reading = false;

/**
 * Only shows the run. It never saves it: the panel saves phase changes, so
 * the two frames cannot race and drop an announcement.
 */
const tick = (): void => {
  renderClock();
  if (reading) return;
  reading = true;
  store
    .peek()
    .then(apply, () => undefined)
    .finally(() => {
      reading = false;
    });
};

host.onStatusControl(({ id }) => {
  if (id !== 'toggle') return;
  store
    .change((current, now) => {
      if (!current) return current;
      return current.status === 'running' ? pauseRun(current, now) : resumeRun(current, now);
    })
    .then((snapshot) => apply(snapshot.run), () => undefined);
});

host.onReady((context) => {
  applyHostReady(context, document.documentElement);
  canControl = context.features?.statusControls === true;
  if (started) return;
  started = true;

  tick();
  setInterval(tick, 1000);
});
