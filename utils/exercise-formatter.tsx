import React from 'react';
import { ClockIcon, LayersIcon, BarChart3Icon } from 'lucide-react';
import { formatTime, intervalSeconds, phaseSeconds, PhaseLike } from './format-utils';
import { difficultyLabelsMap } from './exercise-types';

// Define interval shape. breathe/hold may be plain numbers (legacy) or Phase objects.
export interface Interval {
  breathe: PhaseLike;
  hold: PhaseLike;
  additionalTime?: number;
}

// Define the interface for formatted exercise info items
export interface FormattedInfoItem {
  icon: React.ReactNode;
  text: string;
}

// Function to format exercise info
export const getExerciseInfo = (exercise: any): string => {
  switch (exercise.type) {
    case 'o2Table':
    case 'co2Table': {
      if (!exercise.max_hold_time || !exercise.difficulty || !exercise.intervals) {
        return 'Invalid data';
      }

      const maxHold = formatTime(exercise.max_hold_time);
      const reps = exercise.intervals.length;
      const totalTime = exercise.intervals.reduce((sum: number, interval: Interval) => sum + intervalSeconds(interval), 0);

      return `${formatTime(totalTime)} total • ${reps} reps • ${difficultyLabelsMap[exercise.difficulty]} • ${maxHold} PB`;
    }

    case 'relaxTable': {
      if (!exercise.max_hold_time || !exercise.difficulty || !exercise.intervals) {
        return 'Invalid data';
      }

      const comfortTime = formatTime(exercise.max_hold_time);
      const reps = exercise.intervals.length;
      const totalTime = exercise.intervals.reduce((sum: number, interval: Interval) => sum + intervalSeconds(interval), 0);
      const breatheTime = formatTime(phaseSeconds(exercise.intervals[0].breathe));

      return `${formatTime(totalTime)} total • ${reps} reps • ${breatheTime} breathe • ${comfortTime} hold`;
    }

    case 'customTable': {
      if (!exercise.intervals) {
        return 'Invalid data';
      }

      const reps = exercise.intervals.length;
      const totalTime = exercise.intervals.reduce((sum: number, interval: Interval) => sum + intervalSeconds(interval), 0);
      const maxHold = Math.max(...exercise.intervals.map((interval: Interval) => phaseSeconds(interval.hold)));

      return `${formatTime(totalTime)} total • ${reps} reps • ${formatTime(maxHold)} max`;
    }

    case 'boxBreathing': {
      if (!exercise.inhale || !exercise.cycles) return 'Invalid data';

      const cycleTime = (exercise.inhale || 0) +
                       (exercise.hold_after_inhale || 0) +
                       (exercise.exhale || 0) +
                       (exercise.hold_after_exhale || 0);

      const cyclesStr = exercise.cycles === 1 ? 'cycle' : 'cycles';
      const totalTime = cycleTime * exercise.cycles;

      // Show phases in seconds
      const phases = [
        exercise.inhale,
        exercise.hold_after_inhale || 0,
        exercise.exhale,
        exercise.hold_after_exhale || 0
      ].join('-');

      const incrementInfo = exercise.interval_increment > 0 ? ` +${exercise.interval_increment}s` : '';

      return `${formatTime(totalTime)} total • ${exercise.cycles} ${cyclesStr} • ${phases}s${incrementInfo}`;
    }

    default: {
      return 'Exercise details not available';
    }
  }
};

export const formatExerciseInfo = (exercise: any): FormattedInfoItem[] => {
  const info = getExerciseInfo(exercise);
  if (info === 'Invalid data' || info === 'Exercise details not available') {
    return [];
  }
  
  // Split the info string by bullet points
  const parts = info.split('•').map(part => part.trim()).filter(Boolean);
  
  const result: FormattedInfoItem[] = [];
  
  parts.forEach((part) => {
    if (part.includes('total')) {
      result.push({ 
        icon: <ClockIcon className="w-4 h-4 text-blue-500" />,
        text: part
      });
    } else if (part.includes('reps') || part.includes('cycles')) {
      result.push({ 
        icon: <LayersIcon className="w-4 h-4 text-emerald-500" />,
        text: part
      });
    } else if (part.includes('Lite') || part.includes('Medium') || part.includes('Hard')) {
      result.push({ 
        icon: <BarChart3Icon className="w-4 h-4 text-amber-500" />,
        text: part
      });
    } else if (part.includes('max') || part.includes('hold') || part.includes('PB')) {
      result.push({
        icon: <ClockIcon className="w-4 h-4 text-purple-500" />,
        text: part
      });
    } else if (part.includes('breathe')) {
      result.push({ 
        icon: <ClockIcon className="w-4 h-4 text-cyan-500" />,
        text: part
      });
    } else if (part.includes('-') && part.includes('s')) {
      result.push({ 
        icon: <BarChart3Icon className="w-4 h-4 text-indigo-500" />,
        text: part
      });
    } else {
      result.push({ 
        icon: <BarChart3Icon className="w-4 h-4 text-gray-500" />,
        text: part
      });
    }
  });
  
  return result;
}; 