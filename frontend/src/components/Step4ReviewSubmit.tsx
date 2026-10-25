'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  Send,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import type { FormData, Category, APIResponse } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { validateAll } from '@/lib/validation';
import { submitRequirement } from '@/lib/api';

interface Step4Props {
  data: FormData;
  onPrev: () => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
}

// ─── Review Section ──────────────────────────────────────────────────────────

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  if (!value || (typeof value === 'string' && value.trim() === '')) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-slate-100 last:border-0">
      <dt className="text-sm text-slate-500 sm:w-48 shrink-0 font-medium">{label}</dt>
      <dd className="text-sm text-slate-800 mt-0.5 sm:mt-0">{value}</dd>
    </div>
  );
}

// ─── Step 4 component ────────────────────────────────────────────────────────

export default function Step4ReviewSubmit({
  data,
  onPrev,
  onGoToStep,
  onReset,
}: Step4Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<APIResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const category = data.category as Category;

  const handleSubmit = async () => {
    // Validate everything before sending
    const errors = validateAll(data);
    if (Object.keys(errors).length > 0) {
      setSubmitError('Some required fields are missing. Please go back and fill them in.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    try {
      const result = await submitRequirement(data);
      if (result.success) {
        setSubmitResult(result);
      } else {
        setSubmitError(result.message || 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitError(
        'Unable to connect to the server. Please check that the backend is running and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success view ──
  if (submitResult?.success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Requirement Submitted Successfully!
        </h2>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Your {CATEGORY_LABELS[category]?.toLowerCase()} requirement has been saved.
        </p>

        <div className="inline-block bg-slate-50 rounded-xl px-6 py-4 text-left mb-8">
          <dl className="space-y-2">
            <div className="flex gap-3">
              <dt className="text-sm text-slate-500">Reference ID:</dt>
              <dd className="text-sm font-mono font-medium text-slate-800">
                {submitResult.data?.id}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-sm text-slate-500">Category:</dt>
              <dd className="text-sm font-medium text-slate-800 capitalize">
                {submitResult.data?.category}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-sm text-slate-500">Submitted:</dt>
              <dd className="text-sm text-slate-800">
                {submitResult.data?.createdAt
                  ? new Date(submitResult.data.createdAt).toLocaleString()
                  : ''}
              </dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="btn-primary"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Post Another Requirement
        </button>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (d: string) => {
    if (!d) return '';
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return d;
    }
  };

  const dateDisplay =
    data.dateMode === 'range'
      ? `${formatDate(data.startDate)} — ${formatDate(data.endDate)}`
      : formatDate(data.startDate);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          Review Your Requirement
        </h3>
        <p className="text-sm text-slate-500">
          Please review all details before submitting.
        </p>
      </div>

      {/* Event Basics */}
      <ReviewSection title="Event Basics" onEdit={() => onGoToStep(0)}>
        <dl className="space-y-0">
          <ReviewRow label="Event Name" value={data.eventName} />
          <ReviewRow
            label="Event Type"
            value={
              data.eventType === 'Other'
                ? `Other — ${data.eventTypeOther}`
                : data.eventType
            }
          />
          <ReviewRow
            label={data.dateMode === 'range' ? 'Event Dates' : 'Event Date'}
            value={dateDisplay}
          />
          <ReviewRow label="Location" value={data.location} />
          <ReviewRow label="Venue" value={data.venue} />
          <ReviewRow label="Category" value={CATEGORY_LABELS[category]} />
        </dl>
      </ReviewSection>

      {/* Category-specific Step 2 */}
      <ReviewSection title="Category Requirements" onEdit={() => onGoToStep(1)}>
        <dl className="space-y-0">
          {category === 'planner' && (
            <>
              <ReviewRow
                label="Services Required"
                value={data.plannerServicesRequired.join(', ')}
              />
              <ReviewRow
                label="Estimated Guest Count"
                value={String(data.plannerEstimatedGuestCount)}
              />
              <ReviewRow label="Planning Stage" value={data.plannerPlanningStage} />
            </>
          )}
          {category === 'performer' && (
            <>
              <ReviewRow label="Performer Type" value={data.performerType} />
              <ReviewRow label="Genre / Style" value={data.performerGenreOrStyle} />
              <ReviewRow
                label="Number of Performers"
                value={String(data.performerCount)}
              />
              <ReviewRow
                label="Performance Duration"
                value={
                  data.performerDuration === 'Custom duration'
                    ? `Custom — ${data.performerCustomDuration}`
                    : data.performerDuration
                }
              />
            </>
          )}
          {category === 'crew' && (
            <>
              <ReviewRow
                label="Required Roles"
                value={data.crewRequiredRoles.join(', ')}
              />
              <ReviewRow
                label="Number of Crew"
                value={String(data.crewCount)}
              />
              <ReviewRow
                label="Experience Level"
                value={data.crewExperienceLevel}
              />
            </>
          )}
        </dl>
      </ReviewSection>

      {/* Category-specific Step 3 */}
      <ReviewSection title="Budget & Logistics" onEdit={() => onGoToStep(2)}>
        <dl className="space-y-0">
          {category === 'planner' && (
            <>
              <ReviewRow label="Budget Range" value={data.plannerBudgetRange} />
              <ReviewRow
                label="Preferred Style"
                value={data.plannerPreferredStyle}
              />
              <ReviewRow
                label="Additional Requirements"
                value={data.plannerAdditionalRequirements}
              />
            </>
          )}
          {category === 'performer' && (
            <>
              <ReviewRow
                label="Number of Sets"
                value={data.performerNumberOfSets}
              />
              <ReviewRow label="Budget Range" value={data.performerBudgetRange} />
              <ReviewRow
                label="Technical Requirements"
                value={data.performerTechnicalRequirements}
              />
              <ReviewRow
                label="Additional Requirements"
                value={data.performerAdditionalRequirements}
              />
            </>
          )}
          {category === 'crew' && (
            <>
              <ReviewRow label="Shift Duration" value={data.crewShiftDuration} />
              <ReviewRow
                label="Compensation Budget"
                value={data.crewCompensationBudget}
              />
              <ReviewRow
                label="Equipment Provision"
                value={data.crewEquipmentProvision}
              />
              <ReviewRow
                label="Additional Requirements"
                value={data.crewAdditionalRequirements}
              />
            </>
          )}
        </dl>
      </ReviewSection>

      {/* Error display */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Submission Failed</p>
            <p className="text-sm text-red-600 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Navigation & Submit */}
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onPrev} className="btn-secondary">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1.5" />
              Submit Requirement
            </>
          )}
        </button>
      </div>
    </div>
  );
}
