# Mother Registration Form - Complete Implementation Guide

## Overview

This is a multi-step form implementation for registering mothers in the maternal health tracking system. The form uses **React Hook Form** for state management, **Zod** for validation, and follows a step-by-step process with final confirmation before submission.

## Features

✅ **Step 1: Personal Information**
- National ID (Rwanda NID format - 16 digits)
- First Name
- Last Name
- Date of Birth
- Phone Number (Rwanda format)

✅ **Step 2: Location and Education**
- Home Location (GeoLocationSelect dropdown)
- Education Level (Primary, Secondary, Tertiary, None)

✅ **Step 3: Confirmation Summary**
- Review all entered information
- Display confirmation before final submission

✅ **Success Screen**
- Display generated Health ID
- Print functionality for facilities with printers
- Copy to clipboard for digital sharing
- Option to register another mother

## Project Structure

```
src/
├── app/
│   └── (health-worker)/
│       └── mothers/
│           └── register/
│               └── page.tsx                 # Main page component
│
├── features/
│   └── maternal/
│       ├── api/
│       │   ├── mothers.api.ts              # API client for mother registration
│       │   ├── pregnancies.api.ts          # (Existing)
│       │   └── visits.api.ts               # (Existing)
│       │
│       ├── components/
│       │   ├── index.ts                    # Barrel export
│       │   ├── MotherRegistrationForm.tsx  # Main form component
│       │   ├── Step1.tsx                   # Personal information step
│       │   ├── Step2.tsx                   # Location and education step
│       │   ├── Step3.tsx                   # Confirmation step
│       │   └── Success.tsx                 # Success screen with health ID
│       │
│       ├── hooks/
│       │   ├── useMother.ts                # React Query hook for registration
│       │   ├── usePregnancy.ts             # (Existing)
│       │   └── useVisits.ts                # (Existing)
│       │
│       ├── schemas/
│       │   └── index.ts                    # Zod validation schemas
│       │
│       └── types.ts                        # TypeScript interfaces
│
├── lib/
│   ├── api/
│   │   └── client.ts                       # API client factory
│   └── i18n/
│       ├── en.json                         # English translations
│       ├── fr.json                         # French translations
│       └── rw.json                         # Kinyarwanda translations
│
└── shared/
    ├── components/
    │   └── forms/
    │       └── GeoLocationSelect.tsx        # Location selector component
    ├── types/
    │   └── api.ts                          # API response types
    └── hooks/
        └── useAuth.ts                      # Authentication hook
```

## File Locations and Details

### 1. **Main Page Component**
- **File**: [src/app/(health-worker)/mothers/register/page.tsx](src/app/(health-worker)/mothers/register/page.tsx)
- **Purpose**: Entry point for the mother registration page
- **Features**: 
  - Header with step indicator
  - Support link to contact support
  - Beautiful gradient background

### 2. **Main Form Component**
- **File**: [src/features/maternal/components/MotherRegistrationForm.tsx](src/features/maternal/components/MotherRegistrationForm.tsx)
- **Purpose**: Manages form state, step navigation, and API submission
- **Key Functions**:
  - `handleNext()`: Validates current step and moves to next
  - `handleBack()`: Goes back to previous step
  - `onSubmit()`: Submits form data to API
  - `handleNewRegistration()`: Resets form for new registration

### 3. **Step 1: Personal Information**
- **File**: [src/features/maternal/components/Step1.tsx](src/features/maternal/components/Step1.tsx)
- **Fields**:
  - National ID: Validated to be exactly 16 digits (Rwanda NID format)
  - First Name: 2-50 characters
  - Last Name: 2-50 characters
  - Date of Birth: Must be in the past
  - Phone Number: Must be valid Rwanda phone format (+250 or 0)

### 4. **Step 2: Location and Education**
- **File**: [src/features/maternal/components/Step2.tsx](src/features/maternal/components/Step2.tsx)
- **Fields**:
  - Home Location: Dropdown with Rwanda provinces
  - Education Level: Dropdown with options (Primary, Secondary, Tertiary, None)

### 5. **Step 3: Confirmation**
- **File**: [src/features/maternal/components/Step3.tsx](src/features/maternal/components/Step3.tsx)
- **Purpose**: Displays all collected information for review
- **Features**:
  - Summary card with all entered data
  - Formatted date display
  - Location and education level labels

### 6. **Success Screen**
- **File**: [src/features/maternal/components/Success.tsx](src/features/maternal/components/Success.tsx)
- **Features**:
  - Green success indicator with checkmark
  - Large display of generated Health ID
  - Print button for facilities with printers
  - Copy to clipboard functionality
  - Ability to register another mother
  - Important information box with tips

### 7. **Validation Schema**
- **File**: [src/features/maternal/schemas/index.ts](src/features/maternal/schemas/index.ts)
- **Schemas**:
  - `motherRegistrationStepOneSchema`: Validates Step 1 fields
  - `motherRegistrationStepTwoSchema`: Validates Step 2 fields
  - `motherRegistrationSchema`: Combined schema for final validation

### 8. **API Integration**
- **File**: [src/features/maternal/api/mothers.api.ts](src/features/maternal/api/mothers.api.ts)
- **Functions**:
  - `registerMother()`: POST request to `/api/v1/mothers`
  - `getMotherByHealthId()`: GET request to `/api/v1/mothers/{healthId}`

### 9. **React Query Hook**
- **File**: [src/features/maternal/hooks/useMother.ts](src/features/maternal/hooks/useMother.ts)
- **Purpose**: Manages API state and mutations
- **Returns**:
  - `mutate`: Function to trigger registration
  - `isPending`: Loading state
  - `data`: Response with health_id
  - `error`: Error information
  - `isSuccess` / `isError`: Status flags

### 10. **Type Definitions**
- **File**: [src/features/maternal/types.ts](src/features/maternal/types.ts)
- **Types**:
  - `Mother`: Mother entity
  - `MotherRegistrationRequest`: Request body
  - `MotherRegistrationResponse`: Response with health_id
  - `MotherFormStepOneData`: Step 1 data
  - `MotherFormStepTwoData`: Step 2 data
  - `MotherFormData`: Combined form data

## Validation Rules

### National ID
- **Format**: Exactly 16 digits
- **Regex**: `/^\d{16}$/`
- **Example**: `1234567890123456`

### Phone Number
- **Format**: Rwanda phone format
- **Regex**: `/^(\+250|0)[1-9]\d{7,8}$/`
- **Examples**: 
  - `+250780123456`
  - `0780123456`

### Date of Birth
- **Constraint**: Must be in the past

### Name Fields
- **Min**: 2 characters
- **Max**: 50 characters

### Education Level
- **Valid Values**: `primary`, `secondary`, `tertiary`, `none`

## API Endpoint

### Register Mother
**Endpoint**: `POST /api/v1/mothers`

**Request Body**:
```json
{
  "national_id": "1234567890123456",
  "first_name": "Marie",
  "last_name": "Uwamahoro",
  "date_of_birth": "1990-05-15",
  "phone_number": "+250780123456",
  "home_location": "kigali",
  "education_level": "secondary"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "mother_id": "uuid-string",
    "health_id": "HID-1234567890",
    "national_id": "1234567890123456",
    "first_name": "Marie",
    "last_name": "Uwamahoro",
    "created_at": "2024-04-28T10:30:00Z"
  },
  "message": "Mother registered successfully"
}
```

## Component Dependencies

```
MotherRegistrationPage
└── MotherRegistrationForm
    ├── Step 1: MotherRegistrationStep1
    ├── Step 2: MotherRegistrationStep2
    │   └── GeoLocationSelect (from shared/components)
    ├── Step 3: MotherRegistrationStep3
    └── Success: MotherRegistrationSuccess
        └── Lucide React Icons (Printer, Copy, CheckCircle)
```

## Tech Stack

- **React**: 19.2.4
- **Next.js**: 16.2.4
- **React Hook Form**: 7.72.1
- **Zod**: 4.3.6
- **React Query**: 5.100.5
- **TypeScript**: Latest
- **Tailwind CSS**: 4.0
- **Lucide React**: 1.8.0 (Icons)

## How It Works

### Step-by-Step Flow

1. **User visits** `/health-worker/mothers/register`
2. **Step 1** - User fills in personal information
   - Form validates using `motherRegistrationStepOneSchema`
   - Click "Next" to proceed to Step 2
3. **Step 2** - User selects location and education level
   - Form validates using `motherRegistrationStepTwoSchema`
   - Click "Next" to proceed to Step 3
4. **Step 3** - User reviews all information
   - All fields are displayed in read-only format
   - Click "Submit" to proceed with registration
5. **API Call** - Form data is sent to `/api/v1/mothers`
   - `useMother` hook manages the request
   - Shows loading state during submission
6. **Success Screen** - Health ID is displayed
   - User can print the Health ID
   - User can copy Health ID to clipboard
   - User can register another mother

### State Management

The form uses React Hook Form with the following states:

```typescript
- currentStep: number (1, 2, or 3)
- submittedHealthId: string | null (health ID after successful registration)
- submittedName: { first: string; last: string } | null
- generalError: string | null (error messages)
- isPending: boolean (from React Query)
```

## Running the Application

### Prerequisites
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Navigate to Mother Registration
```
http://localhost:3000/health-worker/mothers/register
```

### Build for Production
```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication (if using NextAuth)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Error Handling

The form includes comprehensive error handling:

1. **Validation Errors**: Displayed below each field
2. **Network Errors**: Displayed in a banner at the top
3. **API Errors**: Shown as a general error message
4. **Retry Logic**: User can navigate back and fix errors

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper form labels
- ✅ Error messages associated with inputs
- ✅ Keyboard navigation support
- ✅ Clear focus indicators
- ✅ ARIA labels on icons

## Testing Recommendations

### Unit Tests
- Validate each step's form fields
- Test validation schemas
- Test error message display

### Integration Tests
- Test multi-step form navigation
- Test form submission
- Test success screen

### E2E Tests
- Complete registration flow
- Error scenarios
- Print functionality

## Future Enhancements

- [ ] Internationalization (i18n) for form labels and messages
- [ ] Photo upload for mother profile
- [ ] Document verification
- [ ] Bulk import via CSV
- [ ] Form auto-save to prevent data loss
- [ ] Integration with SMS verification
- [ ] QR code generation for Health ID

## Troubleshooting

### Form not submitting
- Check if API endpoint is reachable
- Verify authentication token is valid
- Check browser console for errors

### Validation errors not clearing
- Click outside the field to trigger re-validation
- Use the Back button to reset the step

### Health ID not displaying
- Check API response includes `health_id` field
- Verify response structure matches `MotherRegistrationResponse` type

## Support

For issues or questions:
1. Check the console for error messages
2. Review API response structure
3. Verify environment variables are set
4. Contact: support@motherhood.rw

## Files Modified/Created

### Created Files:
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth route handler

### Modified Files:
- `src/features/maternal/components/Step2.tsx` - Fixed HomeLocationContext error
- All other files were already properly implemented

## License

This project is part of the MotherHood Journey system and follows the organization's licensing terms.
