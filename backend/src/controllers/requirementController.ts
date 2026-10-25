import { Request, Response } from 'express';
import { Requirement } from '../models/Requirement';
import {
  requirementSchema,
  validateAndCleanCategoryDetails,
} from '../validators/requirementValidator';
import { getDBStatus } from '../config/database';

export async function submitRequirement(req: Request, res: Response): Promise<void> {
  try {
    // Check database connectivity first
    const dbStatus = getDBStatus();
    if (!dbStatus.connected) {
      res.status(503).json({
        success: false,
        message: 'Database is currently unavailable. Please try again later.',
        errors: {},
      });
      return;
    }

    // Validate request body with Zod
    const parseResult = requirementSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      for (const issue of parseResult.error.issues) {
        const key = issue.path.join('.');
        if (!errors[key]) {
          errors[key] = issue.message;
        }
      }
      res.status(400).json({
        success: false,
        message: 'Please correct the highlighted fields.',
        errors,
      });
      return;
    }

    const data = parseResult.data;

    // Validate and clean category-specific details
    const detailsResult = validateAndCleanCategoryDetails(
      data.category,
      data.categoryDetails
    );
    if (!detailsResult.success) {
      res.status(400).json({
        success: false,
        message: 'Please correct the category-specific fields.',
        errors: detailsResult.errors,
      });
      return;
    }

    // Build the document
    const requirementDoc = new Requirement({
      eventName: data.eventName.trim(),
      eventType: data.eventType,
      eventTypeOther: data.eventType === 'Other' ? data.eventTypeOther?.trim() : null,
      dateMode: data.dateMode,
      startDate: data.startDate,
      endDate: data.dateMode === 'range' ? data.endDate : null,
      location: data.location.trim(),
      venue: data.venue?.trim() || '',
      category: data.category,
      categoryDetails: detailsResult.data,
    });

    // Save to MongoDB
    const saved = await requirementDoc.save();

    res.status(201).json({
      success: true,
      message: 'Requirement submitted successfully.',
      data: {
        id: saved._id.toString(),
        category: saved.category,
        createdAt: saved.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error submitting requirement:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: {},
    });
  }
}

export function healthCheck(_req: Request, res: Response): void {
  const dbStatus = getDBStatus();
  res.status(200).json({
    success: true,
    message: 'GoPratle API is running.',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
  });
}
