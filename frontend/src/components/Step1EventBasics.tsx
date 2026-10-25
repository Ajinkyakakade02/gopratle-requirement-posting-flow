'use client';

import React from 'react';
import {
  Calendar,
  ClipboardList,
  Music,
  Users,
  MapPin,
  Building2,
  ChevronRight,
  Type,
} from 'lucide-react';
import type { FormData } from '@/types';
import {
  EVENT_TYPES,
} from '@/types';
import { validateStep1 } from '@/lib/validation';

interface Step1Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

const CATEGORY_CARDS: {
  value: 'planner' | 'performer' | 'crew';
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: 'planner',
    label: 'Event Planner',
    icon: <ClipboardList className="w-7 h-7" />,
    description: 'Find professionals to plan, coordinate, and design your event.',
  },
  {
    value: 'performer',
    label: 'Performer',
    icon: <Music className="w-7 h-7" />,
    description: 'Book singers, DJs, bands, dancers, or other entertainment.',
  },
  {
    value: 'crew',
    label: 'Crew',
    icon: <Users className="w-7 h-7" />,
    description: 'Hire event staff, technicians, photographers, and more.',
  },
];

export default function Step1EventBasics({
  data,
  onChange,
  onNext,
  errors,
  setErrors,
}: Step1Props) {
  const handleContinue = () => {
    const validationErrors = validateStep1(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  const handleCategoryChange = (newCategory: 'planner' | 'performer' | 'crew') => {
    if (newCategory !== data.category) {
      // Clear old category-specific data
      onChange({
        category: newCategory,
        plannerServicesRequired: [],
        plannerEstimatedGuestCount: '',
        plannerPlanningStage: '',
        plannerBudgetRange: '',
        plannerPreferredStyle: '',
        plannerAdditionalRequirements: '',
        performerType: '',
        performerGenreOrStyle: '',
        performerCount: '',
        performerDuration: '',
        performerCustomDuration: '',
        performerNumberOfSets: '',
        performerBudgetRange: '',
        performerTechnicalRequirements: '',
        performerAdditionalRequirements: '',
        crewRequiredRoles: [],
        crewCount: '',
        crewExperienceLevel: '',
        crewShiftDuration: '',
        crewCompensationBudget: '',
        crewEquipmentProvision: '',
        crewAdditionalRequirements: '',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Event Name */}
      <div>
        <label htmlFor="eventName" className="form-label">
          <Type className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
          Event Name <span className="text-red-500">*</span>
        </label>
        <input
          id="eventName"
          type="text"
          className={`form-input ${errors.eventName ? 'border-red-400 focus:ring-red-300' : ''}`}
          placeholder="e.g. Summer Music Festival 2027"
          value={data.eventName}
          onChange={(e) => onChange({ eventName: e.target.value })}
          maxLength={200}
        />
        {errors.eventName && <p className="form-error">{errors.eventName}</p>}
      </div>

      {/* Event Type */}
      <div>
        <label htmlFor="eventType" className="form-label">
          Event Type <span className="text-red-500">*</span>
        </label>
        <select
          id="eventType"
          className={`form-select ${errors.eventType ? 'border-red-400 focus:ring-red-300' : ''}`}
          value={data.eventType}
          onChange={(e) => onChange({ eventType: e.target.value, eventTypeOther: '' })}
        >
          <option value="">Select event type</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.eventType && <p className="form-error">{errors.eventType}</p>}

        {data.eventType === 'Other' && (
          <div className="mt-3">
            <label htmlFor="eventTypeOther" className="form-label">
              Specify Event Type <span className="text-red-500">*</span>
            </label>
            <input
              id="eventTypeOther"
              type="text"
              className={`form-input ${errors.eventTypeOther ? 'border-red-400 focus:ring-red-300' : ''}`}
              placeholder="e.g. Charity Gala"
              value={data.eventTypeOther}
              onChange={(e) => onChange({ eventTypeOther: e.target.value })}
            />
            {errors.eventTypeOther && (
              <p className="form-error">{errors.eventTypeOther}</p>
            )}
          </div>
        )}
      </div>

      {/* Date Mode + Date Fields */}
      <div>
        <label className="form-label">
          <Calendar className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
          Event Date <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dateMode"
              value="single"
              checked={data.dateMode === 'single'}
              onChange={() => onChange({ dateMode: 'single', endDate: '' })}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-sm text-slate-700">Single date</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dateMode"
              value="range"
              checked={data.dateMode === 'range'}
              onChange={() => onChange({ dateMode: 'range' })}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-sm text-slate-700">Date range</span>
          </label>
        </div>

        <div className={`grid gap-4 ${data.dateMode === 'range' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          <div>
            <label htmlFor="startDate" className="form-label-sm">
              {data.dateMode === 'range' ? 'Start Date' : 'Event Date'}
            </label>
            <input
              id="startDate"
              type="date"
              className={`form-input ${errors.startDate ? 'border-red-400 focus:ring-red-300' : ''}`}
              value={data.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
            {errors.startDate && <p className="form-error">{errors.startDate}</p>}
          </div>

          {data.dateMode === 'range' && (
            <div>
              <label htmlFor="endDate" className="form-label-sm">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                className={`form-input ${errors.endDate ? 'border-red-400 focus:ring-red-300' : ''}`}
                value={data.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
              />
              {errors.endDate && <p className="form-error">{errors.endDate}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="form-label">
          <MapPin className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
          Event Location <span className="text-red-500">*</span>
        </label>
        <input
          id="location"
          type="text"
          className={`form-input ${errors.location ? 'border-red-400 focus:ring-red-300' : ''}`}
          placeholder="e.g. Pune, Maharashtra"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
        />
        {errors.location && <p className="form-error">{errors.location}</p>}
      </div>

      {/* Venue (optional) */}
      <div>
        <label htmlFor="venue" className="form-label">
          <Building2 className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
          Venue <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <input
          id="venue"
          type="text"
          className="form-input"
          placeholder="e.g. Grand Ballroom, Hotel Meridian"
          value={data.venue}
          onChange={(e) => onChange({ venue: e.target.value })}
        />
      </div>

      {/* Category Selection */}
      <div>
        <label className="form-label">
          Select Requirement Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORY_CARDS.map((card) => (
            <button
              key={card.value}
              type="button"
              onClick={() => handleCategoryChange(card.value)}
              className={`category-card ${
                data.category === card.value
                  ? 'category-card-active'
                  : 'category-card-inactive'
              }`}
              role="radio"
              aria-checked={data.category === card.value}
              aria-label={card.label}
            >
              <div
                className={`mb-3 transition-colors ${
                  data.category === card.value
                    ? 'text-indigo-600'
                    : 'text-slate-400'
                }`}
              >
                {card.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{card.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {card.description}
              </p>
            </button>
          ))}
        </div>
        {errors.category && <p className="form-error mt-2">{errors.category}</p>}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-2">
        <button type="button" onClick={handleContinue} className="btn-primary">
          Continue
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
