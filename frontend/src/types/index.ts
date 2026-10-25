// ─── Category types ──────────────────────────────────────────────────────────

export type Category = 'planner' | 'performer' | 'crew';

export const CATEGORY_LABELS: Record<Category, string> = {
  planner: 'Event Planner',
  performer: 'Performer',
  crew: 'Crew',
};

// ─── Event types ─────────────────────────────────────────────────────────────

export const EVENT_TYPES = [
  'Wedding',
  'Corporate Event',
  'Concert / Live Show',
  'Festival',
  'Private Party',
  'Conference / Meetup',
  'Other',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

// ─── Date mode ───────────────────────────────────────────────────────────────

export type DateMode = 'single' | 'range';

// ─── Step 1: Event basics ────────────────────────────────────────────────────

export interface EventBasics {
  eventName: string;
  eventType: string;
  eventTypeOther: string;
  dateMode: DateMode;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: Category | '';
}

// ─── Step 2: Category details (core) ─────────────────────────────────────────

export interface PlannerStep2 {
  servicesRequired: string[];
  estimatedGuestCount: number | '';
  planningStage: string;
}

export interface PerformerStep2 {
  performerType: string;
  genreOrStyle: string;
  performerCount: number | '';
  performanceDuration: string;
  customDuration: string;
}

export interface CrewStep2 {
  requiredRoles: string[];
  crewCount: number | '';
  experienceLevel: string;
}

// ─── Step 3: Category details (budget & logistics) ───────────────────────────

export interface PlannerStep3 {
  budgetRange: string;
  preferredStyle: string;
  additionalRequirements: string;
}

export interface PerformerStep3 {
  numberOfSets: string;
  budgetRange: string;
  technicalRequirements: string;
  additionalRequirements: string;
}

export interface CrewStep3 {
  shiftDuration: string;
  compensationBudget: string;
  equipmentProvision: string;
  additionalRequirements: string;
}

// ─── Complete form data ──────────────────────────────────────────────────────

export interface FormData {
  // Step 1
  eventName: string;
  eventType: string;
  eventTypeOther: string;
  dateMode: DateMode;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: Category | '';

  // Step 2 — Planner
  plannerServicesRequired: string[];
  plannerEstimatedGuestCount: number | '';
  plannerPlanningStage: string;

  // Step 2 — Performer
  performerType: string;
  performerGenreOrStyle: string;
  performerCount: number | '';
  performerDuration: string;
  performerCustomDuration: string;

  // Step 2 — Crew
  crewRequiredRoles: string[];
  crewCount: number | '';
  crewExperienceLevel: string;

  // Step 3 — Planner
  plannerBudgetRange: string;
  plannerPreferredStyle: string;
  plannerAdditionalRequirements: string;

  // Step 3 — Performer
  performerNumberOfSets: string;
  performerBudgetRange: string;
  performerTechnicalRequirements: string;
  performerAdditionalRequirements: string;

  // Step 3 — Crew
  crewShiftDuration: string;
  crewCompensationBudget: string;
  crewEquipmentProvision: string;
  crewAdditionalRequirements: string;
}

export const DEFAULT_FORM_DATA: FormData = {
  eventName: '',
  eventType: '',
  eventTypeOther: '',
  dateMode: 'single',
  startDate: '',
  endDate: '',
  location: '',
  venue: '',
  category: '',

  plannerServicesRequired: [],
  plannerEstimatedGuestCount: '',
  plannerPlanningStage: '',

  performerType: '',
  performerGenreOrStyle: '',
  performerCount: '',
  performerDuration: '',
  performerCustomDuration: '',

  crewRequiredRoles: [],
  crewCount: '',
  crewExperienceLevel: '',

  plannerBudgetRange: '',
  plannerPreferredStyle: '',
  plannerAdditionalRequirements: '',

  performerNumberOfSets: '',
  performerBudgetRange: '',
  performerTechnicalRequirements: '',
  performerAdditionalRequirements: '',

  crewShiftDuration: '',
  crewCompensationBudget: '',
  crewEquipmentProvision: '',
  crewAdditionalRequirements: '',
};

// ─── API types ───────────────────────────────────────────────────────────────

export interface APIResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    category: string;
    createdAt: string;
  };
  errors?: Record<string, string>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const PLANNER_SERVICES = [
  'Full event planning',
  'Partial planning',
  'Day-of coordination',
  'Venue and vendor coordination',
  'Decoration and design',
  'Other',
];

export const PLANNING_STAGES = [
  'Exploring options',
  'Shortlisting vendors',
  'Ready to book',
  'Planning already underway',
];

export const PERFORMER_TYPES = [
  'Singer',
  'DJ',
  'Band',
  'Dancer',
  'Host / MC',
  'Instrumentalist',
  'Other',
];

export const PERFORMANCE_DURATIONS = [
  '30 minutes',
  '60 minutes',
  '90 minutes',
  '2 hours',
  'Custom duration',
];

export const PERFORMANCE_SETS = ['1', '2', '3', '4+'];
export const PERFORMER_SETS = PERFORMANCE_SETS;

export const CREW_ROLES = [
  'Event coordinator',
  'Stage manager',
  'Sound engineer',
  'Lighting technician',
  'Stage or setup crew',
  'Photographer',
  'Videographer',
  'Security',
  'Other',
];

export const EXPERIENCE_LEVELS = [
  'Entry-level',
  'Intermediate',
  'Experienced',
  'Any experience level',
];

export const PLANNER_BUDGETS = [
  'Under ₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹2,50,000',
  '₹2,50,000–₹5,00,000',
  '₹5,00,000–₹10,00,000',
  'Above ₹10,00,000',
  'Flexible / Not yet decided',
];

export const PERFORMER_BUDGETS = [
  'Under ₹10,000',
  '₹10,000–₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹2,50,000',
  'Above ₹2,50,000',
  'Flexible / Not yet decided',
];

export const CREW_COMPENSATION = [
  'Under ₹5,000 per person',
  '₹5,000–₹10,000 per person',
  '₹10,000–₹20,000 per person',
  '₹20,000–₹40,000 per person',
  'Above ₹40,000 per person',
  'Flexible / Not yet decided',
];

export const SHIFT_DURATIONS = [
  '3–4 hours',
  '5–8 hours',
  'Full day',
  'Multiple days',
];

export const EQUIPMENT_OPTIONS = [
  'Provided by organiser',
  'Partially provided',
  'Crew should bring equipment',
];
