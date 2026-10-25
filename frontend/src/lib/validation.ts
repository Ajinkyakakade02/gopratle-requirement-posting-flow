import type { FormData, Category } from '@/types';

// ─── Step 1 validation ───────────────────────────────────────────────────────

export function validateStep1(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.eventName.trim()) {
    errors.eventName = 'Event name is required.';
  } else if (data.eventName.trim().length > 200) {
    errors.eventName = 'Event name must be 200 characters or fewer.';
  }

  if (!data.eventType) {
    errors.eventType = 'Event type is required.';
  }

  if (data.eventType === 'Other' && !data.eventTypeOther.trim()) {
    errors.eventTypeOther = 'Please specify the event type.';
  }

  if (!data.startDate) {
    errors.startDate = 'Event date is required.';
  }

  if (data.dateMode === 'range') {
    if (!data.endDate) {
      errors.endDate = 'End date is required for date ranges.';
    } else if (data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
      errors.endDate = 'End date cannot be before start date.';
    }
  }

  if (!data.location.trim()) {
    errors.location = 'Location is required.';
  } else if (data.location.trim().length > 300) {
    errors.location = 'Location must be 300 characters or fewer.';
  }

  if (!data.category) {
    errors.category = 'Please select a category.';
  }

  return errors;
}

// ─── Step 2 validation ───────────────────────────────────────────────────────

export function validateStep2(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  switch (data.category as Category) {
    case 'planner':
      if (data.plannerServicesRequired.length === 0) {
        errors.plannerServicesRequired = 'At least one service must be selected.';
      }
      if (!data.plannerEstimatedGuestCount || Number(data.plannerEstimatedGuestCount) < 1) {
        errors.plannerEstimatedGuestCount = 'Please enter a valid guest count.';
      }
      if (!data.plannerPlanningStage) {
        errors.plannerPlanningStage = 'Planning stage is required.';
      }
      break;

    case 'performer':
      if (!data.performerType) {
        errors.performerType = 'Performer type is required.';
      }
      if (!data.performerGenreOrStyle.trim()) {
        errors.performerGenreOrStyle = 'Genre or style is required.';
      }
      if (!data.performerCount || Number(data.performerCount) < 1) {
        errors.performerCount = 'Please enter a valid performer count.';
      }
      if (!data.performerDuration) {
        errors.performerDuration = 'Performance duration is required.';
      }
      if (data.performerDuration === 'Custom duration' && !data.performerCustomDuration.trim()) {
        errors.performerCustomDuration = 'Please specify the custom duration.';
      }
      break;

    case 'crew':
      if (data.crewRequiredRoles.length === 0) {
        errors.crewRequiredRoles = 'At least one role must be selected.';
      }
      if (!data.crewCount || Number(data.crewCount) < 1) {
        errors.crewCount = 'Please enter a valid crew count.';
      }
      if (!data.crewExperienceLevel) {
        errors.crewExperienceLevel = 'Experience level is required.';
      }
      break;
  }

  return errors;
}

// ─── Step 3 validation ───────────────────────────────────────────────────────

export function validateStep3(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  switch (data.category as Category) {
    case 'planner':
      if (!data.plannerBudgetRange) {
        errors.plannerBudgetRange = 'Budget range is required.';
      }
      break;

    case 'performer':
      if (!data.performerNumberOfSets) {
        errors.performerNumberOfSets = 'Number of sets is required.';
      }
      if (!data.performerBudgetRange) {
        errors.performerBudgetRange = 'Budget range is required.';
      }
      break;

    case 'crew':
      if (!data.crewShiftDuration) {
        errors.crewShiftDuration = 'Shift duration is required.';
      }
      if (!data.crewCompensationBudget) {
        errors.crewCompensationBudget = 'Compensation budget is required.';
      }
      if (!data.crewEquipmentProvision) {
        errors.crewEquipmentProvision = 'Equipment provision is required.';
      }
      break;
  }

  return errors;
}

// ─── Full form validation ────────────────────────────────────────────────────

export function validateAll(data: FormData): Record<string, string> {
  return {
    ...validateStep1(data),
    ...validateStep2(data),
    ...validateStep3(data),
  };
}
