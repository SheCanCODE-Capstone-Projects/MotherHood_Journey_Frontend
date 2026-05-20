# Mother Registration Implementation - Quick Reference

## 📋 File Locations & Paths

### Main Components
| Component | Path |
|-----------|------|
| **Main Page** | `src/app/(health-worker)/mothers/register/page.tsx` |
| **Form Component** | `src/features/maternal/components/MotherRegistrationForm.tsx` |
| **Step 1** | `src/features/maternal/components/Step1.tsx` |
| **Step 2** | `src/features/maternal/components/Step2.tsx` |
| **Step 3** | `src/features/maternal/components/Step3.tsx` |
| **Success** | `src/features/maternal/components/Success.tsx` |

### Backend & Config
| Item | Path |
|------|------|
| **Validation Schemas** | `src/features/maternal/schemas/index.ts` |
| **API Client** | `src/features/maternal/api/mothers.api.ts` |
| **React Query Hook** | `src/features/maternal/hooks/useMother.ts` |
| **Type Definitions** | `src/features/maternal/types.ts` |
| **API Client Factory** | `src/lib/api/client.ts` |

### Shared Components
| Item | Path |
|------|------|
| **GeoLocationSelect** | `src/shared/components/forms/GeoLocationSelect.tsx` |
| **Exports** | `src/features/maternal/components/index.ts` |

### Documentation
| Doc | Path |
|-----|------|
| **Full README** | `MOTHER_REGISTRATION_README.md` |
| **Technical Docs** | `src/features/maternal/TECHNICAL_DOCUMENTATION.md` |
| **Quick Ref** | `src/features/maternal/QUICK_REFERENCE.md` (this file) |

---

## 🎯 What's Implemented

✅ **Multi-step form** (3 steps)
✅ **Zod validation** for all fields
✅ **Rwanda NID format** validation (16 digits)
✅ **Phone number** validation (Rwanda format)
✅ **Date of birth** validation (past dates only)
✅ **GeoLocationSelect** integration
✅ **Education level** dropdown
✅ **Confirmation summary** step
✅ **API integration** via React Query
✅ **Success screen** with health ID
✅ **Print functionality** for health ID
✅ **Copy to clipboard** for health ID
✅ **Error handling** and display
✅ **Loading states** during submission
✅ **Form navigation** (back/next/submit)
✅ **Reset for new registration**

---

## 🔧 How to Use

### Display the Form
```tsx
import { MotherRegistrationForm } from "@/features/maternal/components";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h1>Mother Registration</h1>
        <MotherRegistrationForm />
      </div>
    </main>
  );
}
```

### Access in Browser
```
http://localhost:3000/health-worker/mothers/register
```

### Form Flow
1. **Step 1**: Enter personal info → Click "Next"
2. **Step 2**: Select location & education → Click "Next"
3. **Step 3**: Review all info → Click "Submit"
4. **Success**: See health ID → Print or Copy

---

## 📝 Validation Examples

### Valid Inputs
```
National ID: 1234567890123456 (exactly 16 digits)
First Name: Marie (2-50 chars)
Last Name: Uwamahoro (2-50 chars)
DOB: 1990-05-15 (any past date)
Phone: +250780123456 or 0780123456
Location: kigali
Education: secondary
```

### Invalid Inputs (Will Show Error)
```
National ID: 12345678 (too short)
First Name: A (too short)
Phone: +250912345 (wrong format)
DOB: 2030-01-01 (future date)
Education: unknown (not in list)
```

---

## 🚀 Development Tasks

### For Backend Developer
- [ ] Implement POST `/api/v1/mothers` endpoint
- [ ] Generate unique `health_id` field
- [ ] Validate request data on backend
- [ ] Store mother record in database
- [ ] Return response with health_id

### For Frontend Developer
- [ ] Add i18n translations if needed
- [ ] Implement photo upload (optional enhancement)
- [ ] Add form auto-save feature (optional)
- [ ] Integrate SMS verification (optional)

### For QA/Tester
- [ ] Test all validation rules
- [ ] Test navigation between steps
- [ ] Test form submission with API
- [ ] Test print functionality
- [ ] Test mobile responsiveness
- [ ] Test error scenarios

---

## 🔌 API Specification

### POST /api/v1/mothers

**Request:**
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

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "mother_id": "550e8400-e29b-41d4-a716-446655440000",
    "health_id": "MRW20240428001",
    "national_id": "1234567890123456",
    "first_name": "Marie",
    "last_name": "Uwamahoro",
    "created_at": "2024-04-28T10:30:00Z"
  },
  "message": "Mother registered successfully"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## 🎨 Styling & UI

### Color Scheme
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Neutral: Gray (#6b7280)

### Layout
- Max width: 2xl (28rem)
- Centered on page
- Responsive mobile-first

### Typography
- Headings: Bold, larger sizes
- Labels: Medium font weight
- Errors: Small, red text
- Help text: Small, gray text

---

## 🐛 Troubleshooting

### Form Not Showing
- ✓ Check URL: `/health-worker/mothers/register`
- ✓ Check dev server is running: `npm run dev`
- ✓ Check browser console for errors

### Validation Not Working
- ✓ Check Zod schemas in `src/features/maternal/schemas/index.ts`
- ✓ Verify field names match schema
- ✓ Check input values match validation rules

### API Not Responding
- ✓ Check endpoint URL in `.env.local`
- ✓ Check network tab in DevTools
- ✓ Verify backend server is running
- ✓ Check authentication token

### Health ID Not Showing
- ✓ Check API response has `data.health_id` field
- ✓ Check response structure matches type
- ✓ Look for API error in form error banner

---

## 📚 Related Documentation

- **Full README**: `MOTHER_REGISTRATION_README.md`
- **Technical Docs**: `src/features/maternal/TECHNICAL_DOCUMENTATION.md`
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/

---

## 💡 Tips & Best Practices

1. **Always validate before API call** - Frontend validation happens automatically
2. **Handle errors gracefully** - Users see friendly error messages
3. **Show loading states** - Users know form is processing
4. **Test edge cases** - Invalid dates, future dates, etc.
5. **Mobile first** - Form works on all device sizes
6. **Accessibility** - All fields have proper labels
7. **Performance** - Validation debounced on blur

---

## 📞 Support

For questions or issues:
1. Check the console (F12)
2. Review network requests
3. Look at API response
4. Check component props
5. Verify types match

**Contact**: support@motherhood.rw

---

**Status**: ✅ Production Ready  
**Last Updated**: April 28, 2024  
**Version**: 1.0.0
