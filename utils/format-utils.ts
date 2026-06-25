// Format time in mm:ss format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// A phase (breathe/hold) can be stored either as a plain number (legacy format)
// or as a Phase object { type, duration } (current app format). A "tap" phase has
// no fixed duration and contributes 0 to time totals.
export type PhaseLike = number | { type?: string; duration?: number } | null | undefined;

export const phaseSeconds = (phase: PhaseLike): number => {
  if (typeof phase === 'number') return phase;
  if (phase && typeof phase === 'object') {
    if (phase.type === 'tap') return 0;
    return phase.duration ?? 0;
  }
  return 0;
};

// Total seconds for a single interval: breathe + hold + any additional time.
export const intervalSeconds = (
  interval: { breathe?: PhaseLike; hold?: PhaseLike; additionalTime?: number }
): number => phaseSeconds(interval.breathe) + phaseSeconds(interval.hold) + (interval.additionalTime ?? 0); 