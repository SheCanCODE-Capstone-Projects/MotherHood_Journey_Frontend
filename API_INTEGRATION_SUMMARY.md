# API Integration Summary - Children & Consent Management

## Overview
This document summarizes the complete API integration for Child management and Consent management modules, replacing all mock data with real backend API calls.

## Changes Made

### 1. Consent API Integration (`src/lib/api/consent.ts`)
**Status:** ✅ Complete

**Changes:**
- Removed all mock data fallbacks
- API functions now throw errors on failure instead of returning mock data
- Functions now directly call the backend API:
  - `getAllConsents(patientId)` - GET `/api/v1/consent?patientId={patientId}`
  - `grantConsent(patientId, request)` - POST `/api/v1/consent`
  - `revokeConsent(consentId)` - DELETE `/api/v1/consent/{consentId}`

**Legal Framework:**
- All consent operations comply with Rwanda Law No. 058/2021
- Consent types supported:
  - `GOV_DATA_SHARE` - Government Data Sharing
  - `SMS_REMINDERS` - SMS Reminders
  - `RESEARCH_PARTICIPATION` - Research Participation
  - `FACILITY_TRANSFER` - Facility Transfer

### 2. Children List Page (`src/app/patient/children/page.tsx`)
**Status:** ✅ Complete

**Changes:**
- Replaced mock data with real API calls
- Added loading states with spinner
- Added error handling with user-friendly messages
- Added empty state when no children are registered
- Features:
  - Fetches all children for the current mother
  - Displays vaccination progress for each child
  - Shows next due vaccination
  - Links to detailed child profile and vaccination card
  - Real-time immunization tracking

**API Endpoints Used:**
- `GET /api/v1/children` - List all children
- `GET /api/v1/children/{childId}/vaccinations` - Get vaccination records for each child

### 3. Child Profile Page (`src/app/patient/children/[childId]/page.tsx`)
**Status:** ✅ Complete

**Changes:**
- Removed mock data (`MOCK_CHILD`)
- Added real API integration
- Added loading and error states
- Displays real child data from backend
- Shows:
  - Child's name, age, and gender
  - Birth details (date of birth, delivery type, birth weight)
  - Health status
  - Quick actions to view vaccination card

**API Endpoints Used:**
- `GET /api/v1/children/{childId}` - Get child details

### 4. Consent Management Page (`src/app/patient/consent/page.tsx`)
**Status:** ✅ Complete

**Changes:**
- Enhanced with React Query for better data management
- Added comprehensive error handling
- Added loading states
- Added retry functionality on error
- Improved toggle switch states (disabled during mutations)
- Features:
  - Real-time consent status from backend
  - Grant/revoke consent with proper error handling
  - Warning dialog for GOV_DATA_SHARE revocation
  - Automatic cache invalidation after mutations

**API Endpoints Used:**
- `GET /api/v1/consent?patientId={patientId}` - Get all consents
- `POST /api/v1/consent` - Grant new consent
- `DELETE /api/v1/consent/{consentId}` - Revoke consent

## API Configuration

### Base URL
```env
NEXT_PUBLIC_API_URL=https://motherhoodjourneybackend-production.up.railway.app
```

### Authentication
All API requests automatically include bearer token authentication via the API client (`src/lib/api/client.ts`).

## Key Features Implemented

### Child Management
✅ **Child Registration** - Already integrated via `/health-worker/children/register`  
✅ **Child Listing** - Real-time list of children with vaccination progress  
✅ **Child Profile** - Detailed child information from backend  
✅ **Immunization Tracking** - Real-time vaccination status and due dates  
✅ **Vaccination Card** - Complete immunization schedule (already integrated)  
✅ **Error Handling** - Comprehensive error states and retry mechanisms  
✅ **Loading States** - User-friendly loading indicators  

### Consent Management
✅ **View Consents** - Real-time consent records from backend  
✅ **Grant Consent** - Create new consent under Rwanda Law No. 058/2021  
✅ **Revoke Consent** - Revoke consent with proper warnings  
✅ **Legal Compliance** - All operations comply with Rwanda data protection law  
✅ **Expiry Management** - Support for consent expiry dates  
✅ **Error Handling** - Comprehensive error states and retry mechanisms  
✅ **Real-time Updates** - React Query automatic cache invalidation  

## Testing Checklist

### Child Management
- [ ] Navigate to `/patient/children` - Should load children from backend
- [ ] Click on a child - Should show detailed profile with real data
- [ ] View vaccination card - Should load real vaccination records
- [ ] Test error handling - Should show error message when API fails
- [ ] Test loading states - Should show spinner while loading

### Consent Management
- [ ] Navigate to `/patient/consent` - Should load consent records
- [ ] Toggle consent switches - Should grant/revoke consent via API
- [ ] Test GOV_DATA_SHARE revocation - Should show warning dialog
- [ ] Test error handling - Should show error message and retry button
- [ ] Test loading states - Should show spinner while loading

## API Endpoints Reference

### Children Endpoints
```
POST   /api/v1/children                    - Register child
GET    /api/v1/children                    - List children
GET    /api/v1/children/{id}               - Get child details
GET    /api/v1/children/{id}/vaccinations  - Get vaccination records
GET    /api/v1/children/search             - Search child by health ID/birth cert
PUT    /api/v1/vaccinations/{id}/administer - Mark vaccine as administered
GET    /api/v1/mothers/search              - Search mothers
```

### Consent Endpoints
```
GET    /api/v1/consent                     - Get all consents
POST   /api/v1/consent                     - Grant consent
DELETE /api/v1/consent/{id}                - Revoke consent
```

## Error Handling

All API calls now have proper error handling:

```typescript
try {
  const data = await apiClient.get('/api/v1/children');
  // Process data
} catch (error) {
  if (isApiError(error)) {
    // Handle specific error codes
    if (error.isUnauthorized()) {
      // Redirect to login
    } else if (error.isForbidden()) {
      // Show permission error
    } else if (error.isClientError()) {
      // Show validation error
    } else if (error.isServerError()) {
      // Show server error
    }
  }
}
```

## Next Steps

### Recommended Enhancements
1. **Growth Monitoring API** - Add endpoints for tracking child growth metrics
2. **Mother-Child Linking** - Better integration between mother and child profiles
3. **Vaccination Reminders** - Automated SMS reminders for due vaccinations
4. **Growth Charts** - Visual representation of child growth over time
5. **Export Functionality** - Export vaccination records as PDF

### Backend API Needs
1. **List Children by Mother** - Dedicated endpoint to get all children for a mother
2. **Growth Records** - API endpoints for recording and retrieving growth data
3. **Mother Profile** - Endpoint to get mother details by ID
4. **Batch Operations** - Support for batch vaccination record updates

## Documentation

- **Full API Integration Guide:** `CHILD_CONSENT_API_INTEGRATION.md`
- **Vaccination API Guide:** `VACCINATION_API_INTEGRATION.md`
- **Appointment API Guide:** `APPOINTMENT_API_INTEGRATION.md`
- **Swagger Documentation:** https://motherhoodjourneybackend-production.up.railway.app/swagger-ui/index.html

## Support

For issues or questions:
1. Check the Swagger documentation
2. Review network requests in browser DevTools
3. Verify authentication token is valid
4. Contact the backend team for API-related issues

## Compliance

All consent management operations comply with:
- **Rwanda Law No. 058/2021** - Law relating to the protection of personal data and privacy
- **Data Protection Principles** - Lawful, fair, and transparent processing
- **User Rights** - Right to grant, revoke, and manage consent
- **Audit Trail** - All consent changes are logged with timestamps

---

**Integration Date:** May 29, 2026  
**Status:** ✅ Complete - All mock data removed and replaced with real API calls  
**Backend URL:** https://motherhoodjourneybackend-production.up.railway.app