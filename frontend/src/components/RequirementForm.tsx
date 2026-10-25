'use client';

import React, { useState, useCallback } from 'react';
import type { FormData } from '@/types';
import { DEFAULT_FORM_DATA } from '@/types';
import ProgressStepper from './ProgressStepper';
import Step1EventBasics from './Step1EventBasics';
import Step2CategoryCore from './Step2CategoryCore';
import Step3BudgetLogistics from './Step3BudgetLogistics';
import Step4ReviewSubmit from './Step4ReviewSubmit';

export default function RequirementForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    setStepErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePrev = useCallback(() => {
    setStepErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGoToStep = useCallback((step: number) => {
    setStepErrors({});
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStep(0);
    setStepErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const STEP_TITLES = [
    'Event Basics',
    'Category Requirements',
    'Budget & Logistics',
    'Review & Submit',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Stepper */}
      <ProgressStepper currentStep={currentStep} />

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Step {currentStep + 1}: {STEP_TITLES[currentStep]}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {currentStep === 0 && 'Enter the basic details about your event and choose a category.'}
          {currentStep === 1 && 'Provide specific requirements for your selected category.'}
          {currentStep === 2 && 'Set your budget preferences and logistical details.'}
          {currentStep === 3 && 'Review everything and submit your requirement.'}
        </p>

        {currentStep === 0 && (
          <Step1EventBasics
            data={formData}
            onChange={handleChange}
            onNext={handleNext}
            errors={stepErrors}
            setErrors={setStepErrors}
          />
        )}

        {currentStep === 1 && (
          <Step2CategoryCore
            data={formData}
            onChange={handleChange}
            onNext={handleNext}
            onPrev={handlePrev}
            errors={stepErrors}
            setErrors={setStepErrors}
          />
        )}

        {currentStep === 2 && (
          <Step3BudgetLogistics
            data={formData}
            onChange={handleChange}
            onNext={handleNext}
            onPrev={handlePrev}
            errors={stepErrors}
            setErrors={setStepErrors}
          />
        )}

        {currentStep === 3 && (
          <Step4ReviewSubmit
            data={formData}
            onPrev={handlePrev}
            onGoToStep={handleGoToStep}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
