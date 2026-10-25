import { z } from 'zod';

// ─── Constants ───────────────────────────────────────────────────────────────

export const EVENT_TYPES = [
  'Wedding',
  'Corporate Event',
  'Concert / Live Show',
  'Festival',
  'Private Party',
  'Conference / Meetup',
  'Other',
] as const;

export const CATEGORIES = ['planner', 'performer', 'crew'] as const;

export const PLANNER_SERVICES = [
  'Full event planning',
  'Partial planning',
  'Day-of coordination',
  'Venue and vendor coordination',
  'Decoration and design',
  'Other',
] as const;

export const PLANNING_STAGES = [
  'Exploring options',
  'Shortlisting vendors',
  'Ready to book',
  'Planning already underway',
] as const;

export const PERFORMER_TYPES = [
  'Singer',
  'DJ',
  'Band',
  'Dancer',
  'Host / MC',
  'Instrumentalist',
  'Other',
] as const;

export const PERFORMANCE_DURATIONS = [
  '30 minutes',
  '60 minutes',
  '90 minutes',
  '2 hours',
  'Custom duration',
] as const;

export const PERFORMANCE_SETS = ['1', '2', '3', '4+'] as const;

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
] as const;

export const EXPERIENCE_LEVELS = [
  'Entry-level',
  'Intermediate',
  'Experienced',
  'Any experience level',
] as const;

export const PLANNER_BUDGETS = [
  'Under ₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹2,50,000',
  '₹2,50,000–₹5,00,000',
  '₹5,00,000–₹10,00,000',
  'Above ₹10,00,000',
  'Flexible / Not yet decided',
] as const;

export const PERFORMER_BUDGETS = [
  'Under ₹10,000',
  '₹10,000–₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹2,50,000',
  'Above ₹2,50,000',
  'Flexible / Not yet decided',
] as const;

export const CREW_COMPENSATION = [
  'Under ₹5,000 per person',
  '₹5,000–₹10,000 per person',
  '₹10,000–₹20,000 per person',
  '₹20,000–₹40,000 per person',
  'Above ₹40,000 per person',
  'Flexible / Not yet decided',
] as const;

export const SHIFT_DURATIONS = [
  '3–4 hours',
  '5–8 hours',
  'Full day',
  'Multiple days',
] as const;

export const EQUIPMENT_OPTIONS = [
  'Provided by organiser',
  'Partially provided',
  'Crew should bring equipment',
] as const;

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const nonEmptyString = (field: string) =>
  z
    .string({ required_error: `${field} is required.` })
    .trim()
    .min(1, `${field} is required.`);

const positiveInt = (field: string) =>
  z
    .number({ required_error: `${field} is required.`, invalid_type_error: `${field} must be a number.` })
    .int(`${field} must be a whole number.`)
    .positive(`${field} must be a positive number.`);

// ── Category detail schemas ──

const plannerDetailsSchema = z.object({
  servicesRequired: z
    .array(z.string())
    .min(1, 'At least one service must be selected.'),
  estimatedGuestCount: positiveInt('Estimated guest count'),
  planningStage: nonEmptyString('Planning stage'),
  budgetRange: nonEmptyString('Budget range'),
  preferredStyle: z.string().optional().default(''),
  additionalRequirements: z.string().optional().default(''),
});

const performerDetailsSchema = z.object({
  performerType: nonEmptyString('Performer type'),
  genreOrStyle: nonEmptyString('Genre or performance style'),
  performerCount: positiveInt('Number of performers'),
  performanceDuration: nonEmptyString('Performance duration'),
  customDuration: z.string().optional().default(''),
  numberOfSets: nonEmptyString('Number of sets'),
  budgetRange: nonEmptyString('Budget range'),
  technicalRequirements: z.string().optional().default(''),
  additionalRequirements: z.string().optional().default(''),
});

const crewDetailsSchema = z.object({
  requiredRoles: z
    .array(z.string())
    .min(1, 'At least one crew role must be selected.'),
  crewCount: positiveInt('Number of crew members'),
  experienceLevel: nonEmptyString('Experience level'),
  shiftDuration: nonEmptyString('Shift duration'),
  compensationBudget: nonEmptyString('Compensation budget'),
  equipmentProvision: nonEmptyString('Equipment provision'),
  additionalRequirements: z.string().optional().default(''),
});

// ── Date validation helper ──

const dateString = (field: string) =>
  nonEmptyString(field).refine(
    (val) => !isNaN(Date.parse(val)),
    { message: `${field} must be a valid date.` }
  );

// ── Main requirement schema ──

export const requirementSchema = z
  .object({
    eventName: nonEmptyString('Event name').max(200, 'Event name must be 200 characters or fewer.'),
    eventType: nonEmptyString('Event type'),
    eventTypeOther: z.string().nullable().optional().default(null),
    dateMode: z.enum(['single', 'range'], {
      required_error: 'Date mode is required.',
      invalid_type_error: 'Date mode must be "single" or "range".',
    }),
    startDate: dateString('Start date'),
    endDate: z.string().nullable().optional().default(null),
    location: nonEmptyString('Location').max(300, 'Location must be 300 characters or fewer.'),
    venue: z.string().optional().default(''),
    category: z.enum(['planner', 'performer', 'crew'], {
      required_error: 'Category is required.',
      invalid_type_error: 'Category must be "planner", "performer", or "crew".',
    }),
    categoryDetails: z.record(z.unknown()),
  })
  .superRefine((data, ctx) => {
    // Validate eventTypeOther when eventType is "Other"
    if (data.eventType === 'Other') {
      if (!data.eventTypeOther || data.eventTypeOther.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please specify the event type.',
          path: ['eventTypeOther'],
        });
      }
    }

    // Validate date range
    if (data.dateMode === 'range') {
      if (!data.endDate || data.endDate.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date is required for date ranges.',
          path: ['endDate'],
        });
      } else if (!isNaN(Date.parse(data.startDate)) && !isNaN(Date.parse(data.endDate))) {
        if (new Date(data.endDate) < new Date(data.startDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'End date cannot be before start date.',
            path: ['endDate'],
          });
        }
      }
    }

    // Validate performer custom duration
    if (data.category === 'performer') {
      const details = data.categoryDetails as Record<string, unknown>;
      if (details.performanceDuration === 'Custom duration') {
        if (!details.customDuration || (details.customDuration as string).trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please specify the custom duration.',
            path: ['categoryDetails', 'customDuration'],
          });
        }
      }
    }

    // Validate category-specific details
    let detailsResult;
    switch (data.category) {
      case 'planner':
        detailsResult = plannerDetailsSchema.safeParse(data.categoryDetails);
        break;
      case 'performer':
        detailsResult = performerDetailsSchema.safeParse(data.categoryDetails);
        break;
      case 'crew':
        detailsResult = crewDetailsSchema.safeParse(data.categoryDetails);
        break;
    }

    if (detailsResult && !detailsResult.success) {
      for (const issue of detailsResult.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ['categoryDetails', ...issue.path],
        });
      }
    }
  });

export type RequirementInput = z.infer<typeof requirementSchema>;

// ─── Validate and extract clean category details ─────────────────────────────

export function validateAndCleanCategoryDetails(
  category: string,
  details: Record<string, unknown>
): { success: true; data: Record<string, unknown> } | { success: false; errors: Record<string, string> } {
  let schema;
  switch (category) {
    case 'planner':
      schema = plannerDetailsSchema;
      break;
    case 'performer':
      schema = performerDetailsSchema;
      break;
    case 'crew':
      schema = crewDetailsSchema;
      break;
    default:
      return { success: false, errors: { category: 'Invalid category.' } };
  }

  const result = schema.safeParse(details);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      errors[key] = issue.message;
    }
    return { success: false, errors };
  }

  return { success: true, data: result.data as Record<string, unknown> };
}
