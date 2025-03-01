// Define exercise types for reference
export const EXERCISE_TYPES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Also known as four-square breathing (inhale, hold-in, exhale, hold-out)',
    type: 'boxBreathing'
  },
  {
    id: 'o2',
    name: 'O2 Table',
    description: 'Progressive increase in breath hold time',
    type: 'o2Table'
  },
  {
    id: 'co2',
    name: 'CO2 Table',
    description: 'Progressive decrease in breathing time',
    type: 'co2Table'
  },
  {
    id: 'custom',
    name: 'Custom Table',
    description: 'Create your own breath hold intervals',
    type: 'customTable'
  },
  {
    id: 'relax',
    name: 'Relaxation Table',
    description: 'Practice mindfulness and relaxation through steady, comfortable holds without contractions',
    type: 'relaxTable'
  }
];

// Map of exercise type labels by type value
export const exerciseTypeLabelsMap: Record<string, string> = EXERCISE_TYPES.reduce((acc: Record<string, string>, type) => {
  acc[type.type] = type.name;
  return acc;
}, {});

// Constants for difficulty levels
export const difficultyLabelsMap: Record<string, string> = {
  lite: 'Lite',
  medium: 'Medium',
  hard: 'Hard'
}; 