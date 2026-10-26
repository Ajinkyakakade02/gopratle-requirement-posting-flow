import type { FormData, Category, APIResponse } from '@/types';

const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
// Normalize base URL: strip trailing slashes and redundant /api suffix
export const API_BASE = rawBase.replace(/\/+$/, '').replace(/\/api$/, '');

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

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Unable to reach the backend server. If the server is on a free tier, it may be waking up from sleep. Please try again in a few seconds.'
    );
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const result: APIResponse = await response.json();
    return result;
  }

  // Handle HTML or non-JSON responses (e.g. gateway timeout or proxy errors)
  const text = await response.text();
  return {
    success: false,
    message: `Server returned HTTP ${response.status}: ${text.slice(0, 120)}`,
  };
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
