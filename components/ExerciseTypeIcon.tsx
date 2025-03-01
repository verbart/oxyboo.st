"use client";

import React from 'react';
import { Square, ArrowUpFromLine, ArrowDownFromLine, PenSquare, Sparkles } from 'lucide-react';

interface ExerciseTypeIconProps {
  type: string;
  className?: string;
}

export const ExerciseTypeIcon: React.FC<ExerciseTypeIconProps> = ({ type, className = 'w-4 h-4' }) => {
  switch (type) {
    case 'boxBreathing':
      return <Square className={`${className} text-teal-500`} />;
    case 'o2Table':
      return <ArrowUpFromLine className={`${className} text-blue-500`} />;
    case 'co2Table':
      return <ArrowDownFromLine className={`${className} text-red-500`} />;
    case 'customTable':
      return <PenSquare className={`${className} text-purple-500`} />;
    case 'relaxTable':
      return <Sparkles className={`${className} text-amber-500`} />;
    default:
      return <Square className={`${className} text-gray-500`} />;
  }
}; 