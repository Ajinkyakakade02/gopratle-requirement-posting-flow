'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FormData } from '@/types';
import {
  PLANNER_BUDGETS,
  PERFORMER_BUDGETS,
  PERFORMER_SETS,
  CREW_COMPENSATION,
  SHIFT_DURATIONS,
  EQUIPMENT_OPTIONS,
} from '@/types';
import { validateStep3 } from '@/lib/validation';

interface Step3Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

// ─── Planner Step 3 ──────────────────────────────────────────────────────────

function PlannerStep3Fields({
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
        Budget &amp; Additional Details
      </h3>

      <div>
        <label htmlFor="plannerBudget" className="form-label">
          Budget Range <span className="text-red-500">*</span>
        </label>
        <select
          id="plannerBudget"
          className={`form-select ${errors.plannerBudgetRange ? 'border-red-400' : ''}`}
          value={data.plannerBudgetRange}
          onChange={(e) => onChange({ plannerBudgetRange: e.target.value })}
        >
          <option value="">Select budget range</option>
          {PLANNER_BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {errors.plannerBudgetRange && (
          <p className="form-error">{errors.plannerBudgetRange}</p>
        )}
      </div>

      <div>
        <label htmlFor="preferredStyle" className="form-label">
          Preferred Event Style or Theme{' '}
          <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <input
          id="preferredStyle"
          type="text"
          className="form-input"
          placeholder="e.g. Rustic garden, Modern minimalist, Traditional"
          value={data.plannerPreferredStyle}
          onChange={(e) => onChange({ plannerPreferredStyle: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="plannerAdditional" className="form-label">
          Additional Requirements{' '}
          <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="plannerAdditional"
          className="form-textarea"
          rows={4}
          placeholder="Any specific expectations, preferences, or details..."
          value={data.plannerAdditionalRequirements}
          onChange={(e) =>
            onChange({ plannerAdditionalRequirements: e.target.value })
          }
        />
      </div>
    </div>
  );
}

// ─── Performer Step 3 ────────────────────────────────────────────────────────

function PerformerStep3Fields({
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
        Budget, Sets &amp; Technical Requirements
      </h3>

      <div>
        <label htmlFor="numberOfSets" className="form-label">
          Number of Performance Sets <span className="text-red-500">*</span>
        </label>
        <select
          id="numberOfSets"
          className={`form-select ${errors.performerNumberOfSets ? 'border-red-400' : ''}`}
          value={data.performerNumberOfSets}
          onChange={(e) => onChange({ performerNumberOfSets: e.target.value })}
        >
          <option value="">Select number of sets</option>
          {PERFORMER_SETS.map((s) => (
            <option key={s} value={s}>
              {s} {s === '1' ? 'set' : 'sets'}
            </option>
          ))}
        </select>
        {errors.performerNumberOfSets && (
          <p className="form-error">{errors.performerNumberOfSets}</p>
        )}
      </div>

      <div>
        <label htmlFor="performerBudget" className="form-label">
          Budget Range <span className="text-red-500">*</span>
        </label>
        <select
          id="performerBudget"
          className={`form-select ${errors.performerBudgetRange ? 'border-red-400' : ''}`}
          value={data.performerBudgetRange}
          onChange={(e) => onChange({ performerBudgetRange: e.target.value })}
        >
          <option value="">Select budget range</option>
          {PERFORMER_BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {errors.performerBudgetRange && (
          <p className="form-error">{errors.performerBudgetRange}</p>
        )}
      </div>

      <div>
        <label htmlFor="technicalReqs" className="form-label">
          Sound, Lighting, or Technical Requirements{' '}
          <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="technicalReqs"
          className="form-textarea"
          rows={3}
          placeholder="e.g. Sound system with 4 microphones, stage lighting..."
          value={data.performerTechnicalRequirements}
          onChange={(e) =>
            onChange({ performerTechnicalRequirements: e.target.value })
          }
        />
      </div>

      <div>
        <label htmlFor="performerAdditional" className="form-label">
          Additional Performance Requirements{' '}
          <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="performerAdditional"
          className="form-textarea"
          rows={3}
          placeholder="Any other performance requirements or preferences..."
          value={data.performerAdditionalRequirements}
          onChange={(e) =>
            onChange({ performerAdditionalRequirements: e.target.value })
          }
        />
      </div>
    </div>
  );
}

// ─── Crew Step 3 ─────────────────────────────────────────────────────────────

function CrewStep3Fields({
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
        Schedule, Budget &amp; Equipment
      </h3>

      <div>
        <label htmlFor="shiftDuration" className="form-label">
          Shift Duration / Working Schedule <span className="text-red-500">*</span>
        </label>
        <select
          id="shiftDuration"
          className={`form-select ${errors.crewShiftDuration ? 'border-red-400' : ''}`}
          value={data.crewShiftDuration}
          onChange={(e) => onChange({ crewShiftDuration: e.target.value })}
        >
          <option value="">Select shift duration</option>
          {SHIFT_DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.crewShiftDuration && (
          <p className="form-error">{errors.crewShiftDuration}</p>
        )}
      </div>

      <div>
        <label htmlFor="crewBudget" className="form-label">
          Compensation Budget Range <span className="text-red-500">*</span>
        </label>
        <select
          id="crewBudget"
          className={`form-select ${errors.crewCompensationBudget ? 'border-red-400' : ''}`}
          value={data.crewCompensationBudget}
          onChange={(e) => onChange({ crewCompensationBudget: e.target.value })}
        >
          <option value="">Select compensation range</option>
          {CREW_COMPENSATION.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.crewCompensationBudget && (
          <p className="form-error">{errors.crewCompensationBudget}</p>
        )}
      </div>

      <div>
        <label htmlFor="equipment" className="form-label">
          Equipment Provision <span className="text-red-500">*</span>
        </label>
        <select
          id="equipment"
          className={`form-select ${errors.crewEquipmentProvision ? 'border-red-400' : ''}`}
          value={data.crewEquipmentProvision}
          onChange={(e) => onChange({ crewEquipmentProvision: e.target.value })}
        >
          <option value="">Select option</option>
          {EQUIPMENT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {errors.crewEquipmentProvision && (
          <p className="form-error">{errors.crewEquipmentProvision}</p>
        )}
      </div>

      <div>
        <label htmlFor="crewAdditional" className="form-label">
          Additional Requirements{' '}
          <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="crewAdditional"
          className="form-textarea"
          rows={4}
          placeholder="Any other requirements, special instructions, or details..."
          value={data.crewAdditionalRequirements}
          onChange={(e) =>
            onChange({ crewAdditionalRequirements: e.target.value })
          }
        />
      </div>
    </div>
  );
}

// ─── Step 3 main ─────────────────────────────────────────────────────────────

export default function Step3BudgetLogistics({
  data,
  onChange,
  onNext,
  onPrev,
  errors,
  setErrors,
}: Step3Props) {
  const handleContinue = () => {
    const validationErrors = validateStep3(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {data.category === 'planner' && (
        <PlannerStep3Fields data={data} onChange={onChange} errors={errors} />
      )}
      {data.category === 'performer' && (
        <PerformerStep3Fields data={data} onChange={onChange} errors={errors} />
      )}
      {data.category === 'crew' && (
        <CrewStep3Fields data={data} onChange={onChange} errors={errors} />
      )}

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onPrev} className="btn-secondary">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        <button type="button" onClick={handleContinue} className="btn-primary">
          Continue to Review
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
