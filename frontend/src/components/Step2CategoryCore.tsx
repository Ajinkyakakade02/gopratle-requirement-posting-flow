'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FormData } from '@/types';
import {
  PLANNER_SERVICES,
  PLANNING_STAGES,
  PERFORMER_TYPES,
  PERFORMANCE_DURATIONS,
  CREW_ROLES,
  EXPERIENCE_LEVELS,
} from '@/types';
import { validateStep2 } from '@/lib/validation';

interface Step2Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

// ─── Checkbox group helper ───────────────────────────────────────────────────

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  error,
  name,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  error?: string;
  name: string;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <fieldset>
      <legend className="form-label">
        {label} <span className="text-red-500">*</span>
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50/50"
          >
            <input
              type="checkbox"
              name={name}
              value={opt}
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="accent-indigo-600 w-4 h-4 rounded"
            />
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        ))}
      </div>
      {error && <p className="form-error">{error}</p>}
    </fieldset>
  );
}

// ─── Planner fields ──────────────────────────────────────────────────────────

function PlannerFields({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (u: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">
        Tell us about your planning requirements
      </h3>

      <CheckboxGroup
        label="Services Required"
        options={[...PLANNER_SERVICES]}
        selected={data.plannerServicesRequired}
        onChange={(val) => onChange({ plannerServicesRequired: val })}
        error={errors.plannerServicesRequired}
        name="plannerServices"
      />

      <div>
        <label htmlFor="plannerGuestCount" className="form-label">
          Estimated Guest Count <span className="text-red-500">*</span>
        </label>
        <input
          id="plannerGuestCount"
          type="number"
          min={1}
          className={`form-input max-w-xs ${errors.plannerEstimatedGuestCount ? 'border-red-400' : ''}`}
          placeholder="e.g. 150"
          value={data.plannerEstimatedGuestCount}
          onChange={(e) =>
            onChange({
              plannerEstimatedGuestCount: e.target.value ? Number(e.target.value) : '',
            })
          }
        />
        {errors.plannerEstimatedGuestCount && (
          <p className="form-error">{errors.plannerEstimatedGuestCount}</p>
        )}
      </div>

      <div>
        <label htmlFor="planningStage" className="form-label">
          Planning Stage <span className="text-red-500">*</span>
        </label>
        <select
          id="planningStage"
          className={`form-select ${errors.plannerPlanningStage ? 'border-red-400' : ''}`}
          value={data.plannerPlanningStage}
          onChange={(e) => onChange({ plannerPlanningStage: e.target.value })}
        >
          <option value="">Select planning stage</option>
          {PLANNING_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.plannerPlanningStage && (
          <p className="form-error">{errors.plannerPlanningStage}</p>
        )}
      </div>
    </div>
  );
}

// ─── Performer fields ────────────────────────────────────────────────────────

function PerformerFields({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (u: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">
        Tell us about the performance
      </h3>

      <div>
        <label htmlFor="performerType" className="form-label">
          Performer Type <span className="text-red-500">*</span>
        </label>
        <select
          id="performerType"
          className={`form-select ${errors.performerType ? 'border-red-400' : ''}`}
          value={data.performerType}
          onChange={(e) => onChange({ performerType: e.target.value })}
        >
          <option value="">Select performer type</option>
          {PERFORMER_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.performerType && (
          <p className="form-error">{errors.performerType}</p>
        )}
      </div>

      <div>
        <label htmlFor="performerGenre" className="form-label">
          Genre or Performance Style <span className="text-red-500">*</span>
        </label>
        <input
          id="performerGenre"
          type="text"
          className={`form-input ${errors.performerGenreOrStyle ? 'border-red-400' : ''}`}
          placeholder="e.g. Bollywood, Rock, Classical"
          value={data.performerGenreOrStyle}
          onChange={(e) => onChange({ performerGenreOrStyle: e.target.value })}
        />
        {errors.performerGenreOrStyle && (
          <p className="form-error">{errors.performerGenreOrStyle}</p>
        )}
      </div>

      <div>
        <label htmlFor="performerCount" className="form-label">
          Number of Performers <span className="text-red-500">*</span>
        </label>
        <input
          id="performerCount"
          type="number"
          min={1}
          className={`form-input max-w-xs ${errors.performerCount ? 'border-red-400' : ''}`}
          placeholder="e.g. 4"
          value={data.performerCount}
          onChange={(e) =>
            onChange({
              performerCount: e.target.value ? Number(e.target.value) : '',
            })
          }
        />
        {errors.performerCount && (
          <p className="form-error">{errors.performerCount}</p>
        )}
      </div>

      <div>
        <label htmlFor="performerDuration" className="form-label">
          Performance Duration <span className="text-red-500">*</span>
        </label>
        <select
          id="performerDuration"
          className={`form-select ${errors.performerDuration ? 'border-red-400' : ''}`}
          value={data.performerDuration}
          onChange={(e) =>
            onChange({
              performerDuration: e.target.value,
              performerCustomDuration:
                e.target.value !== 'Custom duration' ? '' : data.performerCustomDuration,
            })
          }
        >
          <option value="">Select duration</option>
          {PERFORMANCE_DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.performerDuration && (
          <p className="form-error">{errors.performerDuration}</p>
        )}

        {data.performerDuration === 'Custom duration' && (
          <div className="mt-3">
            <label htmlFor="customDuration" className="form-label">
              Specify Duration <span className="text-red-500">*</span>
            </label>
            <input
              id="customDuration"
              type="text"
              className={`form-input ${errors.performerCustomDuration ? 'border-red-400' : ''}`}
              placeholder="e.g. 45 minutes"
              value={data.performerCustomDuration}
              onChange={(e) => onChange({ performerCustomDuration: e.target.value })}
            />
            {errors.performerCustomDuration && (
              <p className="form-error">{errors.performerCustomDuration}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Crew fields ─────────────────────────────────────────────────────────────

function CrewFields({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (u: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">
        Tell us about the crew you need
      </h3>

      <CheckboxGroup
        label="Required Crew Roles"
        options={[...CREW_ROLES]}
        selected={data.crewRequiredRoles}
        onChange={(val) => onChange({ crewRequiredRoles: val })}
        error={errors.crewRequiredRoles}
        name="crewRoles"
      />

      <div>
        <label htmlFor="crewCount" className="form-label">
          Number of Crew Members <span className="text-red-500">*</span>
        </label>
        <input
          id="crewCount"
          type="number"
          min={1}
          className={`form-input max-w-xs ${errors.crewCount ? 'border-red-400' : ''}`}
          placeholder="e.g. 8"
          value={data.crewCount}
          onChange={(e) =>
            onChange({ crewCount: e.target.value ? Number(e.target.value) : '' })
          }
        />
        {errors.crewCount && <p className="form-error">{errors.crewCount}</p>}
      </div>

      <div>
        <label htmlFor="experienceLevel" className="form-label">
          Experience Level <span className="text-red-500">*</span>
        </label>
        <select
          id="experienceLevel"
          className={`form-select ${errors.crewExperienceLevel ? 'border-red-400' : ''}`}
          value={data.crewExperienceLevel}
          onChange={(e) => onChange({ crewExperienceLevel: e.target.value })}
        >
          <option value="">Select experience level</option>
          {EXPERIENCE_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        {errors.crewExperienceLevel && (
          <p className="form-error">{errors.crewExperienceLevel}</p>
        )}
      </div>
    </div>
  );
}

// ─── Step 2 main ─────────────────────────────────────────────────────────────

export default function Step2CategoryCore({
  data,
  onChange,
  onNext,
  onPrev,
  errors,
  setErrors,
}: Step2Props) {
  const handleContinue = () => {
    const validationErrors = validateStep2(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {data.category === 'planner' && (
        <PlannerFields data={data} onChange={onChange} errors={errors} />
      )}
      {data.category === 'performer' && (
        <PerformerFields data={data} onChange={onChange} errors={errors} />
      )}
      {data.category === 'crew' && (
        <CrewFields data={data} onChange={onChange} errors={errors} />
      )}

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onPrev} className="btn-secondary">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        <button type="button" onClick={handleContinue} className="btn-primary">
          Continue
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
