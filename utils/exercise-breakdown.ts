// Produces a full per-rep / per-cycle breakdown of a shared exercise so it can
// be reproduced manually without the app. The table-generation logic is ported
// 1:1 from the iOS app (Models/TableGenerator.swift + Difficulty constants) so
// the numbers match exactly.

import { phaseSeconds, intervalSeconds, PhaseLike } from './format-utils';

// MARK: - Difficulty constants (from Exercise.swift)

interface DifficultyConfig {
  reps: number;
  relaxReps: number;
  o2PercentMin: number;
  o2PercentMax: number;
  co2PercentMax: number;
}

const DIFFICULTIES: Record<string, DifficultyConfig> = {
  lite: { reps: 10, relaxReps: 6, o2PercentMin: 0.25, o2PercentMax: 0.7, co2PercentMax: 0.45 },
  medium: { reps: 8, relaxReps: 8, o2PercentMin: 0.3, o2PercentMax: 0.75, co2PercentMax: 0.55 },
  hard: { reps: 6, relaxReps: 10, o2PercentMin: 0.4, o2PercentMax: 0.87, co2PercentMax: 0.7 },
};

// MARK: - Normalized shapes

export interface RepInterval {
  breathe: { seconds: number; isTap: boolean };
  hold: { seconds: number; isTap: boolean };
  additional: number;
}

export interface BreathingColumn {
  label: string;
  values: number[]; // one entry per cycle; 0 means the phase is absent that cycle
}

export type ExerciseBreakdown =
  | { kind: 'table'; reps: RepInterval[] }
  | { kind: 'breathing'; cycleCount: number; columns: BreathingColumn[]; preparation: number }
  | { kind: 'none' };

// MARK: - Table generation (ported from TableGenerator.swift)

// Swift's Int(x.rounded()) rounds half away from zero; for positive values this
// matches Math.round, and every value here is positive.
const round = (x: number) => Math.round(x);
const clamp = (x: number, lo: number, hi: number) => Math.min(Math.max(x, lo), hi);

function generateO2Table(maxHoldTime: number, difficulty: DifficultyConfig): RepInterval[] {
  const reps = difficulty.reps;
  const step = (difficulty.o2PercentMax - difficulty.o2PercentMin) / (reps - 1);
  return Array.from({ length: reps }, (_, i) => {
    const percent = difficulty.o2PercentMin + step * i;
    const hold = round(maxHoldTime * percent);
    const breathe = clamp(round(hold * 0.4), 30, 150);
    return { breathe: { seconds: breathe, isTap: false }, hold: { seconds: hold, isTap: false }, additional: 0 };
  });
}

function generateCO2Table(maxHoldTime: number, difficulty: DifficultyConfig): RepInterval[] {
  const reps = difficulty.reps;
  const hold = round(maxHoldTime * difficulty.co2PercentMax);
  return Array.from({ length: reps }, (_, i) => {
    const base = clamp(round(hold * (0.2 + i / 10)), 45, 150);
    const breathe = round(base * (1 - i / reps));
    return { breathe: { seconds: breathe, isTap: false }, hold: { seconds: hold, isTap: false }, additional: 0 };
  });
}

function generateRelaxTable(maxHoldTime: number, difficulty: DifficultyConfig): RepInterval[] {
  const reps = difficulty.relaxReps;
  const breathe = maxHoldTime < 90 ? 60 : maxHoldTime <= 180 ? 90 : 120;
  return Array.from({ length: reps }, () => ({
    breathe: { seconds: breathe, isTap: false },
    hold: { seconds: maxHoldTime, isTap: false },
    additional: 0,
  }));
}

// MARK: - Normalize inline intervals (custom / relax with stored intervals)

interface RawInterval {
  breathe?: PhaseLike;
  hold?: PhaseLike;
  additionalTime?: number;
}

function isTap(phase: PhaseLike): boolean {
  return !!phase && typeof phase === 'object' && phase.type === 'tap';
}

function normalizeIntervals(intervals: RawInterval[]): RepInterval[] {
  return intervals.map((iv) => ({
    breathe: { seconds: phaseSeconds(iv.breathe), isTap: isTap(iv.breathe) },
    hold: { seconds: phaseSeconds(iv.hold), isTap: isTap(iv.hold) },
    additional: iv.additionalTime ?? 0,
  }));
}

// MARK: - Breathing cycles (box / triangle, from PracticeEngine.boxBreathingSteps)

function breathingBreakdown(exercise: any): ExerciseBreakdown {
  const cycles = exercise.cycles ?? 1;
  const inc = exercise.interval_increment ?? 0;
  const base: { label: string; value: number }[] = [
    { label: 'Inhale', value: exercise.inhale ?? 0 },
    { label: 'Hold', value: exercise.hold_after_inhale ?? 0 },
    { label: 'Exhale', value: exercise.exhale ?? 0 },
    { label: 'Hold', value: exercise.hold_after_exhale ?? 0 },
  ];

  const columns: BreathingColumn[] = base.map((slot) => ({
    label: slot.label,
    values: Array.from({ length: cycles }, (_, i) => (slot.value > 0 ? slot.value + inc * i : 0)),
  }));

  // Keep only phases that are present in at least one cycle.
  const kept = columns.filter((col) => col.values.some((v) => v > 0));

  return { kind: 'breathing', cycleCount: cycles, columns: kept, preparation: exercise.preparation ?? 0 };
}

// MARK: - Entry point

export function getExerciseBreakdown(exercise: any): ExerciseBreakdown {
  switch (exercise.type) {
    case 'boxBreathing':
    case 'triangleBreathing':
      return breathingBreakdown(exercise);

    case 'customTable':
      if (Array.isArray(exercise.intervals) && exercise.intervals.length) {
        return { kind: 'table', reps: normalizeIntervals(exercise.intervals) };
      }
      return { kind: 'none' };

    case 'o2Table':
    case 'co2Table':
    case 'relaxTable': {
      // Prefer stored intervals (custom-built relax tables); otherwise generate.
      if (Array.isArray(exercise.intervals) && exercise.intervals.length) {
        return { kind: 'table', reps: normalizeIntervals(exercise.intervals) };
      }
      const difficulty = DIFFICULTIES[exercise.difficulty];
      if (!exercise.max_hold_time || !difficulty) return { kind: 'none' };
      const reps =
        exercise.type === 'o2Table'
          ? generateO2Table(exercise.max_hold_time, difficulty)
          : exercise.type === 'co2Table'
          ? generateCO2Table(exercise.max_hold_time, difficulty)
          : generateRelaxTable(exercise.max_hold_time, difficulty);
      return { kind: 'table', reps };
    }

    default:
      return { kind: 'none' };
  }
}

// Total seconds for the whole breakdown (used for a summary line).
export function breakdownTotalSeconds(breakdown: ExerciseBreakdown): number {
  if (breakdown.kind === 'table') {
    return breakdown.reps.reduce(
      (sum, r) => sum + r.breathe.seconds + r.hold.seconds + r.additional,
      0
    );
  }
  if (breakdown.kind === 'breathing') {
    let total = breakdown.preparation;
    for (const col of breakdown.columns) {
      total += col.values.reduce((s, v) => s + v, 0);
    }
    return total;
  }
  return 0;
}
