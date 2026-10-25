import mongoose, { Schema, Document } from 'mongoose';

// ─── Category-specific sub-schemas ───────────────────────────────────────────

const PlannerDetailsSchema = new Schema(
  {
    servicesRequired: { type: [String], required: true },
    estimatedGuestCount: { type: Number, required: true },
    planningStage: { type: String, required: true },
    budgetRange: { type: String, required: true },
    preferredStyle: { type: String, default: '' },
    additionalRequirements: { type: String, default: '' },
  },
  { _id: false }
);

const PerformerDetailsSchema = new Schema(
  {
    performerType: { type: String, required: true },
    genreOrStyle: { type: String, required: true },
    performerCount: { type: Number, required: true },
    performanceDuration: { type: String, required: true },
    customDuration: { type: String, default: '' },
    numberOfSets: { type: String, required: true },
    budgetRange: { type: String, required: true },
    technicalRequirements: { type: String, default: '' },
    additionalRequirements: { type: String, default: '' },
  },
  { _id: false }
);

const CrewDetailsSchema = new Schema(
  {
    requiredRoles: { type: [String], required: true },
    crewCount: { type: Number, required: true },
    experienceLevel: { type: String, required: true },
    shiftDuration: { type: String, required: true },
    compensationBudget: { type: String, required: true },
    equipmentProvision: { type: String, required: true },
    additionalRequirements: { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main requirement schema ────────────────────────────────────────────────

export interface IRequirement extends Document {
  eventName: string;
  eventType: string;
  eventTypeOther?: string;
  dateMode: 'single' | 'range';
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  category: 'planner' | 'performer' | 'crew';
  categoryDetails: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema<IRequirement>(
  {
    eventName: { type: String, required: true, trim: true, maxlength: 200 },
    eventType: { type: String, required: true, trim: true },
    eventTypeOther: { type: String, default: null, trim: true },
    dateMode: { type: String, required: true, enum: ['single', 'range'] },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    location: { type: String, required: true, trim: true, maxlength: 300 },
    venue: { type: String, default: '', trim: true, maxlength: 300 },
    category: {
      type: String,
      required: true,
      enum: ['planner', 'performer', 'crew'],
    },
    categoryDetails: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'requirements',
  }
);

export const Requirement = mongoose.model<IRequirement>(
  'Requirement',
  RequirementSchema
);
