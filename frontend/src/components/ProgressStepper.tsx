'use client';

import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Event Basics', shortLabel: 'Basics' },
  { label: 'Requirements', shortLabel: 'Details' },
  { label: 'Budget & Logistics', shortLabel: 'Budget' },
  { label: 'Review & Submit', shortLabel: 'Review' },
];

interface StepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li
              key={step.label}
              className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300
                    ${isCompleted
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium transition-colors
                    hidden sm:block
                    ${isCurrent
                      ? 'text-indigo-700'
                      : isCompleted
                        ? 'text-indigo-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  {step.label}
                </span>
                <span
                  className={`
                    mt-2 text-xs font-medium transition-colors
                    sm:hidden
                    ${isCurrent
                      ? 'text-indigo-700'
                      : isCompleted
                        ? 'text-indigo-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  {step.shortLabel}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300
                    ${index < currentStep ? 'bg-indigo-500' : 'bg-slate-200'}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
