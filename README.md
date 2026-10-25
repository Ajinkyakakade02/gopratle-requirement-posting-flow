# GoPratle — Full-Stack Requirement Posting Flow

A production-ready full-stack event requirement posting application built for the **GoPratle Full-Stack Developer Internship** technical assignment.

---

## 1. Project Background and Purpose

GoPratle connects event organizers with professional event service providers. This application provides a four-step dynamic workflow enabling users to post event requirements for three distinct categories:
1. **Event Planner**
2. **Performer**
3. **Crew**

Steps 2 and 3 dynamically adapt their fields, validation rules, and budget metrics to the selected category. When submitted, the backend validates both common event metadata and category-specific payloads before persisting the record to MongoDB Atlas.

---

## 2. Features Implemented

- **Multi-Step Dynamic Wizard**: 4-step wizard with visual stepper indicators, forward/backward data preservation, and deep review/edit links.
- **Dynamic Category Adaptation**: Steps 2 and 3 adapt completely based on the category selected in Step 1 (Planner vs. Performer vs. Crew).
- **Stale Field Isolation**: Switching categories in Step 1 resets category-specific data to prevent leakage of obsolete data into submissions.
- **Robust Validation**: Dual-layer validation (client-side form validation + server-side Zod schemas with custom refinement logic).
- **Date Range Flexibility**: Supports both single-day events and multi-day date ranges with calendar validation (end date cannot precede start date).
- **Conditional Fields**: Seamless toggle for "Other" event type and performer "Custom duration" with contextual validation.
- **Professional UI/UX**: Indigo-accented modern SaaS aesthetic built with Tailwind CSS, Lucide icons, accessible form controls, and responsive layouts.
- **Honest Connection & Error Handling**: Health-check endpoint reporting true MongoDB status, 503 response on database disconnection, and client-side error recovery preserving user input.
- **Duplicate Submission Guard**: Disables submit button and shows animated spinner during in-flight requests.

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Form Management**: React State & React Hook Form
- **Validation**: Zod schema validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Language**: TypeScript (`tsx` runner & `tsc` build)
- **ODM**: Mongoose 8
- **Validation**: Zod with custom refinement checks
- **Security**: Helmet, CORS (origin-restricted)
- **Environment**: dotenv

### Database
- **Provider**: MongoDB Atlas
- **Collection**: `requirements`
- **Schema**: Typed Mongoose schema with embedded category details and timestamps

---

## 4. Four-Step User Flow

```
[ Step 1: Event Basics ]
       │
       ▼ (Event Name, Type, Date/Range, Location, Category)
[ Step 2: Category Requirements ]
       │
       ▼ (Dynamic fields tailored to Planner / Performer / Crew)
[ Step 3: Budget & Logistics ]
       │
       ▼ (INR-based budget ranges, sets, shifts, equipment, preferences)
[ Step 4: Review & Submit ]
       │
       ▼ (Summary of all entries, Edit buttons to jump back, Submit to Express API)
[ Submission Success State ]
       └─ Displays MongoDB Document ID, Category, and Timestamp
```

---

## 5. Category-Specific Fields Comparison

| Feature / Step | Event Planner | Performer | Crew |
| :--- | :--- | :--- | :--- |
| **Step 2: Core Details** | • Services required (multi-select)<br>• Guest count (positive int)<br>• Planning stage (dropdown) | • Performer type (dropdown)<br>• Genre / style (text)<br>• Number of performers (int)<br>• Duration (dropdown + custom input) | • Required roles (multi-select)<br>• Number of crew (positive int)<br>• Experience level (dropdown) |
| **Step 3: Budget & Logistics** | • Budget range (INR)<br>• Preferred style/theme (optional)<br>• Additional requirements (optional) | • Number of sets (dropdown)<br>• Budget range (INR)<br>• Technical reqs (optional)<br>• Additional reqs (optional) | • Shift duration (dropdown)<br>• Compensation budget (INR)<br>• Equipment provision (dropdown)<br>• Additional reqs (optional) |

---

## 6. Architecture & Data Flow

```
┌────────────────────────────────┐         REST JSON        ┌────────────────────────────────┐
│   Next.js 16 App Router        │ ───────────────────────► │   Express.js API Server        │
│   (Port 3000)                  │                          │   (Port 5000)                  │
│                                │                          │                                │
│   • Multi-step Form State      │                          │   • Helmet / CORS              │
│   • Client-side Validation     │                          │   • Zod Schema Validation      │
│   • Review & Navigation        │ ◄─────────────────────── │   • Sanitation & DB Guards     │
└────────────────────────────────┘      JSON Response       └──────────────┬─────────────────┘
                                                                           │
                                                                           │ Mongoose ODM
                                                                           ▼
                                                            ┌────────────────────────────────┐
                                                            │   MongoDB Atlas                │
                                                            │   `requirements` Collection    │
                                                            └────────────────────────────────┘
```

---

## 7. Project Folder Structure

```text
gopratle-requirement-posting-flow/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css              # Design system & Tailwind styling
│   │   │   ├── layout.tsx               # Root layout & SEO metadata
│   │   │   └── page.tsx                 # Main application page
│   │   ├── components/
│   │   │   ├── ProgressStepper.tsx      # Step progress bar
│   │   │   ├── Step1EventBasics.tsx     # Step 1 component
│   │   │   ├── Step2CategoryCore.tsx    # Step 2 dynamic component
│   │   │   ├── Step3BudgetLogistics.tsx # Step 3 dynamic component
│   │   │   ├── Step4ReviewSubmit.tsx    # Step 4 review & submit component
│   │   │   └── RequirementForm.tsx      # Form orchestrator & state manager
│   │   ├── lib/
│   │   │   ├── api.ts                   # Fetch client & payload builder
│   │   │   └── validation.ts            # Client validation logic
│   │   └── types/
│   │       └── index.ts                 # TypeScript types & constants
│   ├── .env.local.example               # Frontend environment template
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts              # MongoDB connection & status tracker
│   │   ├── controllers/
│   │   │   └── requirementController.ts # Health check & requirement handlers
│   │   ├── models/
│   │   │   └── Requirement.ts           # Mongoose Requirement model & schemas
│   │   ├── routes/
│   │   │   └── api.ts                   # API route definitions
│   │   ├── tests/
│   │   │   └── validator.test.ts        # Automated validation test suite
│   │   ├── validators/
│   │   │   └── requirementValidator.ts  # Zod validation & payload cleaner
│   │   └── server.ts                    # Express app initialization
│   ├── .env.example                     # Backend environment template
│   ├── package.json
│   └── tsconfig.json
├── package.json                         # Root monorepo scripts
├── .gitignore                           # Git ignore rules
└── README.md                            # Complete documentation
```

---

## 8. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB Atlas Account**: (or a local MongoDB instance running on `mongodb://localhost:27017/gopratle`)

---

## 9. Installation

From the project root:

```bash
# 1. Install root, frontend, and backend dependencies
npm run install:all
npm install
```

---

## 10. Environment Variables Setup

### Backend Configuration
Create `backend/.env` from the provided example:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gopratle?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:3000
```

> **Security Note**: Never commit `.env` or `.env.local` to Git. `.gitignore` is already configured to exclude all `.env*` files except `.env.example`.

### Frontend Configuration
Create `frontend/.env.local`:
```bash
cp frontend/.env.local.example frontend/.env.local
```

Edit `frontend/.env.local`:
```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## 11. MongoDB Atlas Setup Instructions

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new free cluster (M0 sandbox).
3. Under **Security > Database Access**:
   - Create a database user (e.g., `gopratle_user`).
   - Assign `Read and write to any database` role.
   - Note the password securely.
4. Under **Security > Network Access**:
   - Add your IP address, or `0.0.0.0/0` (allow access from anywhere for development).
5. Under **Deployments > Database**:
   - Click **Connect** on your cluster.
   - Select **Drivers** (Node.js).
   - Copy the connection string. Replace `<username>` and `<password>` with your user credentials.
   - Add database name `/gopratle` before the query parameters:
     ```
     mongodb+srv://gopratle_user:YOUR_PASSWORD@cluster0.abcde.mongodb.net/gopratle?retryWrites=true&w=majority
     ```
6. Paste this URI into `backend/.env` as `MONGODB_URI`.

---

## 12. Running Locally

### Start Both Frontend & Backend Concurrently
From the project root:
```bash
npm run dev
```

### Or Run Individually

**Backend**:
```bash
npm run dev:backend
# Starts Express on http://localhost:5000
```

**Frontend**:
```bash
npm run dev:frontend
# Starts Next.js on http://localhost:3000
```

---

## 13. API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Returns server status and live MongoDB connection state.
- **Example Response (Database connected)**:
  ```json
  {
    "success": true,
    "message": "GoPratle API is running.",
    "data": {
      "status": "ok",
      "timestamp": "2027-04-15T10:00:00.000Z",
      "database": {
        "connected": true,
        "readyState": "connected"
      }
    }
  }
  ```
- **Example Response (Database not configured / offline)**:
  ```json
  {
    "success": true,
    "message": "GoPratle API is running.",
    "data": {
      "status": "ok",
      "timestamp": "2027-04-15T10:00:00.000Z",
      "database": {
        "connected": false,
        "readyState": "disconnected"
      }
    }
  }
  ```

### 2. Submit Event Requirement
- **Endpoint**: `POST /api/requirements`
- **Content-Type**: `application/json`

#### Example Request Payload (Performer):
```json
{
  "eventName": "Summer Indie Festival",
  "eventType": "Concert / Live Show",
  "eventTypeOther": null,
  "dateMode": "range",
  "startDate": "2027-04-10",
  "endDate": "2027-04-12",
  "location": "Pune, Maharashtra",
  "venue": "Royal Palms Arena",
  "category": "performer",
  "categoryDetails": {
    "performerType": "Band",
    "genreOrStyle": "Alternative Rock",
    "performerCount": 4,
    "performanceDuration": "90 minutes",
    "customDuration": "",
    "numberOfSets": "2",
    "budgetRange": "₹50,000–₹1,00,000",
    "technicalRequirements": "4 vocal mics, 2 monitor wedges",
    "additionalRequirements": "Green room with refreshments"
  }
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Requirement submitted successfully.",
  "data": {
    "id": "6627c24f9b8c1a2d3e4f5a6b",
    "category": "performer",
    "createdAt": "2027-04-15T10:05:00.000Z"
  }
}
```

#### Validation Error Response (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Please correct the highlighted fields.",
  "errors": {
    "eventName": "Event name is required.",
    "categoryDetails.genreOrStyle": "Genre or performance style is required."
  }
}
```

#### Database Unavailable Response (`503 Service Unavailable`):
```json
{
  "success": false,
  "message": "Database is currently unavailable. Please try again later.",
  "errors": {}
}
```

---

## 14. Testing & Verification

### Automated Checks
Run all automated checks from the project root:

```bash
# 1. Run backend unit & validation tests (10 test cases)
npm test

# 2. Run TypeScript strict typecheck across frontend and backend
npm run typecheck

# 3. Run ESLint across frontend
npm run lint

# 4. Run production builds for both frontend and backend
npm run build
```

### Manual Verification Checklist
1. **Step 1 Validation**:
   - Attempt to click "Continue" with empty fields → verify required field warnings appear.
   - Choose "Other" event type → verify "Specify Event Type" appears and is required.
   - Toggle "Date range" → verify end date field appears and requires a date on or after the start date.
2. **Category Dynamic Adaptation**:
   - Select **Event Planner** → continue to Step 2 and verify planner services, guest count, planning stage.
   - Go back to Step 1, select **Performer** → continue to Step 2 and verify performer type, genre, count, duration.
   - Select "Custom duration" → verify custom duration field appears and is required.
   - Go back to Step 1, select **Crew** → continue to Step 2 and verify crew roles, crew count, experience level.
3. **Step 3 Budgets**:
   - Verify Planner shows planner INR ranges and preferred theme.
   - Verify Performer shows sets, performer INR ranges, and technical requirements.
   - Verify Crew shows shifts, crew compensation INR ranges, and equipment provision options.
4. **Step 4 Review & Navigation**:
   - Verify summary formats entered data cleanly.
   - Click "Edit" on Event Basics → verify navigation back to Step 1 with all entered data intact.
   - Click "Edit" on Category Requirements → verify navigation back to Step 2.
5. **Submission Handling**:
   - If database is disconnected: click "Submit" → verify friendly error message displayed, input preserved, and retry available.
   - If database is connected: click "Submit" → verify loading spinner, disable state, followed by submission success card with MongoDB Document ID and "Post Another Requirement" button.

---

## 15. Product Assumptions

Because the technical assignment did not specify exact enum options or ranges, the following reasonable engineering decisions were made:

1. **Budget Ranges (INR)**:
   - **Event Planner**: `Under ₹50,000`, `₹50,000–₹1,00,000`, `₹1,00,000–₹2,50,000`, `₹2,50,000–₹5,00,000`, `₹5,00,000–₹10,00,000`, `Above ₹10,00,000`, `Flexible / Not yet decided`.
   - **Performer**: `Under ₹10,000`, `₹10,000–₹25,000`, `₹25,000–₹50,000`, `₹50,000–₹1,00,000`, `₹1,00,000–₹2,50,000`, `Above ₹2,50,000`, `Flexible / Not yet decided`.
   - **Crew Compensation**: `Under ₹5,000 per person`, `₹5,000–₹10,000 per person`, `₹10,000–₹20,000 per person`, `₹20,000–₹40,000 per person`, `Above ₹40,000 per person`, `Flexible / Not yet decided`.
2. **Shift Durations for Crew**: `3–4 hours`, `5–8 hours`, `Full day`, `Multiple days`.
3. **Equipment Provision for Crew**: `Provided by organiser`, `Partially provided`, `Crew should bring equipment`.
4. **Performance Sets**: `1`, `2`, `3`, `4+`.

---

## 16. Known Limitations

- Submissions require a valid MongoDB Atlas URI in `backend/.env`. When `MONGODB_URI` is blank, the backend runs and passes all health checks and schema validations, returning `503 Service Unavailable` with a descriptive message upon submission attempts.
