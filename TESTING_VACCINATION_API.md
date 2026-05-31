# Testing the Vaccination API Integration

## Quick Start Testing Guide

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### 2. Access the Vaccination Session Page

Navigate to: `http://localhost:3000/health-worker/vaccinations`

**Note:** You must be logged in as a health worker to access this page.

### 3. Test Vaccination Search

**Step-by-step:**

1. **Enter a search term** in the search box:
   - Child health ID (e.g., `CHILD-001`)
   - Birth certificate number (e.g., `BC-2025-001`)

2. **Watch the search process:**
   - The system will show "Searching for the child record..."
   - After 300ms debounce, it sends the API request

3. **Expected Results:**
   - ✅ **Success:** Child's vaccination session loads with:
     - Child information (name, age, mother's name)
     - Health ID and birth certificate number
     - Date of birth and facility
     - List of due vaccines for today
   
   - ❌ **Not Found (404):** Shows "No child record matched this search"
   
   - ❌ **Other Errors:** Shows error message in red box

### 4. Test Administer Vaccination

**Step-by-step:**

1. **Find a child** with due vaccines (status: PENDING, DUE, or OVERDUE)

2. **Click "Mark administered"** button next to a vaccine

3. **Enter lot number** in the dialog:
   - Example: `VAX-LOT-2025-001`
   - Lot number is required for audit trail

4. **Click "Confirm administration"** or press Enter

5. **Expected Results:**
   - ✅ **Success:** 
     - Shows success toast: "[Vaccine Name] marked as administered."
     - Vaccine status changes to "Administered" with green checkmark
     - Button changes to "Administered" badge
   
   - ❌ **Error:** Shows error toast with message

### 5. Test Child Registration (Optional)

**Step-by-step:**

1. Navigate to: `http://localhost:3000/children/register`

2. **Search for a mother:**
   - Enter mother's health ID or name
   - Select from search results

3. **Fill in child details:**
   - First name
   - Gender
   - Date of birth
   - Birth weight (kg)
   - Delivery type
   - Birth certificate number (optional)

4. **Submit the form**

5. **Expected Results:**
   - ✅ **Success:** 
     - Shows confirmation with child details
     - Displays vaccination schedule with due dates
     - Provides option to view child record
   
   - ❌ **Error:** Shows error message

## Testing Checklist

### Basic Functionality
- [ ] Can access vaccination session page
- [ ] Search box accepts input
- [ ] Search triggers API call after debounce
- [ ] Loading state shows while fetching
- [ ] Success: Child data displays correctly
- [ ] Error: Error messages display properly
- [ ] Not Found: 404 message displays correctly

### Vaccination Administration
- [ ] "Mark administered" button appears for pending vaccines
- [ ] Dialog opens when clicking button
- [ ] Lot number input accepts text
- [ ] Confirm button is disabled when lot number is empty
- [ ] Confirm button is enabled when lot number is entered
- [ ] Success: Toast notification appears
- [ ] Success: Vaccine status updates to "Administered"
- [ ] Error: Error toast appears with message

### Child Registration
- [ ] Can access registration page
- [ ] Mother search works
- [ ] Form validates required fields
- [ ] Submit creates child record
- [ ] Success: Shows confirmation with vaccination schedule
- [ ] Error: Shows error message

## API Endpoints Being Tested

### 1. Search Child Vaccination Session
```
GET /api/v1/children/search?search_term={healthIdOrBirthCert}
```

**Expected Response:**
```json
{
  "child": {
    "id": "string",
    "fullName": "string",
    "healthId": "string",
    "birthCertificateNo": "string",
    "dateOfBirth": "2025-01-15",
    "ageInYears": 0,
    "ageInMonths": 4,
    "motherName": "string",
    "facilityName": "string"
  },
  "dueVaccines": [
    {
      "id": "string",
      "vaccineName": "BCG",
      "doseLabel": "Dose 1",
      "status": "PENDING",
      "dueDate": "2025-01-15",
      "administeredDate": null,
      "note": null
    }
  ],
  "searchedBy": "healthId"
}
```

### 2. Administer Vaccination
```
PUT /api/v1/vaccinations/{vaccinationId}/administer
```

**Request Body:**
```json
{
  "lotNumber": "VAX-LOT-2025-001"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Vaccination administered successfully"
}
```

### 3. Register Child
```
POST /api/v1/children
```

**Request Body:**
```json
{
  "mother_health_id": "MTH-001",
  "first_name": "Baby",
  "gender": "MALE",
  "date_of_birth": "2025-01-15",
  "birth_weight": 3.2,
  "delivery_type": "NORMAL",
  "birth_certificate_number": "BC-2025-001"
}
```

**Expected Response:**
```json
{
  "child": {
    "id": "string",
    "mother_id": "MTH-001",
    "first_name": "Baby",
    "gender": "MALE",
    "date_of_birth": "2025-01-15",
    "birth_weight": 3.2,
    "delivery_type": "NORMAL",
    "birth_certificate_number": "BC-2025-001",
    "created_at": "2025-01-28T14:30:00Z"
  },
  "vaccination_schedule": [
    {
      "id": "string",
      "vaccine_name": "BCG",
      "due_date": "2025-01-15",
      "status": "pending"
    }
  ]
}
```

## Debugging Tips

### 1. Check Network Requests
Open browser DevTools (F12) → Network tab → Look for:
- `search` requests to `/api/v1/children/search`
- `administer` requests to `/api/v1/vaccinations/{id}/administer`
- `children` POST requests for registration

### 2. Check Request Headers
Verify that requests include:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### 3. Check Console Logs
Look for error messages in the browser console.

### 4. Verify Environment Configuration
Check that `.env.local` contains:
```env
NEXT_PUBLIC_API_URL=https://motherhoodjourneybackend-production.up.railway.app
```

### 5. Verify Authentication
Make sure you're logged in. Check:
- `localStorage.getItem('auth_token')` returns a token
- Or check Zustand auth store: `useAuth.getState().currentUser`

## Common Issues and Solutions

### Issue: "NEXT_PUBLIC_API_URL is not configured"
**Solution:** Create `.env.local` file with the API URL.

### Issue: "Network error" or "Failed to fetch"
**Solution:**
1. Verify backend is running at the configured URL
2. Check CORS configuration on backend
3. Ensure internet connection is stable

### Issue: "401 Unauthorized"
**Solution:**
1. Log in to the application
2. Check if token is expired
3. Try logging out and back in

### Issue: "403 Forbidden"
**Solution:**
1. Verify user has health worker role
2. Check user permissions in backend

### Issue: "404 Not Found" when searching
**Solution:**
1. Verify child exists in the system
2. Check if health ID or birth certificate number is correct
3. Try registering a child first

### Issue: Vaccines not showing as "due today"
**Solution:**
1. Check child's age and vaccine due dates
2. Verify backend calculates due dates correctly
3. Check if vaccines are already administered

## Testing with Real Data

### Option 1: Use Existing Test Data
If the backend has test data, ask the backend team for:
- Sample child health IDs
- Sample birth certificate numbers
- Sample mother health IDs

### Option 2: Create Test Data
1. Register a new mother (if endpoint available)
2. Register a child linked to that mother
3. The system will generate a vaccination schedule
4. Use the child's health ID to test vaccination session

### Option 3: Use Swagger UI
Visit the Swagger UI to test endpoints directly:
https://motherhoodjourneybackend-production.up.railway.app/swagger-ui/index.html

## Reporting Issues

When reporting bugs, include:
1. **Steps to reproduce** the issue
2. **Expected behavior** vs **actual behavior**
3. **Screenshots** of the error
4. **Network request/response** from DevTools
5. **Console errors** if any
6. **Environment details** (browser, OS, etc.)

## Success Criteria

✅ All vaccination endpoints respond correctly
✅ Data displays accurately in the UI
✅ Lot number tracking works for audit trail
✅ Error handling provides clear messages
✅ Authentication is properly enforced
✅ No console errors during normal operation
✅ Loading states and error states display correctly

## Next Steps After Testing

1. **If tests pass:** The integration is complete and ready for production
2. **If tests fail:** Report issues to the development team with detailed information
3. **For production deployment:** Update `.env.local` with production API URL

## Contact for Support

- **Backend API Issues:** Contact backend team
- **Frontend Issues:** Check React Query cache and API client configuration
- **Authentication Issues:** Check NextAuth configuration and token storage