# Vaccination Session Module

## Overview
The vaccination session module provides a comprehensive system for health workers to manage child vaccinations during vaccination sessions. It enables searching for children by health ID or birth certificate number and recording administered vaccines with lot numbers.

## Features

### Search Functionality
- Search children by health ID or birth certificate number
- Real-time debounced search (300ms)
- React Query cache management with 5-minute stale time

### Vaccination Recording
- Display due vaccines for the selected child
- Mark vaccines as administered with lot number capture
- Immediate UI feedback with success/error toasts
- Query cache invalidation on successful administration

### Data Types

#### ChildVaccinationSessionRecord
Records individual vaccines that can be administered in a session:
- `id`: Unique vaccination record ID
- `vaccineName`: Name of the vaccine (e.g., "BCG", "Polio")
- `doseLabel`: Dose information (e.g., "Dose 1 of 3")
- `status`: "PENDING", "OVERDUE", or "ADMINISTERED"
- `dueDate`: Scheduled vaccination date
- `note`: Optional notes

#### VaccinationSessionChild
Child information for vaccination sessions:
- Basic demographics (name, health ID, birth certificate)
- Age calculation fields (ageInYears, ageInMonths)
- Facility information

#### VaccinationSessionData
Complete session response:
- `child`: VaccinationSessionChild data
- `dueVaccines`: Array of ChildVaccinationSessionRecord

## API Endpoints

### Search Child Vaccination Session
```
GET /api/v1/children/vaccinations/session?search_term={searchTerm}
```
Response: VaccinationSessionData

### Administer Vaccination
```
PUT /api/v1/vaccinations/{id}/administer
Body: { lot_number: string }
```
Response: void (204 on success)

### Get Vaccination Card
```
GET /api/v1/children/{childId}/vaccinations
```
Response: VaccinationCardData

### Get Vaccination Records
```
GET /api/v1/children/{childId}/vaccinations/records?status={status}
```
Response: VaccinationCardData

## React Hooks

### useVaccinationSessionSearch(searchTerm)
Searches for a child by health ID or birth certificate.
- Returns useQuery result with VaccinationSessionData
- Automatically disabled when searchTerm is empty
- 5-minute stale time, 10-minute cache time

### useAdministerVaccination()
Records a vaccination administration.
- Accepts { vaccinationId, lotNumber }
- Returns useMutation result
- Invalidates all child vaccination queries on success

## Usage Example

```tsx
'use client';

import { useVaccinationSessionSearch, useAdministerVaccination } from '@/features/child/hooks';
import { useState } from 'react';

export default function VaccinationSession() {
  const [searchTerm, setSearchTerm] = useState('');
  const sessionQuery = useVaccinationSessionSearch(searchTerm);
  const administerMutation = useAdministerVaccination();

  const handleAdminister = (vaccinationId: string, lotNumber: string) => {
    administerMutation.mutate({ vaccinationId, lotNumber }, {
      onSuccess: () => {
        // Show success toast
        // Clear search for next child
      },
      onError: (error) => {
        // Show error toast
      }
    });
  };

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by health ID or birth certificate"
      />
      
      {sessionQuery.data?.dueVaccines.map(vaccine => (
        <button key={vaccine.id} onClick={() => handleAdminister(vaccine.id, lotNumber)}>
          Mark administered
        </button>
      ))}
    </div>
  );
}
```

## Cache Strategy

The module uses React Query with these cache settings:
- **Stale Time**: 5 minutes - Data is considered fresh for 5 minutes
- **GC Time**: 10 minutes - Cache is kept for 10 minutes after becoming unused
- **Retry**: Once on failure
- **Window Focus**: No refetch on window focus

Cache is invalidated on successful vaccination administration to ensure current session data.

## Error Handling

All hooks implement proper error handling:
- API errors are caught and typed as ApiError
- User-facing error messages are provided
- Vaccination administration includes lot number validation
- Form errors displayed inline in dialog

## TypeScript Support

Full TypeScript support with:
- Strongly typed API responses
- Type-safe hook parameters
- Query key factory for cache management
- Proper error typing with ApiError interface
