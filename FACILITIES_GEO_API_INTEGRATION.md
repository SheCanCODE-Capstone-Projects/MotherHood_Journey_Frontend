# Facilities & Geo API Integration Summary

## Overview
This document summarizes the integration of real backend APIs for Facilities and Geo (Rwanda's 5-level administrative hierarchy) in the MotherHood Journey frontend, replacing all mock data.

## Changes Made

### 1. Geo API Integration

#### Files Modified:
- **`src/shared/components/forms/GeoLocationSelect.tsx`** - Complete rewrite
  - Now uses real API endpoints from `src/lib/api/geo.ts`
  - Implements cascading dropdowns for all 5 levels:
    - Province → District → Sector → Cell → Village
  - Format: "Province > District > Sector > Cell > Village"
  - Uses React Query for data fetching and caching
  - Supports partial selections (can use fewer than 5 levels)

#### API Endpoints Used:
```
GET /api/v1/geo/provinces          - Get all provinces
GET /api/v1/geo/districts?province - Get districts by province
GET /api/v1/geo/sectors?province&district - Get sectors by district
GET /api/v1/geo/cells?province&district&sector - Get cells by sector
GET /api/v1/geo/villages?province&district&sector&cell - Get villages by cell
```

#### Query Keys Added:
```typescript
geo: {
  provinces: ["geo", "provinces"],
  districts: ["geo", "districts"],
  sectors: ["geo", "sectors"],
  cells: ["geo", "cells"],
  villages: ["geo", "villages"],
  facilities: ["geo", "facilities"],
}
```

### 2. Facilities API Integration

#### New File Created:
- **`src/lib/api/facilities.ts`** - Complete CRUD operations
  - `getFacilities()` - Get paginated list of all facilities
  - `getFacilityById()` - Get single facility details
  - `createFacility()` - Create new facility
  - `updateFacility()` - Update facility
  - `deleteFacility()` - Delete facility
  - `getPublicFacilities()` - Get public listing for registration pickers
  - `getFacilityAnalytics()` - Get per-facility analytics
  - `searchFacilities()` - Search facilities by query

#### API Endpoints:
```
GET    /api/v1/facilities                    - List facilities (paginated)
GET    /api/v1/facilities/{id}               - Get facility by ID
POST   /api/v1/facilities                    - Create facility
PUT    /api/v1/facilities/{id}               - Update facility
DELETE /api/v1/facilities/{id}               - Delete facility
GET    /api/v1/facilities/public             - Get public facility listing
GET    /api/v1/facilities/{id}/analytics     - Get facility analytics
GET    /api/v1/facilities/search?q={query}   - Search facilities
```

#### New Component Created:
- **`src/shared/components/forms/FacilitySelect.tsx`**
  - Dropdown selector for health facilities
  - Can filter by province, district, sector
  - Used in registration forms to select health facility
  - Displays facility name, type, and sector

### 3. Facility Stats API - Mock Data Removed

#### File Modified:
- **`src/lib/api/facility-stats.ts`**
  - Removed `MOCK_FACILITIES` array
  - Removed `generateMockHeatmap()` function
  - Removed all fallback/mock data logic
  - Now only makes real API calls
  - Added proper error handling

#### API Endpoints Used:
```
GET /api/v1/facilities/stats              - Get all facility statistics
GET /api/v1/facilities/{id}/stats         - Get stats for specific facility
GET /api/v1/facilities/no-show-heatmap    - Get no-show heatmap data
```

## Usage Examples

### Using GeoLocationSelect
```tsx
import { GeoLocationSelect } from "@/shared/components/forms/GeoLocationSelect";

<GeoLocationSelect
  value={selectedLocation}
  onChange={(location) => setSelectedLocation(location)}
  error={errors.home_location?.message}
  disabled={isSubmitting}
  levels={5} // Show all 5 levels
  showLabels={true}
/>
```

### Using FacilitySelect
```tsx
import { FacilitySelect } from "@/shared/components/forms/FacilitySelect";

<FacilitySelect
  value={selectedFacilityId}
  onChange={(id) => setSelectedFacilityId(id)}
  province={selectedProvince}
  district={selectedDistrict}
  sector={selectedSector}
  error={errors.facility?.message}
  disabled={isSubmitting}
/>
```

### Using Facilities API
```tsx
import { 
  getFacilities, 
  getPublicFacilities, 
  getFacilityAnalytics 
} from "@/lib/api/facilities";

// Get all facilities
const facilities = await getFacilities(0, 20);

// Get public facilities filtered by location
const publicFacilities = await getPublicFacilities(
  "Kigali", 
  "Nyarugenge", 
  "Kimisagara"
);

// Get analytics for a specific facility
const analytics = await getFacilityAnalytics("facility-id-123");
```

## Testing the Integration

### 1. Test Geo API
```bash
# Test provinces endpoint
curl https://motherhoodjourneybackend-production.up.railway.app/api/v1/geo/provinces

# Test districts endpoint
curl "https://motherhoodjourneybackend-production.up.railway.app/api/v1/geo/districts?province=Kigali"
```

### 2. Test Facilities API
```bash
# Test public facilities endpoint
curl "https://motherhoodjourneybackend-production.up.railway.app/api/v1/facilities/public?province=Kigali"

# Test facility stats endpoint
curl https://motherhoodjourneybackend-production.up.railway.app/api/v1/facilities/stats
```

### 3. Test in Application
1. Navigate to mother registration form
2. Fill in Step 1 (Personal Information)
3. In Step 2, verify:
   - GeoLocationSelect loads provinces from API
   - Selecting a province loads districts
   - Selecting a district loads sectors
   - Continue through all 5 levels
4. Submit form and verify data is sent to backend

## Breaking Changes

### Removed Mock Data
- `MOCK_FACILITIES` array removed from `facility-stats.ts`
- `generateMockHeatmap()` function removed
- `RWANDA_LOCATIONS` array removed from `GeoLocationSelect.tsx`

### API Requirements
The backend must expose the following endpoints:
1. All Geo hierarchy endpoints (provinces, districts, sectors, cells, villages)
2. All Facilities CRUD endpoints
3. Facilities stats and analytics endpoints
4. Public facility listing endpoint

If any endpoint is missing, the application will show error states.

## Next Steps

### Recommended Enhancements
1. **Add facility field to mother registration** - Update schema and forms to include facility selection
2. **Implement facility CRUD UI** - Create admin interface for managing facilities
3. **Add caching strategy** - Configure React Query cache times for geo data
4. **Error boundaries** - Add proper error handling and user feedback
5. **Loading states** - Improve loading indicators for cascading selects

### Optional Improvements
1. **Search functionality** - Add search to facility dropdown for large lists
2. **Lazy loading** - Load villages only when cell is selected
3. **Offline support** - Cache geo data for offline use
4. **Performance optimization** - Virtual scrolling for large facility lists

## Environment Configuration

The application uses the API URL from `.env.local`:
```
NEXT_PUBLIC_API_URL=https://motherhoodjourneybackend-production.up.railway.app
```

All API calls are automatically prefixed with this URL and include the authentication token from the session.

## Dependencies

The integration uses these existing dependencies:
- `@tanstack/react-query` - For API state management and caching
- `react-hook-form` - For form management
- `zod` - For validation
- `lucide-react` - For icons

No new dependencies were added.

## Support

For issues or questions about the API integration:
1. Check the Swagger documentation at: https://motherhoodjourneybackend-production.up.railway.app/swagger-ui/index.html
2. Review the API response formats in `src/lib/api/facilities.ts` and `src/lib/api/geo.ts`
3. Check browser console for API errors
4. Verify network requests in browser DevTools

---

**Last Updated:** May 29, 2026
**Status:** ✅ Complete - All mock data removed, real APIs integrated