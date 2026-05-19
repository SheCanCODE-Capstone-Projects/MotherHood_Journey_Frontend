# Mother Registration Feature - Technical Documentation

## Quick Start

Located in: `src/features/maternal/`

### Import the Component
```tsx
import { MotherRegistrationForm } from "@/features/maternal/components";

export default function Page() {
  return <MotherRegistrationForm />;
}
```

## Architecture

### Component Hierarchy
```
MotherRegistrationForm (parent)
├── MotherRegistrationStep1
├── MotherRegistrationStep2
├── MotherRegistrationStep3
└── MotherRegistrationSuccess
```

## Core Files

| File | Purpose | Key Exports |
|------|---------|------------|
| `components/MotherRegistrationForm.tsx` | Main form orchestrator | `MotherRegistrationForm` |
| `components/Step1.tsx` | Personal info input | `MotherRegistrationStep1` |
| `components/Step2.tsx` | Location & education | `MotherRegistrationStep2` |
| `components/Step3.tsx` | Confirmation review | `MotherRegistrationStep3` |
| `components/Success.tsx` | Success screen | `MotherRegistrationSuccess` |
| `schemas/index.ts` | Zod validators | All validation schemas |
| `api/mothers.api.ts` | API calls | `registerMother()`, `getMotherByHealthId()` |
| `hooks/useMother.ts` | React Query hook | `useMother()` |
| `types.ts` | TypeScript types | All type definitions |

## Key Validation Rules

### Step 1
- National ID: `^\d{16}$` (16 digits)
- First/Last Name: 2-50 chars
- DOB: Past date only
- Phone: `^(\+250\|0)[1-9]\d{7,8}$`

### Step 2
- Location: Required, any string
- Education: One of `[primary, secondary, tertiary, none]`

## API Integration

### Endpoint
```
POST /api/v1/mothers
```

### Request
```ts
interface MotherRegistrationRequest extends Mother {
  national_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO date
  phone_number: string;
  home_location: string;
  education_level: string;
}
```

### Response
```ts
interface MotherRegistrationResponse {
  success: boolean;
  data: {
    mother_id: string;
    health_id: string;  // Generate unique ID
    national_id: string;
    first_name: string;
    last_name: string;
    created_at: string;
  };
  message: string;
}
```

## State Flow

```
Step 1 (validation)
    ↓
Step 2 (validation)
    ↓
Step 3 (confirmation)
    ↓
Submit → API Call → Success Screen
    ↑
    └─ Back navigation allowed until submission
```

## Usage in Components

### Using the Hook
```tsx
import { useMother } from "@/features/maternal/hooks/useMother";

function MyComponent() {
  const { mutate, isPending, data, error } = useMother();
  
  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: (response) => {
        console.log("Health ID:", response.data.health_id);
      },
      onError: (error) => {
        console.error("Registration failed:", error.message);
      }
    });
  };
}
```

### Using Validation Schemas
```tsx
import {
  motherRegistrationStepOneSchema,
  motherRegistrationSchema,
  type MotherRegistrationData
} from "@/features/maternal/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<MotherRegistrationData>({
    resolver: zodResolver(motherRegistrationSchema)
  });
}
```

## Styling

All components use **Tailwind CSS** classes:
- Colors: Blue (#3b82f6), Green (#10b981), Red (#ef4444), Gray (#6b7280)
- Responsive: Mobile-first with `w-full max-w-2xl mx-auto`
- Consistent spacing and padding throughout

## Error Handling

### Component-Level Errors
- Displayed inline under each field
- Show Zod validation messages
- Clear on field blur/change

### Form-Level Errors
- Shown in red banner above form
- Network errors: "Network error: ..."
- API errors: Error message from server

### Loading States
- All inputs disabled during submission
- Submit button shows "Submitting..."
- Buttons have loading class styling

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- React 19+
- TypeScript strict mode enabled

## Performance Considerations
- Form validation debounced on blur
- React Query handles request caching
- No unnecessary re-renders with memo where appropriate
- Client-side validation before API call

## Dependencies
```json
{
  "react": "19.2.4",
  "next": "16.2.4",
  "react-hook-form": "^7.72.1",
  "zod": "^4.3.6",
  "@tanstack/react-query": "^5.100.5",
  "@hookform/resolvers": "^5.2.2",
  "lucide-react": "^1.8.0"
}
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Validation not triggering | Use `trigger()` after filling fields |
| Form not submitting | Check network tab, verify API endpoint |
| Health ID not showing | Verify API response structure |
| Step navigation broken | Check form state, clear browser cache |

## Development Checklist

- [ ] Types are properly exported
- [ ] All validation schemas work
- [ ] API endpoint is configured
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] Success feedback shown
- [ ] Mobile responsive tested
- [ ] Accessibility checked (keyboard nav, screen reader)

## Related Features
- Authentication: `src/features/auth/`
- Geo Location: `src/shared/components/forms/GeoLocationSelect.tsx`
- API Client: `src/lib/api/client.ts`
- Types: `src/shared/types/api.ts`

## Monitoring & Analytics

Consider tracking:
- Registration completion rate
- Drop-off points by step
- Common validation errors
- API response times
- Print/copy button usage

---

**Last Updated**: April 28, 2024
**Version**: 1.0
**Status**: Production Ready
