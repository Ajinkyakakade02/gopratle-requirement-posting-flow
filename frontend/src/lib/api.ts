import type { FormData, Category, APIResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

/**
 * Build the submission payload from flat form data,
 * extracting only the relevant category-specific fields.
 */
function buildPayload(data: FormData) {
  const category = data.category as Category;

  let categoryDetails: Record<string, unknown> = {};

  switch (category) {
    case 'planner':
      categoryDetails = {
        servicesRequired: data.plannerServicesRequired,
        estimatedGuestCount: Number(data.plannerEstimatedGuestCount),
        planningStage: data.plannerPlanningStage,
        budgetRange: data.plannerBudgetRange,
        preferredStyle: data.plannerPreferredStyle,
        additionalRequirements: data.plannerAdditionalRequirements,
      };
      break;

    case 'performer':
      categoryDetails = {
        performerType: data.performerType,
        genreOrStyle: data.performerGenreOrStyle,
        performerCount: Number(data.performerCount),
        performanceDuration: data.performerDuration,
        customDuration: data.performerCustomDuration,
        numberOfSets: data.performerNumberOfSets,
        budgetRange: data.performerBudgetRange,
        technicalRequirements: data.performerTechnicalRequirements,
        additionalRequirements: data.performerAdditionalRequirements,
      };
      break;

    case 'crew':
      categoryDetails = {
        requiredRoles: data.crewRequiredRoles,
        crewCount: Number(data.crewCount),
        experienceLevel: data.crewExperienceLevel,
        shiftDuration: data.crewShiftDuration,
        compensationBudget: data.crewCompensationBudget,
        equipmentProvision: data.crewEquipmentProvision,
        additionalRequirements: data.crewAdditionalRequirements,
      };
      break;
  }

  return {
    eventName: data.eventName.trim(),
    eventType: data.eventType,
    eventTypeOther: data.eventType === 'Other' ? data.eventTypeOther.trim() : null,
    dateMode: data.dateMode,
    startDate: data.startDate,
    endDate: data.dateMode === 'range' ? data.endDate : null,
    location: data.location.trim(),
    venue: data.venue.trim(),
    category,
    categoryDetails,
  };
}

/**
 * Submit a requirement to the backend API.
 */
export async function submitRequirement(data: FormData): Promise<APIResponse> {
  const payload = buildPayload(data);

  const response = await fetch(`${API_BASE}/api/requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result: APIResponse = await response.json();
  return result;
}

/**
 * Check backend health status.
 */
export async function checkHealth(): Promise<{
  status: string;
  database: { connected: boolean; readyState: string };
}> {
  const response = await fetch(`${API_BASE}/api/health`);
  const result = await response.json();
  return result.data;
}
