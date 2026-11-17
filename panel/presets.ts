import type { Preset } from './timer';

/**
 * The three Dungeons of pomodoro-warrior, under the same keys, so the two
 * apps name the same thing the same way.
 */
export const BUILT_IN_PRESETS: readonly Preset[] = [
  { id: 'classic', name: 'Classic Dungeon', workMinutes: 25, restMinutes: 5, rounds: 4 },
  { id: 'siege', name: 'Siege Crypt', workMinutes: 50, restMinutes: 10, rounds: 2 },
  { id: 'lightning', name: 'Lightning Raid', workMinutes: 15, restMinutes: 3, rounds: 6 },
];

export const DEFAULT_PRESET_ID = 'classic';

export const isBuiltIn = (id: string): boolean => BUILT_IN_PRESETS.some((preset) => preset.id === id);

export const presetById = (presets: readonly Preset[], id: string): Preset | undefined =>
  presets.find((preset) => preset.id === id);
