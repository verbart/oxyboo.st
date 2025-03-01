"use client";

import React from 'react';
import { FormattedInfoItem, formatExerciseInfo } from '@/utils/exercise-formatter';
import { ShareIconButton } from '@/components/ShareIconButton';
import { ExerciseTypeIcon } from '@/components/ExerciseTypeIcon';
import { exerciseTypeLabelsMap } from '@/utils/exercise-types';
import { ChevronRight, BookOpenIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ExerciseDetailsProps {
  exercise: any;
  className?: string;
}

export const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({ exercise, className = '' }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const exerciseInfo = formatExerciseInfo(exercise);
  
  const bannerBgClass = isDark 
    ? 'bg-gray-800/60 border-gray-700' 
    : 'bg-gray-100/80 border-gray-200';

  const cardBgClass = isDark 
    ? 'bg-gray-900/90 border-gray-800' 
    : 'bg-white/90 border-gray-200';
    
  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Top info banner */}
      <div className={`relative flex items-center justify-between rounded-xl border p-3 ${bannerBgClass}`}>
        <div className="flex items-center gap-2">
          <ExerciseTypeIcon type={exercise.type} className="w-5 h-5" /> 
          <h2 className="font-medium">{exerciseTypeLabelsMap[exercise.type] || 'Exercise'}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <ShareIconButton sharingUrl={`${window.location.origin}/shared-exercises/${exercise.id}`} />
          
          <a 
            href={`oxyboost://exercise/${exercise.id}`} 
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
          >
            <BookOpenIcon className="mr-1.5 -ml-0.5 h-4 w-4" />
            Open in App
            <ChevronRight className="ml-1 -mr-0.5 h-4 w-4" />
          </a>
        </div>
      </div>
      
      {/* Exercise details card */}
      <div className={`rounded-xl border p-4 ${cardBgClass}`}>
        <h1 className="text-xl font-semibold mb-3">{exercise.name}</h1>
        
        {exercise.description && (
          <p className="text-muted-foreground mb-4">{exercise.description}</p>
        )}
        
        {exerciseInfo.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exerciseInfo.map((item: FormattedInfoItem, index: number) => (
              <div key={index} className="flex items-center gap-2">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 