import assert from 'node:assert';
import {
  requirementSchema,
  validateAndCleanCategoryDetails,
} from '../validators/requirementValidator';

function runTests() {
  console.log('🧪 Running Backend Validator Tests...\n');
  let passed = 0;
  let failed = 0;

  function it(name: string, fn: () => void) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  // ─── Test 1: Valid Planner Payload ──────────────────────────────────────────
  it('should accept a valid Planner requirement', () => {
    const payload = {
      eventName: 'Grand Corporate Annual Gala',
      eventType: 'Corporate Event',
      eventTypeOther: null,
      dateMode: 'single',
      startDate: '2027-04-15',
      endDate: null,
      location: 'Bengaluru, Karnataka',
      venue: 'The Leela Palace',
      category: 'planner',
      categoryDetails: {
        servicesRequired: ['Full event planning', 'Venue and vendor coordination'],
        estimatedGuestCount: 250,
        planningStage: 'Ready to book',
        budgetRange: '₹5,00,000–₹10,00,000',
        preferredStyle: 'Modern luxury',
        additionalRequirements: 'Need sustainable decor options.',
      },
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, true);
  });

  // ─── Test 2: Valid Performer Payload with Date Range ────────────────────────
  it('should accept a valid Performer requirement with valid date range', () => {
    const payload = {
      eventName: 'Sunburn Music Weekend',
      eventType: 'Concert / Live Show',
      eventTypeOther: null,
      dateMode: 'range',
      startDate: '2027-05-10',
      endDate: '2027-05-12',
      location: 'Goa',
      venue: 'Vagator Beach Grounds',
      category: 'performer',
      categoryDetails: {
        performerType: 'Band',
        genreOrStyle: 'Indie Rock / Fusion',
        performerCount: 5,
        performanceDuration: '90 minutes',
        customDuration: '',
        numberOfSets: '2',
        budgetRange: '₹50,000–₹1,00,000',
        technicalRequirements: '5 microphones, drum kit, 2 guitar amps',
        additionalRequirements: 'Soundcheck 2 hours prior to showtime.',
      },
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, true);
  });

  // ─── Test 3: Valid Crew Payload ─────────────────────────────────────────────
  it('should accept a valid Crew requirement', () => {
    const payload = {
      eventName: 'Tech Expo 2027',
      eventType: 'Conference / Meetup',
      eventTypeOther: null,
      dateMode: 'single',
      startDate: '2027-06-20',
      endDate: null,
      location: 'Hyderabad, Telangana',
      venue: 'HITEX Exhibition Centre',
      category: 'crew',
      categoryDetails: {
        requiredRoles: ['Sound engineer', 'Lighting technician', 'Stage or setup crew'],
        crewCount: 6,
        experienceLevel: 'Experienced',
        shiftDuration: 'Full day',
        compensationBudget: '₹10,000–₹20,000 per person',
        equipmentProvision: 'Provided by organiser',
        additionalRequirements: 'Must have prior expo setup experience.',
      },
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, true);
  });

  // ─── Test 4: Reject Missing Event Name ──────────────────────────────────────
  it('should reject missing or empty event name', () => {
    const payload = {
      eventName: '   ',
      eventType: 'Wedding',
      dateMode: 'single',
      startDate: '2027-04-15',
      location: 'Mumbai',
      category: 'planner',
      categoryDetails: {
        servicesRequired: ['Full event planning'],
        estimatedGuestCount: 100,
        planningStage: 'Shortlisting vendors',
        budgetRange: '₹1,00,000–₹2,50,000',
      },
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, false);
    const hasError = res.error?.issues.some(
      (i) => i.path[0] === 'eventName'
    );
    assert.strictEqual(hasError, true);
  });

  // ─── Test 5: Reject Invalid Category ────────────────────────────────────────
  it('should reject invalid category', () => {
    const payload = {
      eventName: 'Private Party',
      eventType: 'Private Party',
      dateMode: 'single',
      startDate: '2027-04-15',
      location: 'Delhi',
      category: 'caterer', // invalid category
      categoryDetails: {},
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, false);
    const hasCategoryError = res.error?.issues.some(
      (i) => i.path[0] === 'category'
    );
    assert.strictEqual(hasCategoryError, true);
  });

  // ─── Test 6: Reject End Date Before Start Date ──────────────────────────────
  it('should reject date range where endDate precedes startDate', () => {
    const payload = {
      eventName: 'Winter Festival',
      eventType: 'Festival',
      dateMode: 'range',
      startDate: '2027-11-20',
      endDate: '2027-11-15', // invalid: before startDate
      location: 'Shimla',
      category: 'planner',
      categoryDetails: {
        servicesRequired: ['Decoration and design'],
        estimatedGuestCount: 50,
        planningStage: 'Exploring options',
        budgetRange: 'Under ₹50,000',
      },
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, false);
    const hasDateError = res.error?.issues.some(
      (i) => i.path[0] === 'endDate' && i.message.includes('before start date')
    );
    assert.strictEqual(hasDateError, true);
  });

  // ─── Test 7: Reject Missing eventTypeOther when eventType is "Other" ─────────
  it('should require eventTypeOther when eventType is "Other"', () => {
    const payload = {
      eventName: 'Art Exhibition',
      eventType: 'Other',
      eventTypeOther: '', // empty!
      dateMode: 'single',
      startDate: '2027-08-01',
      location: 'Kolkata',
      category: 'crew',
      categoryDetails: {
        requiredRoles: ['Photographer'],
        crewCount: 2,
        experienceLevel: 'Intermediate',
        shiftDuration: '5–8 hours',
        compensationBudget: '₹5,000–₹10,000 per person',
        equipmentProvision: 'Crew should bring equipment',
      },
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, false);
    const hasOtherError = res.error?.issues.some(
      (i) => i.path[0] === 'eventTypeOther'
    );
    assert.strictEqual(hasOtherError, true);
  });

  // ─── Test 8: Reject Negative or Zero Numbers ────────────────────────────────
  it('should reject zero or negative performerCount and guestCount', () => {
    const invalidPlanner = {
      servicesRequired: ['Full event planning'],
      estimatedGuestCount: 0, // invalid: must be positive
      planningStage: 'Ready to book',
      budgetRange: 'Under ₹50,000',
    };

    const cleanResult = validateAndCleanCategoryDetails('planner', invalidPlanner);
    assert.strictEqual(cleanResult.success, false);
  });

  // ─── Test 9: Performer Custom Duration Validation ───────────────────────────
  it('should require customDuration when performanceDuration is "Custom duration"', () => {
    const payload = {
      eventName: 'College Fest',
      eventType: 'Concert / Live Show',
      dateMode: 'single',
      startDate: '2027-09-15',
      location: 'Pune',
      category: 'performer',
      categoryDetails: {
        performerType: 'DJ',
        genreOrStyle: 'EDM',
        performerCount: 1,
        performanceDuration: 'Custom duration',
        customDuration: '', // empty custom duration!
        numberOfSets: '1',
        budgetRange: '₹25,000–₹50,000',
      },
    };

    const res = requirementSchema.safeParse(payload);
    assert.strictEqual(res.success, false);
    const hasCustomDurationError = res.error?.issues.some(
      (i) => i.path.includes('customDuration')
    );
    assert.strictEqual(hasCustomDurationError, true);
  });

  // ─── Test 10: validateAndCleanCategoryDetails Strips Extraneous Fields ──────
  it('should validate and sanitize category details against the designated schema', () => {
    const details = {
      servicesRequired: ['Partial planning'],
      estimatedGuestCount: 80,
      planningStage: 'Exploring options',
      budgetRange: '₹1,00,000–₹2,50,000',
      unrelatedField: 'should be stripped',
    };

    const clean = validateAndCleanCategoryDetails('planner', details);
    assert.strictEqual(clean.success, true);
    if (clean.success) {
      assert.strictEqual('unrelatedField' in clean.data, false);
      assert.strictEqual(clean.data.estimatedGuestCount, 80);
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
