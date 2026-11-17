# Pomodoro — an OpenChamber extension

A focus timer on OpenChamber's rail: pick a type (the three Dungeons of [Pomodoro Warrior](https://www.pomodorowarrior.com)), or make your own, and run it round by round — work, then rest. A mini version sits in the Work Status section, with the clock and a pause button.

## Install

Requirements: OpenChamber 2.7.2 or newer.

Once published, open OpenChamber's Settings → Extensions and add the repository URL. Approve what it asks for: this extension needs no files, no network and no local service.

The **Pomodoro** icon opens the panel. The Work Status section shows the same timer, compact.

## What it does

- **Types.** Classic Dungeon (25 min work, 5 min rest, 4 rounds), Siege Crypt (50 / 10, 2 rounds) and Lightning Raid (15 / 3, 6 rounds). Add your own with a name, work minutes, rest minutes (0 for none) and rounds.
- **Rounds.** Each round is work, then rest. There is no rest after the last round.
- **Controls.** Start, Pause / Resume, Skip, Reset. The round list shows where you are.
- **Work Status.** The clock, the phase and one Pause / Resume button. Start and types are in the panel.
- **Alerts.** A toast and a short beep when a phase starts, and when the session completes.
- **Resumes.** The run is saved as an end time, not a countdown, so reloading the panel or switching away picks up at the right moment.

## Limits

- Alerts only reach you while OpenChamber is open. A closed app cannot beep.
- The Work Status section only runs while it is shown and expanded.
- No long break yet: each type is rounds of work and rest.
- The footer link opens the Pomodoro Warrior site in your browser.

## Development

Requires [Bun](https://bun.sh).

```
bun install
bun test
bunx tsc --noEmit
bunx openchamber-guest-bundle panel/main.ts panel/main.js
bunx openchamber-guest-bundle status/main.ts status/main.js
bunx openchamber-guest-check
```

The built `.js` files are committed, because installing an extension never builds it. CI runs the tests, the type check, rebuilds both bundles and fails if they differ from the sources. Rebuild and commit `panel/main.js` and `status/main.js` after every change to their sources.

| Path | What it is |
| --- | --- |
| `panel/timer.ts` | The timer as pure functions: rounds, settle, pause, resume, skip, validation |
| `panel/store.ts` | Reads and writes the run and custom types; one queue for every change |
| `panel/presets.ts` | The built-in types, under the same keys as Pomodoro Warrior |
| `panel/main.ts` | The panel: clock, controls, round list, types, new type form, footer |
| `status/main.ts` | The Work Status section: clock and pause |
| `panel/*.test.ts` | Tests for the timer and the store |
| `package.json` | The extension manifest: id, name, icon, the panel and the status section |
| `assets/pomodoro.svg` | The rail icon |

## Licence

MIT. See [LICENSE](LICENSE).
