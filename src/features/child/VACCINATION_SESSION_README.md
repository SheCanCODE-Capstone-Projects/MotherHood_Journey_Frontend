# Health Worker Vaccination Session

This feature supports in-person vaccination sessions for health workers. The page at `src/app/(health-worker)/vaccinations/page.tsx` lets staff search a child by health ID or birth certificate number, review today’s due vaccines, and mark doses as administered with a lot number.

## Behavior

- Search is debounced on the client.
- Matching child details and due vaccines are shown in place.
- Administering a dose calls `PUT /api/v1/vaccinations/{id}/administer`.
- After success, the vaccination query cache is invalidated and the page stays ready for the next child.

## Data Types

- `ChildVaccinationSessionRecord`: Due vaccine in the session flow.
- `ChildVaccinationSessionChild`: Child details returned by the search endpoint.
- `ChildVaccinationSessionResponse`: Child plus due vaccines and the matching field.
- `AdministerVaccinationRequest`: Body sent when confirming administration.

## API Endpoints

- `GET /api/v1/children/search?search_term=...`
- `GET /api/v1/children/{childId}/vaccinations`
- `PUT /api/v1/vaccinations/{id}/administer`

## Hooks

- `useVaccinationSessionSearch(searchTerm)` loads the session record for a child.
- `useAdministerVaccination()` confirms administration and invalidates vaccination queries.

## Notes

The implementation keeps the UI modern and resilient with React Query caching, toast feedback, and inline validation for the lot number dialog.
