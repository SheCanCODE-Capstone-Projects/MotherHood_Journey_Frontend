# Vaccination Session Integration Guide

## Overview
This guide explains how to integrate the vaccination session module into your health worker workflow and backend APIs.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Vaccination Session Page                   │
│         (app/(health-worker)/vaccinations/page.tsx)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    Search Input   Session Display  Dialog
    ┌────────┐    ┌──────────────┐  ┌──────────┐
    │ hooks  │    │ Child Info   │  │ Lot      │
    │(300ms) │    │ Due Vaccines │  │ Number   │
    └────────┘    └──────────────┘  └──────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
  useVaccination  useVaccination  useAdminister
  SessionSearch   SessionSearch   Vaccination
  
  (queries)                        (mutation)
        │                              │
        └──────────────┬───────────────┘
                       │
              ┌────────▼─────────┐
              │  React Query     │
              │  Cache Manager   │
              └────────┬─────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   lib/api/     lib/api/         features/
   children.ts  client.ts        child/hooks
```

## Backend API Requirements

### 1. Search Child Vaccination Session
```
GET /api/v1/children/vaccinations/session?search_term={searchTerm}

Response (200):
{
  "child": {
    "id": "uuid",
    "fullName": "John Doe",
    "healthId": "HW-2024-001",
    "birthCertificateNo": "BC-2020-001",
    "dateOfBirth": "2020-05-15",
    "ageInYears": 4,
    "ageInMonths": 3,
    "motherName": "Jane Doe",
    "facilityName": "Central Health Center"
  },
  "dueVaccines": [
    {
      "id": "vac-id-1",
      "vaccineName": "Polio",
      "doseLabel": "Dose 2 of 3",
      "status": "PENDING",
      "dueDate": "2024-05-20",
      "note": "Routine immunization"
    }
  ]
}

Error (404):
{
  "statusCode": 404,
  "message": "Child not found"
}
```

### 2. Administer Vaccination
```
PUT /api/v1/vaccinations/{id}/administer

Request:
{
  "lot_number": "LOT-20240515-001"
}

Response (204 No Content):

Error (400):
{
  "statusCode": 400,
  "message": "Invalid lot number format"
}

Error (404):
{
  "statusCode": 404,
  "message": "Vaccination record not found"
}
```

### 3. Get Child Vaccination Card (optional)
```
GET /api/v1/children/{childId}/vaccinations

Response (200):
{
  "child": {...},
  "lastUpdatedAt": "2024-05-15T10:30:00Z",
  "vaccines": [...]
}
```

## Frontend Integration Steps

### Step 1: Configure Query Client (Already Done)
The `queryClient` is already configured in `src/shared/lib/query-client.ts` with appropriate defaults:
- Stale time: 5 minutes
- Cache time: 10 minutes
- Retry: 1
- No window focus refetch

### Step 2: Use Hooks in Page Component
```tsx
'use client';

import { useVaccinationSessionSearch, useAdministerVaccination } from '@/features/child/hooks';
import { useState, useCallback } from 'react';

export default function VaccinationSessionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch session on debounced search term change
  const sessionQuery = useVaccinationSessionSearch(debouncedSearchTerm);
  
  // Mutation for administering vaccine
  const administerMutation = useAdministerVaccination();

  const handleAdminister = useCallback((vaccinationId, lotNumber) => {
    administerMutation.mutate({ vaccinationId, lotNumber }, {
      onSuccess: () => {
        // Clear search for next child
        setSearchTerm('');
        setDebouncedSearchTerm('');
        // Show success toast
      },
      onError: (error) => {
        // Show error toast
      }
    });
  }, [administerMutation]);

  return (
    // Implementation
  );
}
```

### Step 3: Handle Different States
```tsx
// Loading state
if (sessionQuery.isLoading) {
  return <SessionLoadingCard />;
}

// Error state
if (sessionQuery.isError) {
  return <ErrorMessage error={sessionQuery.error} />;
}

// Not found state
if (sessionQuery.error?.statusCode === 404) {
  return <NotFoundMessage />;
}

// Success state
if (sessionQuery.data) {
  return <SessionDisplay session={sessionQuery.data} />;
}
```

## Data Flow

### Search Flow
1. User types in search input
2. 300ms debounce timer starts
3. On debounce completion, `useVaccinationSessionSearch` query runs
4. API returns session data with due vaccines
5. Component displays child info and vaccination list
6. Cache is set for 5 minutes

### Administration Flow
1. User clicks "Mark administered" button
2. Dialog opens with lot number input
3. User enters lot number and confirms
4. `useAdministerVaccination` mutation runs
5. PUT request sent to `/api/v1/vaccinations/{id}/administer`
6. On success:
   - All child vaccination queries are invalidated
   - Component shows success toast
   - Search is cleared for next child
   - User can immediately search for another child
7. On error, component shows error toast

## Validation

The module includes validators in `src/features/child/utils/validators.ts`:
- `validateLotNumber()`: Ensures lot number is non-empty
- `validateSearchTerm()`: Ensures search term is non-empty
- `isValidVaccinationSessionData()`: Validates complete response structure
- `canAdministerVaccine()`: Checks if vaccine status allows administration
- `calculateAge()`: Calculates age in years and months

Use these in your backend API responses to ensure data integrity.

## Error Handling

### Common Error Scenarios

**Child Not Found (404)**
- Search term doesn't match any child
- Display: "No child record matched this search"

**Invalid Lot Number (400)**
- Lot number is empty or invalid format
- Display: "Lot number is required"

**Network Error**
- Backend is unreachable
- Query has retry (1) configured
- Fallback to stale cache if available

**Server Error (5xx)**
- Backend processing failed
- Display: "Unable to administer vaccination"

### Toast Messages
- Success: `{vaccineName} marked as administered`
- Error: API error message or generic fallback

## Performance Considerations

1. **Search Debouncing**: 300ms debounce reduces API calls
2. **Query Caching**: 5-minute stale time prevents redundant API calls
3. **Cache Invalidation**: Only vaccination queries are invalidated on administration
4. **Batch Operations**: Each vaccination administration invalidates entire vaccination cache
5. **Memory**: 10-minute garbage collection time removes unused cache

## Testing Checklist

- [ ] Search works with health ID
- [ ] Search works with birth certificate number
- [ ] Search debounces correctly
- [ ] Child information displays correctly
- [ ] Due vaccines list displays correctly
- [ ] Can open administration dialog
- [ ] Lot number validation works
- [ ] Administration mutation succeeds
- [ ] Success toast appears
- [ ] Cache invalidates properly
- [ ] Search clears after administration
- [ ] Error handling works
- [ ] Keyboard shortcuts work (Enter to submit, Esc to close)

## Modernization Notes

This implementation uses:
- **React 19.2.4**: Latest React with server components support
- **React Query 5.99.2**: Latest TanStack Query with improved caching
- **Next.js 16.2.4**: Latest Next.js with app router
- **TypeScript 5**: Full type safety
- **Tailwind CSS 4**: Modern utility-first CSS
- **Zustand 5**: State management for auth
- **React Hook Form 7.72.1**: Form state management
- **Zod 4.3.6**: Runtime validation

All code follows modern React patterns:
- Functional components
- Hooks for state and side effects
- Server components where applicable
- Error boundaries for error handling
- Proper cleanup in useEffect
- Memoization where appropriate
