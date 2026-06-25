import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, QrCodeIcon, AlertCircleIcon, ClockIcon, LayersIcon, BarChart3Icon, InfoIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { QRCode } from '@/components/qr-code';
import { createClient } from '@/utils/supabase/server';
import { intervalSeconds, phaseSeconds, PhaseLike } from '@/utils/format-utils';
import Script from 'next/script';

// This enables dynamic rendering for this page since we need to fetch data
export const dynamic = 'force-dynamic';

// Define exercise types for reference
const EXERCISE_TYPES = [
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
const exerciseTypeLabelsMap: Record<string, string> = EXERCISE_TYPES.reduce((acc: Record<string, string>, type) => {
  acc[type.type] = type.name;
  return acc;
}, {});

// Format time in mm:ss format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Constants for difficulty levels
const difficultyLabelsMap: Record<string, string> = {
  lite: 'Lite',
  medium: 'Medium',
  hard: 'Hard'
};

// Define interval shape. breathe/hold may be plain numbers (legacy) or Phase objects.
interface Interval {
  breathe: PhaseLike;
  hold: PhaseLike;
  additionalTime?: number;
}

// Function to format exercise info
const getExerciseInfo = (exercise: any): string => {
  switch (exercise.type) {
    case 'o2Table':
    case 'co2Table': {
      if (!exercise.max_hold_time || !exercise.difficulty || !exercise.intervals) {
        return 'Invalid data';
      }

      const maxHold = formatTime(exercise.max_hold_time);
      const reps = exercise.intervals.length;
      const totalTime = exercise.intervals.reduce((sum: number, interval: Interval) => sum + intervalSeconds(interval), 0);

      return `${formatTime(totalTime)} total • ${reps} reps • ${difficultyLabelsMap[exercise.difficulty]} • ${maxHold} max`;
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

// Define the interface for formatted exercise info items
interface FormattedInfoItem {
  icon: React.ReactNode;
  text: string;
}

const formatExerciseInfo = (exercise: any): FormattedInfoItem[] => {
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
    } else if (part.includes('max') || part.includes('hold')) {
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

export default async function SharedExercisePage({ params }: { params: { id: string } }) {
  const exerciseId = params.id;
  // Custom scheme: used for the "Open in App" button and the auto-redirect script,
  // where a tap/JS redirect must open the app directly (universal links don't fire there).
  const deepLinkUrl = `oxyboost://shared-exercises/${exerciseId}`;
  // Universal link: used for the QR code. Phone QR scanners reject custom schemes
  // ("no usable data found"), and scanning an https link still opens the app via applinks.
  const universalLinkUrl = `https://oxyboo.st/shared-exercises/${exerciseId}`;
  
  // Initialize the Supabase client
  const supabase = await createClient();

  // Fetch the exercise data
  const { data: exercise, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', exerciseId)
    .eq('is_sharing', true) // Only fetch if the exercise is marked as shared
    .single();

  console.log('exercise', exercise, error);
  
  // Handle errors - exercise not found or not shared
  const notAvailable = !!error || !exercise;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Script to try opening the app on page load */}
      {!notAvailable && (
        <Script id="auto-deeplink" strategy="afterInteractive">
          {`
            function tryOpenApp() {
              // Store the current time to calculate timeout
              const start = Date.now();
              
              // Attempt to open the app
              window.location.href = "${deepLinkUrl}";
              
              // Set a timeout to check if app opened successfully
              // If we're still on this page after the timeout, app likely not installed
              setTimeout(function() {
                if (document.hidden || document.webkitHidden) {
                  // App was opened, do nothing
                  return;
                }
                
                // If we're still here after 2 seconds, the app probably isn't installed
                // The page will remain visible in this case
                const timeElapsed = Date.now() - start;
                if (timeElapsed > 2000) {
                  // Don't do anything, user will see the web page
                  console.log("App not installed or couldn't be opened");
                }
              }, 2500);
            }
            
            // Execute after a slight delay to ensure page is fully loaded
            setTimeout(tryOpenApp, 500);
          `}
        </Script>
      )}
      
      <Link 
        href="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {notAvailable ? 'Exercise Not Available' : 'Shared Exercise'}
          </CardTitle>
          
          <CardDescription>
            {notAvailable 
              ? 'This exercise may have been removed or is no longer being shared'
              : 'This exercise has been shared with you from OxyBoost'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {notAvailable ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircleIcon className="w-16 h-16 text-amber-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-center">Exercise Not Available</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center max-w-md">
                The exercise you're looking for may have been removed, is no longer being shared, or the link is invalid.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800 py-2 px-4">
                    <div className="flex items-center gap-2">
                      <InfoIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Exercise Details</h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Type: {exerciseTypeLabelsMap[exercise.type] || exercise.type}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formatExerciseInfo(exercise).map((item, index) => (
                        <div key={index} className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                          {item.icon}
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  Open this exercise in the OxyBoost app to view all details and add it to your collection.
                </p>
              </div>
              
              {/* App Install/Open Buttons */}
              <div className="space-y-4 mb-8">
                <a
                  href={deepLinkUrl}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center transition"
                >
                  Open in OxyBoost App
                </a>
                
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Don't have the app? Download it now
                </div>
                
                <div className="flex justify-center">
                  <Link 
                    href="https://apps.apple.com/us/app/oxyboost-apnea-trainer/id6739809272?platform=iphone"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      width={150}
                      height={50}
                      src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
                      alt="Download on the App Store"
                      className="dark:hidden"
                    />
                    <Image
                      width={150}
                      height={50}
                      src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-us"
                      alt="Download on the App Store"
                      className="hidden dark:block"
                    />
                  </Link>
                </div>
              </div>
              
              {/* QR Code for mobile scanning */}
              <div className="border-t pt-6 mt-6">
                <div className="text-center mb-4">
                  <h3 className="flex items-center justify-center text-lg font-medium">
                    <QrCodeIcon className="w-5 h-5 mr-2" />
                    Scan to Open on Mobile
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Use your phone's camera to scan this QR code
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-lg">
                    <QRCode value={universalLinkUrl} size={180} />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        {notAvailable && (
          <CardFooter className="flex justify-center">
            <Link 
              href="https://apps.apple.com/us/app/oxyboost-apnea-trainer/id6739809272?platform=iphone"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <Image
                width={150}
                height={50}
                src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
                alt="Download on the App Store"
                className="dark:hidden"
              />
              <Image
                width={150}
                height={50}
                src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-us"
                alt="Download on the App Store"
                className="hidden dark:block"
              />
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
