import { connectHost } from '@openchamber/sdk';
import {
  applyHostReady,
  mountBanner,
  mountButton,
  mountList,
  mountProgress,
  mountTextField,
} from '@openchamber/sdk/ui';
import { BUILT_IN_PRESETS, DEFAULT_PRESET_ID, isBuiltIn } from './presets';
import {
  createRunStore,
  readCustomPresets,
  readSelected,
  writeCustomPresets,
  writeSelected,
  type Snapshot,
} from './store';
import {
  currentSegment,
  formatClock,
  MINUTE_MS,
  pauseRun,
  remainingMs,
  resumeRun,
  segmentsOf,
  skipRun,
  startRun,
  validatePreset,
  type Preset,
  type Run,
  type Segment,
} from './timer';

const SITE = 'https://www.pomodorowarrior.com';

const host = connectHost();
const store = createRunStore(host);
const root = document.querySelector<HTMLElement>('#root')!;

let mounted = false;
let presets: Preset[] = [...BUILT_IN_PRESETS];
let selectedId = DEFAULT_PRESET_ID;
let run: Run | null = null;
let problem: string | null = null;
let draft = { name: '', workMinutes: '25', restMinutes: '5', rounds: '4' };
let audio: AudioContext | null = null;

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
};

const clockEl = element('div', 'clock');
const phaseEl = element('div', 'phase');
const progressEl = element('div');
const controlsEl = element('div', 'row');
const roundsEl = element('div', 'rounds');
const listEl = element('div');
const problemEl = element('div');
const fieldsEl = element('div', 'fields');
const editActionsEl = element('div', 'row');

const selectedPreset = (): Preset => presets.find((preset) => preset.id === selectedId) ?? presets[0]!;

const isActive = (current: Run | null): current is Run => current !== null && current.status !== 'done';

const describe = (preset: Preset): string => {
  const rest = preset.restMinutes > 0 ? `${preset.restMinutes} min rest` : 'no rest';
  return `${preset.workMinutes} min work · ${rest} · ${preset.rounds} rounds`;
};

/** Unlocks sound from a click, since the browser only allows it after a gesture. */
const unlockAudio = (): void => {
  try {
    audio ??= new AudioContext();
    void audio.resume();
  } catch {
    // No audio here: the toast still says what happened.
  }
};

const beep = (): void => {
  try {
    if (!audio) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    gain.gain.value = 0.12;
    oscillator.frequency.value = 880;
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.35);
  } catch {
    // Same as above.
  }
};

const announce = (segment: Segment, rounds: number): void => {
  beep();
  const name = segment.phase === 'work' ? 'Work' : 'Rest';
  void host.toast({ kind: 'info', message: `${name}, round ${segment.round} of ${rounds}.` }).catch(() => undefined);
};

const renderClock = (): void => {
  if (isActive(run)) {
    const segment = currentSegment(run);
    clockEl.textContent = formatClock(remainingMs(run, Date.now()));
    const name = segment?.phase === 'rest' ? 'Rest' : 'Work';
    const paused = run.status === 'paused' ? ' · paused' : '';
    phaseEl.textContent = `${name} · round ${segment?.round ?? 0} of ${run.preset.rounds}${paused}`;
    return;
  }

  if (run) {
    clockEl.textContent = '00:00';
    phaseEl.textContent = 'Session complete';
    return;
  }

  const first = segmentsOf(selectedPreset())[0];
  clockEl.textContent = formatClock(first ? first.ms : 0);
  phaseEl.textContent = 'Ready';
};

const renderProgress = (): void => {
  progressEl.replaceChildren();
  if (!run) return;

  const total = segmentsOf(run.preset).length;
  const finished = run.status === 'done';
  mountProgress(progressEl, {
    value: finished ? 100 : (run.index / total) * 100,
    label: finished ? 'Complete' : `Segment ${run.index + 1} of ${total}`,
  });
};

const renderControls = (): void => {
  controlsEl.replaceChildren();

  if (!isActive(run)) {
    mountButton(controlsEl, { label: 'Start', onClick: start });
    return;
  }

  mountButton(controlsEl, { label: run.status === 'paused' ? 'Resume' : 'Pause', onClick: toggle });
  mountButton(controlsEl, { label: 'Skip', variant: 'secondary', onClick: skip });
  mountButton(controlsEl, { label: 'Reset', variant: 'outline', onClick: reset });
};

const renderRounds = (): void => {
  roundsEl.replaceChildren();
  const preset = run ? run.preset : selectedPreset();
  const segments = segmentsOf(preset);
  const doneBefore = run ? (run.status === 'done' ? segments.length : run.index) : 0;
  const current = isActive(run) ? run.index : -1;

  segments.forEach((segment, index) => {
    const row = element('div', 'seg');
    row.dataset.state = index < doneBefore ? 'done' : index === current ? 'current' : 'todo';
    row.textContent = segment.phase === 'work' ? 'Work' : 'Rest';
    roundsEl.append(row);
  });
};

const renderList = (): void => {
  listEl.replaceChildren();
  mountList(listEl, {
    items: presets.map((preset) => ({
      id: preset.id,
      title: preset.name,
      subtitle: isBuiltIn(preset.id) ? describe(preset) : `${describe(preset)} · yours`,
    })),
    selectedId,
    ariaLabel: 'Timer types',
    onSelect: (id: string) => {
      selectType(id);
      render();
    },
  });
};

const renderEditActions = (): void => {
  editActionsEl.replaceChildren();
  if (isBuiltIn(selectedId)) return;
  mountButton(editActionsEl, { label: 'Delete this type', variant: 'destructive', onClick: deleteSelected });
};

const renderProblem = (): void => {
  problemEl.replaceChildren();
  if (problem) mountBanner(problemEl, { tone: 'error', title: problem });
};

const render = (): void => {
  renderClock();
  renderProgress();
  renderControls();
  renderRounds();
  renderList();
  renderEditActions();
  renderProblem();
};

const apply = (next: Snapshot): void => {
  for (const segment of next.entered) announce(segment, next.run?.preset.rounds ?? segment.round);
  if (next.finished) {
    beep();
    void host.toast({ kind: 'success', message: 'Session complete.' }).catch(() => undefined);
  }

  const changed = JSON.stringify(run) !== JSON.stringify(next.run);
  run = next.run;
  if (changed || next.entered.length > 0 || next.finished) render();
  else renderClock();
};

const perform = (change: Parameters<typeof store.change>[0]): void => {
  unlockAudio();
  store.change(change).then(apply, (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Could not save the timer.';
    void host.toast({ kind: 'error', message }).catch(() => undefined);
  });
};

const start = (): void => {
  const preset = selectedPreset();
  perform((current, now) => (current && current.status !== 'done' ? current : startRun(preset, now)));
};

const toggle = (): void => {
  perform((current, now) => {
    if (!current) return current;
    return current.status === 'running' ? pauseRun(current, now) : resumeRun(current, now);
  });
};

const skip = (): void => {
  perform((current, now) => (current ? skipRun(current, now) : current));
};

const reset = (): void => {
  perform(() => null);
};

const tick = (): void => {
  renderClock();
  const pending = store.sync();
  if (pending) pending.then(apply, () => undefined);
};

/** Selects a type and keeps Work Status in step with it. */
const selectType = (id: string): void => {
  selectedId = id;
  writeSelected(host, selectedPreset()).catch(() => undefined);
};

const persistCustom = (): void => {
  writeCustomPresets(host, presets.filter((preset) => !isBuiltIn(preset.id))).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Could not save your types.';
    void host.toast({ kind: 'error', message }).catch(() => undefined);
  });
};

const saveDraft = (): void => {
  const input = {
    name: draft.name,
    workMinutes: Number(draft.workMinutes),
    restMinutes: Number(draft.restMinutes),
    rounds: Number(draft.rounds),
  };

  problem = validatePreset(input);
  if (problem) {
    renderProblem();
    return;
  }

  const preset: Preset = {
    id: `custom-${Date.now().toString(36)}`,
    name: input.name.trim(),
    workMinutes: input.workMinutes,
    restMinutes: input.restMinutes,
    rounds: input.rounds,
  };
  presets = [...presets, preset];
  draft.name = '';
  persistCustom();
  selectType(preset.id);
  render();
};

const deleteSelected = (): void => {
  if (isBuiltIn(selectedId)) return;
  presets = presets.filter((preset) => preset.id !== selectedId);
  persistCustom();
  selectType(DEFAULT_PRESET_ID);
  render();
};

const buildLayout = (): void => {
  const timerCard = element('div', 'card');
  timerCard.append(clockEl, phaseEl, progressEl, controlsEl, roundsEl, problemEl);

  const typesTitle = element('div', 'section-title');
  typesTitle.textContent = 'Types';

  const accordion = element('details', 'accordion');
  const summary = element('summary');
  summary.textContent = 'New type';
  accordion.append(summary, fieldsEl, editActionsEl);

  const footer = element('p', 'footer');
  const credit = element('a');
  credit.href = SITE;
  credit.textContent = 'built with love by pomodoro warrior';
  credit.addEventListener('click', (event) => {
    event.preventDefault();
    void host.openUrl(SITE).catch(() => undefined);
  });
  footer.append(credit);

  root.append(timerCard, typesTitle, listEl, accordion, footer);

  mountTextField(fieldsEl, {
    label: 'Name',
    value: draft.name,
    placeholder: 'My sprint',
    onChange: (value: string) => {
      draft.name = value;
    },
  });
  mountTextField(fieldsEl, {
    label: 'Work (minutes)',
    value: draft.workMinutes,
    onChange: (value: string) => {
      draft.workMinutes = value;
    },
  });
  mountTextField(fieldsEl, {
    label: 'Rest (minutes, 0 for none)',
    value: draft.restMinutes,
    onChange: (value: string) => {
      draft.restMinutes = value;
    },
  });
  mountTextField(fieldsEl, {
    label: 'Rounds',
    value: draft.rounds,
    onChange: (value: string) => {
      draft.rounds = value;
    },
  });
  mountButton(fieldsEl, { label: 'Save type', variant: 'secondary', onClick: saveDraft });
};

host.onReady((context) => {
  applyHostReady(context, document.documentElement);
  if (mounted) return;
  mounted = true;

  buildLayout();
  render();

  // Restore the type chosen last time, so Work Status and the panel agree.
  Promise.all([readCustomPresets(host), readSelected(host)]).then(
    ([custom, chosen]) => {
      presets = [...BUILT_IN_PRESETS, ...custom.filter((preset) => !isBuiltIn(preset.id))];
      if (chosen && presets.some((preset) => preset.id === chosen.id)) selectedId = chosen.id;
      selectType(selectedId);
      render();
    },
    () => undefined,
  );

  tick();
  setInterval(tick, 1000);
});
