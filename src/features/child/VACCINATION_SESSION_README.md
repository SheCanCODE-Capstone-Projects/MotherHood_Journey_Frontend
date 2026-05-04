# Health Worker Vaccination Session

This feature enables health workers to manage vaccination records during in-person sessions.

## Overview

The vaccination session page is located at `src/app/(health-worker)/vaccinations/page.tsx`.

### Core Functionality

- **Child Search**: Search for a child by health ID or birth certificate number
- **Session Lookup**: Displays the child's vaccination schedule and status
- **Record Administration**: Capture lot numbers and mark vaccines as administered
- **Real-time Feedback**: Toast notifications confirm successful administration or report errors

## Technical Architecture

### API Integration

All endpoints are backend-only (no frontend-local API routes):

- `GET /api/v1/children/search?search_term=...` — Search children by health ID or birth cert
- `GET /api/v1/children/{childId}/vaccinations` — Retrieve the child's vaccination session
- `PUT /api/v1/vaccinations/{id}/administer` — Mark a vaccine as administered with lot number

### Query Management

The feature uses TanStack React Query for server state:

- Query keys are centralized in `useVaccinationSession()` hook
- Search results are cached and invalidated after administration
- Mutations include error handling and user feedback

### Component Structure

```
src/
├── features/child/
│   ├── types.ts                          # VaccinationSessionStatus, ChildVaccinationSession*
│   ├── hooks/useVaccinationSession.ts    # useVaccinationSessionSearch, useAdministerVaccination
│   └── index.ts                          # Feature exports
├── lib/api/children.ts                   # Backend API helpers
└── app/(health-worker)/vaccinations/
    └── page.tsx                          # Session UI and flow
```

### Types

**VaccinationSessionStatus**: `"PENDING" | "ADMINISTERED" | "MISSED" | "OVERDUE"`

**ChildVaccinationSessionRecord**: Individual vaccine record with status, due date, dose label, and lot number.

**ChildVaccinationSessionResponse**: Complete session containing child details and due vaccines array.

## Usage

1. Navigate to the vaccination session page as a health worker
2. Enter a child's health ID or birth certificate number
3. Wait for the backend to return the session
4. For each due vaccine, click "Mark administered"
5. Enter the lot number in the dialog
6. Submit and confirm success

The page remains open for the next child after administration.

## Future Improvements

- Add batch vaccine administration (mark multiple at once)
- Export session data as PDF for records
- Offline support with sync when reconnected
- Mobile-optimized layout for tablets used in health facilities
