import React from 'react';
import { ClockIcon, HandIcon } from 'lucide-react';
import { formatTime } from '@/utils/format-utils';
import { getExerciseBreakdown, RepInterval, BreathingColumn } from '@/utils/exercise-breakdown';

const cell = 'px-3 py-2 text-sm text-center whitespace-nowrap';
const headCell = 'px-3 py-2 text-xs font-semibold uppercase tracking-wide text-center text-gray-500 dark:text-gray-400 whitespace-nowrap';

// A single phase cell: fixed time, a tap marker, or "–" when absent.
function PhaseCell({ seconds, isTap }: { seconds: number; isTap: boolean }) {
  if (isTap) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <HandIcon className="w-3.5 h-3.5" /> tap
      </span>
    );
  }
  if (seconds <= 0) return <span className="text-gray-400">–</span>;
  return <span className="font-mono text-gray-800 dark:text-gray-200">{formatTime(seconds)}</span>;
}

function TableBreakdown({ reps }: { reps: RepInterval[] }) {
  const hasAdditional = reps.some((r) => r.additional > 0);
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className={headCell}>#</th>
            <th className={headCell}>Breathe</th>
            <th className={headCell}>Hold</th>
            {hasAdditional && <th className={headCell}>+ Extra</th>}
          </tr>
        </thead>
        <tbody>
          {reps.map((r, i) => (
            <tr key={i} className="border-t border-gray-200 dark:border-gray-700 odd:bg-gray-50/50 dark:odd:bg-gray-800/30">
              <td className={`${cell} font-semibold text-gray-500 dark:text-gray-400`}>{i + 1}</td>
              <td className={cell}><PhaseCell seconds={r.breathe.seconds} isTap={r.breathe.isTap} /></td>
              <td className={cell}><PhaseCell seconds={r.hold.seconds} isTap={r.hold.isTap} /></td>
              {hasAdditional && (
                <td className={cell}>
                  {r.additional > 0 ? <span className="font-mono">+{formatTime(r.additional)}</span> : <span className="text-gray-400">–</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BreathingBreakdown({ columns, cycleCount, preparation }: { columns: BreathingColumn[]; cycleCount: number; preparation: number }) {
  return (
    <div className="space-y-3">
      {preparation > 0 && (
        <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border border-gray-200 dark:border-gray-700">
          <ClockIcon className="w-4 h-4 text-blue-500" />
          Preparation: {formatTime(preparation)} before the first cycle
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className={headCell}>Cycle</th>
              {columns.map((col, i) => (
                <th key={i} className={headCell}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cycleCount }, (_, cycle) => (
              <tr key={cycle} className="border-t border-gray-200 dark:border-gray-700 odd:bg-gray-50/50 dark:odd:bg-gray-800/30">
                <td className={`${cell} font-semibold text-gray-500 dark:text-gray-400`}>{cycle + 1}</td>
                {columns.map((col, i) => (
                  <td key={i} className={cell}>
                    {col.values[cycle] > 0 ? (
                      <span className="font-mono text-gray-800 dark:text-gray-200">{col.values[cycle]}s</span>
                    ) : (
                      <span className="text-gray-400">–</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ExerciseBreakdown({ exercise }: { exercise: any }) {
  const breakdown = getExerciseBreakdown(exercise);
  if (breakdown.kind === 'none') return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Full Breakdown
      </h3>
      {breakdown.kind === 'table' ? (
        <TableBreakdown reps={breakdown.reps} />
      ) : (
        <BreathingBreakdown
          columns={breakdown.columns}
          cycleCount={breakdown.cycleCount}
          preparation={breakdown.preparation}
        />
      )}
    </div>
  );
}
