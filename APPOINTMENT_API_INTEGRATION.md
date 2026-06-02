# Appointment API Integration Guide

## Overview
The appointment module has been integrated with the backend API. All appointment-related operations now use real API endpoints instead of mock data.

## Backend API Configuration

The application uses the same environment variable configured earlier:

```env
NEXT_PUBLIC_API_URL=https://motherhoodjourneybackend-production.up.railway.app
```

## Appointment API Endpoints

### 1. Search Patient
**Endpoint:** `GET /api/v1/appointments/patients/search?healthId={healthId}`

**Description:** Search for a patient by health ID to schedule an appointment.

**Usage:**
```typescript
import { searchPatient } from '@/lib/api/appointments';

const patient = await searchPatient('MHD-2024-001');
```

**Response Type:** `PatientInfo`
```typescript
{
  healthId: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  isMother: boolean;
  motherName?: string; // For child patients
  facilityId: string;
  facilityName: string;
}
```

### 2. Get Available Time Slots
**Endpoint:** `GET /api/v1/appointments/slots?date={date}&facilityId={facilityId}`

**Description:** Get capacity-checked available time slots for a specific date and facility.

**Usage:**
```typescript
import { getAvailableSlots } from '@/lib/api/appointments';

const slots = await getAvailableSlots('2025-01-28', 'FAC-001');
```

**Response Type:** `AvailableSlotsResponse`
```typescript
{
  date: string;
  slots: Array<{
    time: string; // HH:mm format
    isAvailable: boolean;
    reason?: string; // e.g., "Fully booked"
  }>;
}
```

### 3. Create Appointment
**Endpoint:** `POST /api/v1/appointments`

**Description:** Schedule a new appointment with optional SMS reminder.

**Request Body:**
```typescript
{
  patientHealthId: string;
  appointmentType: "ANC" | "PNC" | "VACCINATION" | "GROWTH_CHECK" | "FOLLOW_UP";
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  facilityId: string;
  notes?: string;
  sendSmsReminder: boolean;
}
```

**Usage:**
```typescript
import { createAppointment } from '@/lib/api/appointments';

const appointment = await createAppointment({
  patientHealthId: 'MHD-2024-001',
  appointmentType: 'ANC',
  appointmentDate: '2025-02-01',
  appointmentTime: '09:00',
  facilityId: 'FAC-001',
  notes: 'First trimester checkup',
  sendSmsReminder: true
});
```

**Response Type:** `AppointmentResponse`
```typescript
{
  id: string;
  referenceNumber: string;
  patientHealthId: string;
  patientName: string;
  appointmentType: string;
  appointmentDate: string;
  appointmentTime: string;
  facilityId: string;
  facilityName: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "MISSED";
  notes: string | null;
  sendSmsReminder: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 4. Get Appointment by Reference Number
**Endpoint:** `GET /api/v1/appointments/reference/{referenceNumber}`

**Description:** Retrieve appointment details using the reference number.

**Usage:**
```typescript
import { getAppointmentByReference } from '@/lib/api/appointments';

const appointment = await getAppointmentByReference('APT-20250128-001');
```

### 5. Get Appointments List
**Endpoint:** `GET /api/v1/appointments?page={page}&size={pageSize}&status={status}`

**Description:** Get paginated list of appointments with optional status filter.

**Usage:**
```typescript
import { getAppointments } from '@/lib/api/appointments';

// Get first page with 10 items
const result = await getAppointments(1, 10);

// Get only scheduled appointments
const scheduled = await getAppointments(1, 10, 'SCHEDULED');
```

**Response:**
```typescript
{
  content: Appointment[];
  totalPages: number;
  totalElements: number;
  pageNumber: number; // 1-based
  pageSize: number;
}
```

### 6. Get Upcoming Appointments
**Description:** Get appointments with status "SCHEDULED".

**Usage:**
```typescript
import { getUpcomingAppointments } from '@/lib/api/appointments';

const upcoming = await getUpcomingAppointments(10);
```

### 7. Get Past Appointments
**Description:** Get appointments with status "COMPLETED", "CANCELLED", or "NO_SHOW".

**Usage:**
```typescript
import { getPastAppointments } from '@/lib/api/appointments';

const past = await getPastAppointments(10);
```

### 8. Get Appointment Detail
**Endpoint:** `GET /api/v1/appointments/{appointmentId}`

**Description:** Get detailed information for a specific appointment.

**Usage:**
```typescript
import { getAppointmentDetail } from '@/lib/api/appointments';

const detail = await getAppointmentDetail('apt-123');
```

### 9. Cancel Appointment
**Endpoint:** `PATCH /api/v1/appointments/{appointmentId}/cancel`

**Description:** Cancel an appointment with optional reason.

**Usage:**
```typescript
import { cancelAppointment } from '@/lib/api/appointments';

const result = await cancelAppointment('apt-123', 'Patient requested cancellation');
```

### 10. Update Appointment Status
**Endpoint:** `PATCH /api/v1/appointments/{appointmentId}/status`

**Description:** Update appointment status (supports status lifecycle).

**Usage:**
```typescript
import { updateAppointmentStatus } from '@/lib/api/appointments';

// Confirm an appointment
const confirmed = await updateAppointmentStatus('apt-123', 'CONFIRMED');

// Mark as completed
const completed = await updateAppointmentStatus('apt-123', 'COMPLETED', 'Checkup completed successfully');
```

## Appointment Status Lifecycle

The appointment system supports the following status lifecycle:

```
SCHEDULED → CONFIRMED → COMPLETED
                ↓
            CANCELLED
            
SCHEDULED → NO_SHOW (patient didn't attend)
```

## Testing the Appointment Integration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the Appointment Scheduling Page
Navigate to: `http://localhost:3000/appointment` (or the appropriate route)

### 3. Test Patient Search
1. Enter a patient health ID (e.g., `MHD-2024-001`)
2. Verify patient information loads from the backend

### 4. Test Time Slot Selection
1. Select a date
2. Choose a facility
3. Verify available slots load with correct availability status

### 5. Test Appointment Creation
1. Fill in appointment details
2. Enable SMS reminder if desired
3. Submit the form
4. Verify success message and reference number

### 6. Test Appointment List
1. Navigate to appointments list page
2. Verify appointments load from backend
3. Test pagination if available

## Debugging Tips

### Check Network Requests
Open browser DevTools → Network tab → Look for:
- `patients/search` requests
- `slots` requests
- `appointments` POST/GET/PATCH requests

### Verify Request Headers
Ensure requests include:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Common Issues

**Issue: "Patient not found"**
- Verify the health ID exists in the system
- Check if the patient is registered

**Issue: "No available slots"**
- The facility may be fully booked for that date
- Try a different date or facility

**Issue: "401 Unauthorized"**
- Ensure you're logged in
- Check if token is valid

**Issue: "403 Forbidden"**
- Verify user has permission to schedule appointments

## API Documentation Reference

For complete API documentation, visit the Swagger UI:
https://motherhoodjourneybackend-production.up.railway.app/swagger-ui/index.html

## Key Features Implemented

✅ **Scheduling** - Full appointment scheduling with patient search
✅ **Capacity-checked slots** - Real-time slot availability based on facility capacity
✅ **SMS reminders** - Optional SMS reminder for appointments
✅ **Status lifecycle** - Complete status management (SCHEDULED → CONFIRMED → COMPLETED/CANCELLED)
✅ **Pagination** - Paginated appointment lists
✅ **Authentication** - Automatic bearer token attachment
✅ **Error handling** - Comprehensive error handling

## Support

For issues or questions:
1. Check the Swagger documentation
2. Review network requests in browser DevTools
3. Verify authentication token is valid
4. Contact the backend team for API-related issues