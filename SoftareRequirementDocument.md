# Software Requirements Document (SRD)
## MotherHood Journey — Digital Maternal & Child Health Platform

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Stakeholders & User Roles](#3-stakeholders--user-roles)
4. [Functional Requirements](#4-functional-requirements)
   - 4.1 Authentication & Authorization
   - 4.2 Mother Registration & NIDA Verification
   - 4.3 Pregnancy Management
   - 4.4 Child Registration & Health Tracking
   - 4.5 Vaccination Management
   - 4.6 Clinical Visits & Diagnoses
   - 4.7 Appointment Scheduling
   - 4.8 Consent Management
   - 4.9 Government Service Requests
   - 4.10 Facility Administration
   - 4.11 Government & Reporting Portal
   - 4.12 SMS Notifications
5. [Non-Functional Requirements](#5-non-functional-requirements)
   - 5.1 Performance
   - 5.2 Security & Compliance
   - 5.3 Availability & Reliability
   - 5.4 Scalability
   - 5.5 Usability & Accessibility
   - 5.6 Maintainability
   - 5.7 Internationalisation
6. [System Constraints](#6-system-constraints)
7. [External Integrations](#7-external-integrations)
8. [Data Requirements](#8-data-requirements)
9. [Glossary](#9-glossary)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Document (SRD) defines the complete functional and non-functional requirements for **MotherHood Journey**, a digital health platform designed to replace paper-based maternal and child health records across Rwanda's public health system. It serves as the authoritative reference for all nine engineers on the development team, product stakeholders, and government integration partners.

### 1.2 Scope

MotherHood Journey covers the full continuum of maternal and child health services — from a mother's first antenatal registration, through pregnancy tracking, newborn registration, vaccination scheduling, clinical visits, and government document requests. The system connects to four Rwandan government systems (NIDA, MoH HMIS, Irembo, and RURA/Africa's Talking) and is operated by six categories of users across health centres, district offices, and national government agencies.

### 1.3 Background & Problem Statement

Rwanda's maternal and child health system currently relies heavily on paper records. This creates critical gaps:

- Patient records are lost when mothers transfer between facilities.
- Vaccination schedules are tracked manually, leading to missed doses and outbreaks.
- Government reporting requires manual data aggregation, introducing delays and errors.
- Community health workers (CHWs) have no digital tool for follow-up reminders.
- There is no interoperability between health facilities, district offices, and the Ministry of Health.

MotherHood Journey addresses each of these gaps with a unified digital platform.

### 1.4 Development Context

- **Team:** 9 engineers — 5 Backend (Spring Boot / Java 21), 4 Frontend (Next.js 14 / TypeScript)
- **Timeline:** 5 sprints × 2 weeks = 10 weeks
- **Backend stack:** Spring Boot, PostgreSQL 15, Redis, Flyway, MapStruct, Africa's Talking API
- **Frontend stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, React Query, Zustand
- **Deployment:** Docker on Railway (backend), Vercel (frontend), GitHub Actions CI/CD

---

## 2. System Overview

### 2.1 High-Level Architecture

MotherHood Journey is a multi-tenant, role-based web application with a clear separation between:

- A **Spring Boot REST API** (multi-module Maven project) serving all data operations
- A **Next.js frontend** with six role-specific portal routes
- A **PostgreSQL database** with 16 tables across 10 logical groups, all managed by Flyway migrations
- A **government integration layer** using the outbox pattern (via `gov_sync_log`) for resilient, at-least-once delivery to NIDA, MoH HMIS, Irembo, and RURA
- An **SMS notification engine** using Africa's Talking for vaccination reminders, appointment alerts, and service status updates

### 2.2 Multi-Tenancy Model

Every patient data table carries a `facility_id` foreign key as the primary tenancy boundary. A single PostgreSQL instance serves the entire network of health centres while keeping each facility's data strictly isolated. Access beyond a single facility requires elevated roles (DISTRICT_OFFICER, GOVERNMENT_ANALYST, or MOH_ADMIN) with explicit geographic scope assignments.

### 2.3 Geo-Identity Model

Rwanda's five-level administrative hierarchy — **Province → District → Sector → Cell → Village** — is seeded once into the `geo_locations` table and referenced by every entity in the system. This single table drives:

- RBAC scoping for district officers (sector-level boundaries)
- CHW assignment (cell-level)
- Government report aggregation (any level, one JOIN)
- NIDA identity cross-checking (village-level cross-reference)

---

## 3. Stakeholders & User Roles

The system defines six roles, each with a dedicated portal and permission matrix.

| Role ID | Role Name | Portal Route | Description |
|---|---|---|---|
| PATIENT | Patient / Mother | `/(patient)/` | Registered mother; views her own pregnancy, children, vaccinations, and appointments. Can submit service requests and manage consent. |
| HEALTH_WORKER | Health Worker / CHW | `/(health-worker)/` | Registers mothers and children, records visits, administers vaccines, schedules appointments. Scoped to their assigned facility. |
| FACILITY_ADMIN | Facility Administrator | `/(facility-admin)/` | Manages all records at one facility. Views KPI dashboard, approves/rejects service requests, manages staff accounts. |
| DISTRICT_OFFICER | District Officer | `/(district-officer)/` | Government employee with read access to aggregated and individual data within their authorised sectors (scoped_geo_ids). |
| GOVERNMENT_ANALYST | Government Analyst | `/(government)/` | Ministry analyst who generates statistical reports and views aggregated data at district or national level. Cannot see individual patient records. |
| MOH_ADMIN | Ministry of Health Admin | `/(government)/` | Highest privilege government user. Manages government user accounts, pushes reports to MoH HMIS, monitors and retries failed government sync operations. |

---

## 4. Functional Requirements

Each requirement is identified by a unique ID. Priority levels are: **P1** (must-have), **P2** (should-have), **P3** (nice-to-have).

---

### 4.1 Authentication & Authorization

#### FR-AUTH-01 — User Login
**Priority:** P1  
The system shall allow all six user roles to authenticate via a phone number and password. On successful authentication, the system shall issue a JWT access token (15-minute TTL) and a JWT refresh token (7-day TTL). The access token shall embed the user's role, `facilityId`, and `geoScopeIds` as claims.

#### FR-AUTH-02 — Token Refresh
**Priority:** P1  
The system shall provide a token refresh endpoint. A valid refresh token shall produce a new access token without requiring the user to re-enter credentials.

#### FR-AUTH-03 — Role-Based Route Guard
**Priority:** P1  
The frontend middleware shall intercept every request to a protected route and redirect unauthenticated users to `/login` (with a `callbackUrl` parameter) and authenticated users whose role does not match the route group to `/unauthorized`.

#### FR-AUTH-04 — Session Persistence
**Priority:** P1  
The frontend shall store the role, facilityId, geoScopeIds, canExport, and canPushHmis flags from the API token response in the NextAuth session. These values shall be available client-side via the `useRole()` hook and server-side via `getToken()`.

#### FR-AUTH-05 — Audit Logging for Auth Events
**Priority:** P1  
Every login, logout, and failed login attempt shall be written to the `audit_log` table with the user ID, action type, IP address, user agent, and a `success` boolean flag.

---

### 4.2 Mother Registration & NIDA Verification

#### FR-MOM-01 — Register a New Mother
**Priority:** P1  
A HEALTH_WORKER shall be able to register a new mother by providing: Rwanda National ID (16-digit), first name, last name, date of birth, phone number, home location (5-level geo selection), and education level. The system shall validate that no existing mother record carries the same national ID.

#### FR-MOM-02 — Auto-Generate Health ID
**Priority:** P1  
Upon successful registration, the system shall generate a unique, human-readable health ID in the format `MH-YYYY-XXXXXX` (e.g. `MH-2026-004821`). This ID is the primary shareable identifier for facilities without barcode scanners.

#### FR-MOM-03 — Async NIDA Identity Verification
**Priority:** P1  
The registration endpoint shall return immediately with the generated health ID. In the background, the system shall call the NIDA e-indangamuntu API using the submitted national ID. The NIDA response shall set the mother's `nida_verified_status` to one of: `PENDING`, `VERIFIED`, `FAILED`, or `MANUAL`. The `geo_location_id` shall be updated from the NIDA village-level response on a VERIFIED result.

#### FR-MOM-04 — Mother Search
**Priority:** P1  
A HEALTH_WORKER or FACILITY_ADMIN shall be able to search for mothers by health ID, full name, or national ID. Results shall be paginated and display the health ID, name, NIDA status badge, facility, registration date, and current pregnancy status.

#### FR-MOM-05 — Mother Profile View
**Priority:** P1  
The mother profile page shall display personal details, geo location (village through province), NIDA verification status, assigned CHW name and phone number, and a full obstetric history (all pregnancies as timeline cards). Facility scope shall be enforced: a HEALTH_WORKER at facility A cannot retrieve a mother registered at facility B.

#### FR-MOM-06 — Facility Scope Enforcement
**Priority:** P1  
All `GET /api/v1/mothers/{id}` requests shall verify that the requesting user's `facilityId` (from the JWT) matches the mother's `facility_id`. FACILITY_ADMIN sees all mothers in their facility. DISTRICT_OFFICER sees mothers in their authorised sectors.

---

### 4.3 Pregnancy Management

#### FR-PREG-01 — Open a Pregnancy
**Priority:** P1  
A HEALTH_WORKER shall be able to open a new pregnancy for a registered mother. Required fields: LMP date, gravida number, para number. The system shall compute the Estimated Due Date (EDD) as LMP + 280 days. The system shall reject opening a new pregnancy if the mother already has an `ACTIVE` pregnancy.

#### FR-PREG-02 — Assign a CHW
**Priority:** P1  
A HEALTH_WORKER or FACILITY_ADMIN shall be able to assign a Community Health Worker to a pregnancy. The assigned CHW's contact details shall be visible to the patient on her dashboard.

#### FR-PREG-03 — Close a Pregnancy
**Priority:** P1  
A HEALTH_WORKER shall be able to close an active pregnancy with an outcome status of `DELIVERED`, `LOST`, or `TRANSFERRED`, along with free-text outcome notes. The pregnancy status shall transition accordingly and the record shall become part of the obstetric history.

#### FR-PREG-04 — Obstetric History
**Priority:** P1  
The system shall preserve the full history of all pregnancies per mother. Each pregnancy record shall be accessible via `GET /api/v1/mothers/{id}/pregnancies` and displayed on the mother profile page as a chronological timeline.

#### FR-PREG-05 — Patient Pregnancy Dashboard
**Priority:** P1  
The patient portal shall show an active pregnancy card with an EDD countdown in days, a trimester indicator (1st / 2nd / 3rd), and the assigned CHW's contact card.

---

### 4.4 Child Registration & Health Tracking

#### FR-CHILD-01 — Register a Newborn
**Priority:** P1  
A HEALTH_WORKER shall be able to register a newborn by linking to the mother's record via health ID search. Required fields: child first name, gender, date of birth, birth weight (kg), delivery type (`NORMAL`, `CAESAREAN`, `ASSISTED`), and birth certificate number (optional, unique if provided).

#### FR-CHILD-02 — Auto-Create Vaccination Schedule
**Priority:** P1  
Immediately upon registering a child, the system shall automatically create one `vaccination_record` row per active entry in the `vaccination_schedules` seed table. Each record's `due_date` shall be computed as `child.dateOfBirth + schedule.due_age_days`. No manual entry shall be required.

#### FR-CHILD-03 — Child Profile View
**Priority:** P1  
The child profile page shall display a health status badge (`HEALTHY` / `AT_RISK` / `CRITICAL`), birth details, delivery type, birth weight, and a link to the mother's profile. Below the header, the full vaccination schedule table shall be shown.

#### FR-CHILD-04 — Health Status Update
**Priority:** P2  
A HEALTH_WORKER shall be able to update a child's `health_status` to `AT_RISK` or `CRITICAL` based on clinical findings. This status is displayed on the child profile and the patient's dashboard children list.

---

### 4.5 Vaccination Management

#### FR-VAC-01 — Vaccination Schedule Table
**Priority:** P1  
The vaccination schedule table shall display columns: Vaccine Name, Antigen Code, Due Date, Window (days), Status, Administered Date, and Lot Number. Rows shall be colour-coded: gray = PENDING, green = ADMINISTERED, amber = MISSED, red = OVERDUE.

#### FR-VAC-02 — Mark Vaccination as Administered
**Priority:** P1  
A HEALTH_WORKER shall be able to mark a vaccination record as `ADMINISTERED` by selecting the record and entering the vaccine lot number. The system shall record the `administered_date`, `lot_number`, and `administered_by` (the health worker's user ID).

#### FR-VAC-03 — Overdue Vaccination Detection
**Priority:** P1  
A nightly scheduled job (running at 01:00 Africa/Kigali) shall scan all `PENDING` vaccination records where `due_date + window_days < today`. Each such record shall have its status flipped to `OVERDUE`. Each status flip shall enqueue an SMS reminder to the mother.

#### FR-VAC-04 — Patient Vaccination Card (Mobile-First)
**Priority:** P1  
The patient-facing vaccination card shall be designed for mobile devices with large text, high contrast, and a printable layout. A progress indicator shall show "X of Y vaccines completed". Overdue vaccines shall be highlighted with a red banner and a note to contact the CHW. The page shall be functional offline (service worker caches the last-fetched data for 24 hours).

#### FR-VAC-05 — Vaccination Session Page
**Priority:** P1  
A dedicated health worker page shall support vaccination sessions. A search input shall accept a child's health ID or birth certificate number. On match, the child's name, age, and today's due vaccines shall be displayed. The page shall remain open after each administration to facilitate batch sessions.

---

### 4.6 Clinical Visits & Diagnoses

#### FR-VISIT-01 — Record a Clinical Visit
**Priority:** P1  
A HEALTH_WORKER shall be able to record a clinical visit for either a mother or a child (polymorphic). A visit shall capture: patient type and ID, visit type (`ANC`, `PNC`, `IMMUNIZATION`, `SICK_CHILD`, `GROWTH_MONITORING`), and vitals including weight (kg), height (cm), systolic and diastolic blood pressure, and MUAC (mid-upper arm circumference, cm).

#### FR-VISIT-02 — ICD-10 Diagnosis Entry
**Priority:** P1  
A health worker shall be able to add one or more diagnoses per visit using a searchable ICD-10 code dropdown (sourced from the MoH-approved subset). Exactly one diagnosis shall be flagged as primary (`is_primary = true`). Severity (`MILD`, `MODERATE`, `SEVERE`) shall be selectable per diagnosis.

#### FR-VISIT-03 — Prescription Entry
**Priority:** P1  
A health worker shall be able to add one or more prescriptions per visit. Each prescription shall capture: medication name, dosage, frequency, duration in days, and optional instructions. The `duration_days` field is stored for future use in medication adherence SMS scheduling.

#### FR-VISIT-04 — Visit History
**Priority:** P2  
All visits for a mother or child shall be retrievable and displayed chronologically on the respective profile page, with visit type, date, primary diagnosis, and the recording health worker's name.

---

### 4.7 Appointment Scheduling

#### FR-APPT-01 — Schedule an Appointment
**Priority:** P1  
A HEALTH_WORKER shall be able to schedule an appointment for a mother or child by selecting: patient (via health ID search), appointment type (`ANC`, `PNC`, `VACCINATION`, `GROWTH_CHECK`, `FOLLOW_UP`), date and time (with greyed-out fully-booked slots shown), and an optional note. The facility is auto-filled from the health worker's JWT.

#### FR-APPT-02 — Appointment Status Lifecycle
**Priority:** P1  
Appointments shall follow the status lifecycle: `SCHEDULED → COMPLETED | NO_SHOW | CANCELLED`. Health workers shall update the status after each appointment time passes. Cancellation shall record a reason.

#### FR-APPT-03 — Automated Appointment Reminder SMS
**Priority:** P1  
A daily scheduled job (08:00 Africa/Kigali) shall query appointments occurring within the next 23–25 hours where `reminder_sent = false`. For each, an SMS shall be enqueued in the patient's preferred language (Kinyarwanda, English, or French) containing the date, time, facility name, and appointment type. The `reminder_sent` flag shall be set to `true` to prevent duplicate messages.

#### FR-APPT-04 — Patient Appointment List
**Priority:** P1  
The patient portal shall list all appointments chronologically. Future appointments shall show a blue `SCHEDULED` badge and a cancel button (with confirmation dialog). Past appointments shall show the outcome status badge. A floating action button shall link to the service request form.

#### FR-APPT-05 — Facility Appointment Calendar
**Priority:** P1  
A FACILITY_ADMIN shall have access to a week-view calendar grid (07:00–18:00 Rwanda time). Each appointment shall appear as a colour-coded block by appointment type. A capacity bar below the calendar shall show booked vs available slots per day.

---

### 4.8 Consent Management

#### FR-CONSENT-01 — Record Consent
**Priority:** P1  
The system shall support four consent types: `GOV_DATA_SHARE`, `SMS_REMINDERS`, `RESEARCH`, and `FACILITY_TRANSFER`. A patient or CHW shall be able to grant or revoke consent for any type via the consent management page.

#### FR-CONSENT-02 — Consent Gate for Government Data
**Priority:** P1  
Before any mother's data is shared with a government system (NIDA lookup results written back, HMIS push, DISTRICT_OFFICER query), the system shall call `ConsentService.hasActiveConsent(motherId, GOV_DATA_SHARE)`. If no active, non-revoked, non-expired consent exists, the operation shall be blocked.

#### FR-CONSENT-03 — Consent Revocation Warning
**Priority:** P1  
Revoking a `GOV_DATA_SHARE` consent shall trigger a confirmation warning dialog informing the patient of the implications before proceeding.

#### FR-CONSENT-04 — Consent Audit Trail
**Priority:** P1  
Every consent grant, update, and revocation shall be persisted in the `consent_records` table with the timestamp, granting role, legal basis (Rwanda Law No. 058/2021), and, where applicable, an expiry date.

---

### 4.9 Government Service Requests

#### FR-SR-01 — Submit a Service Request
**Priority:** P1  
A patient or CHW shall be able to submit a government service request for the following types: `BIRTH_CERT`, `VACCINATION_CARD`, `REFERRAL`, `HEALTH_SUMMARY`, `REPRINT`. Supporting documents (`ID_COPY`, `BIRTH_PROOF`, `FACILITY_LETTER`) shall be uploadable with file type and size validation.

#### FR-SR-02 — Reference Number Generation
**Priority:** P1  
On submission, the system shall generate a unique reference number in the format `SR-YYYY-NNNNN` (e.g. `SR-2026-00042`). This reference number shall be displayed prominently to the patient on the success screen with instructions to track status.

#### FR-SR-03 — Facility Admin Review Queue
**Priority:** P1  
FACILITY_ADMIN users shall have access to a filterable table of all service requests for their facility. For each `PENDING` request, the admin shall be able to: review full request details and document previews in a side panel, approve the request, reject it with a written reason, or escalate it to a DISTRICT_OFFICER.

#### FR-SR-04 — Document Integrity Verification
**Priority:** P1  
Each uploaded document shall have its SHA-256 hash computed and stored in `service_request_docs.file_hash`. On any retrieval, the hash shall be recomputed and compared to detect tampering.

#### FR-SR-05 — Status Tracker Component
**Priority:** P1  
The patient's documents page shall display a horizontal stepper component showing the full service request lifecycle: `PENDING → UNDER_REVIEW → APPROVED → IREMBO_SUBMITTED → COMPLETED`. For `REJECTED` status, the rejection reason shall appear in a red callout below the tracker.

#### FR-SR-06 — Irembo Submission via Outbox
**Priority:** P1  
When a service request is approved and eligible for Irembo submission, the system shall create a `gov_sync_log` entry and allow the background `GovSyncService` to execute the API call asynchronously. The resulting `irembo_ticket_id` shall be stored on the service request.

---

### 4.10 Facility Administration

#### FR-FAC-01 — KPI Dashboard
**Priority:** P1  
The facility admin dashboard shall display four real-time stat cards: ANC attendance rate, vaccination coverage %, no-show rate, and service request backlog — all sourced from `GET /api/v1/facilities/{id}/stats`. A line chart shall show ANC attendance over the last 12 months. A bar chart shall show vaccination coverage by vaccine type. Data shall auto-refresh every 5 minutes.

#### FR-FAC-02 — Staff Management
**Priority:** P1  
A FACILITY_ADMIN shall be able to view all HEALTH_WORKER accounts at their facility (name, phone, national ID, account status, last login). They shall be able to activate and deactivate staff accounts. Deactivated staff immediately lose API access.

#### FR-FAC-03 — Facility Stats Aggregation
**Priority:** P1  
The `/api/v1/facilities/{id}/stats` endpoint shall compute the following using JPQL aggregate queries scoped to `facility_id`: ANC attendance rate (visits this month / expected based on active pregnancies), vaccination coverage % (ADMINISTERED / total records for children at this facility), no-show rate (NO_SHOW / total SCHEDULED in the last 30 days), and service request backlog (count of PENDING + UNDER_REVIEW requests).

---

### 4.11 Government & Reporting Portal

#### FR-GOV-01 — National Choropleth Map Dashboard
**Priority:** P1  
The government portal home page shall display a custom SVG choropleth map of Rwanda's five provinces. Provinces shall be colour-filled by the selected metric (vaccination coverage, ANC attendance, or birth registration rate). Clicking a province shall drill down to district-level data. A legend bar shall show the colour scale.

#### FR-GOV-02 — Report Generation
**Priority:** P1  
A GOVERNMENT_ANALYST or MOH_ADMIN shall be able to generate a statistical report by selecting: report type (`VACCINATION_COVERAGE`, `ANC_ATTENDANCE`, `BIRTH_REGISTRATION`, `MATERNAL_HEALTH`), period (month, quarter, or year), and scope level (`NATIONAL`, `PROVINCE`, `DISTRICT`, `SECTOR`). Reports shall contain only aggregated statistics — no individual patient data.

#### FR-GOV-03 — Push Report to MoH HMIS
**Priority:** P1  
A MOH_ADMIN shall be able to push a generated report to the MoH HMIS in DHIS2-compatible format. The push shall be executed via the outbox pattern: a `gov_sync_log` entry is created and the `GovSyncService` background job executes the HTTP call. The report's `hmis_push_status` shall update to `QUEUED`, `PUSHED`, or `FAILED`.

#### FR-GOV-04 — Geo-Scoped Data for District Officers
**Priority:** P1  
A DISTRICT_OFFICER shall see a summary table of all facilities within their authorised sectors, showing per-facility KPIs (ANC rate, vaccination coverage, no-show rate). The system shall enforce sector-scope by checking that the requested `geo_location_id` is in the officer's `scoped_geo_ids` array via `RbacUtils.canAccessGeo()`.

#### FR-GOV-05 — Government User Management
**Priority:** P1  
A MOH_ADMIN shall be able to manage government user accounts. For DISTRICT_OFFICER accounts, the admin shall be able to assign/remove sectors from `scoped_geo_ids` via a multi-select geo picker. Toggles shall control `can_export` and `can_push_hmis` permissions.

#### FR-GOV-06 — Gov Sync Log Monitoring
**Priority:** P1  
The government portal shall display a filterable table of all `gov_sync_log` entries (by status and target system). DEAD_LETTER entries shall be highlighted in red. A MOH_ADMIN shall be able to manually retry a DEAD_LETTER entry via `POST /api/v1/gov-sync-log/{id}/retry`. The table shall auto-refresh every 30 seconds.

#### FR-GOV-07 — DEAD_LETTER Admin Alert
**Priority:** P1  
When a `gov_sync_log` entry reaches 5 failed retries and transitions to `DEAD_LETTER` status, the system shall automatically enqueue an SMS alert to all MOH_ADMIN users, including the sync type, target system, and reference number of the failed request.

---

### 4.12 SMS Notifications

#### FR-SMS-01 — SMS Outbox Pattern
**Priority:** P1  
All SMS messages shall be created as `QUEUED` rows in the `sms_notifications` table before any API call is made to Africa's Talking. This decouples SMS sending from the user-facing request and ensures messages are never lost on API failure.

#### FR-SMS-02 — SMS Dispatch Cron
**Priority:** P1  
A scheduled job shall run every 5 minutes, scanning `QUEUED` SMS rows where `scheduled_at <= now()`. For each, it shall call the Africa's Talking REST API and store the returned `at_message_id`. On success, status becomes `SENT`. On failure, `retry_count` is incremented (maximum 3 retries).

#### FR-SMS-03 — Delivery Status Webhook
**Priority:** P1  
The system shall expose a public webhook endpoint `POST /webhooks/at/delivery` to receive delivery status callbacks from Africa's Talking. The endpoint shall validate an HMAC-SHA256 signature using the AT API key. On a valid callback, the matching `sms_notification` row shall be updated to `DELIVERED` or `FAILED`.

#### FR-SMS-04 — Notification Types
**Priority:** P1  
The system shall support the following SMS notification types: `VACCINATION_REMINDER`, `APPOINTMENT` (reminder 24 hours prior), `HEALTH_TIP`, `SERVICE_STATUS` (on each service request status transition), and `EMERGENCY` (admin alerts for DEAD_LETTER events).

#### FR-SMS-05 — Multilingual SMS
**Priority:** P1  
All SMS messages sent to patients shall be delivered in the patient's `preferred_language` (Kinyarwanda `rw`, English `en`, or French `fr`) as stored on the `users` table.

---

## 5. Non-Functional Requirements

### 5.1 Performance

#### NFR-PERF-01 — API Response Time
The API shall respond to 95% of requests in under **500 milliseconds** under normal load (up to 100 concurrent users per facility). This applies to all read endpoints including mother profile, vaccination schedule, and facility stats.

#### NFR-PERF-02 — Database Query Optimisation
All frequently queried columns shall have database indexes as defined in the schema — including `idx_mother_health_id`, `idx_mother_facility`, `idx_pregnancy_status`, `idx_vaccination_child`, and `idx_appointments_facility`. Aggregate queries for the KPI dashboard shall use pre-defined JPQL aggregations scoped to `facility_id`.

#### NFR-PERF-03 — Analytics Read Replica
Analytics and HMIS export queries shall execute against a dedicated read replica to avoid impacting write throughput on the primary database.

#### NFR-PERF-04 — SMS Throughput
The SMS dispatch cron shall be capable of processing at least 500 queued messages per cron cycle (every 5 minutes) without breaching Africa's Talking API rate limits.

#### NFR-PERF-05 — Frontend Loading
The Next.js frontend shall achieve a Largest Contentful Paint (LCP) of under **2.5 seconds** on a 4G mobile connection. Skeleton loading states shall be displayed for all data-fetched sections to prevent layout shifts.

---

### 5.2 Security & Compliance

#### NFR-SEC-01 — JWT Token Security
JWT access tokens shall have a 15-minute TTL. Refresh tokens shall have a 7-day TTL. Tokens shall encode role, facilityId, and geoScopeIds. The JWT secret shall be rotated every 90 days.

#### NFR-SEC-02 — Password Storage
All user passwords shall be hashed with bcrypt at a cost factor of at least 12. Plaintext passwords shall never be stored, logged, or transmitted.

#### NFR-SEC-03 — PHI Encryption at Rest
Protected Health Information (PHI) fields shall be encrypted using PostgreSQL `pgcrypto`. All database backups shall be encrypted with AES-256.

#### NFR-SEC-04 — Transport Security
All API endpoints shall be served over HTTPS (TLS 1.2 minimum). All government API integrations (NIDA, HMIS, Irembo) shall use OAuth2 client credentials with mutual TLS (mTLS).

#### NFR-SEC-05 — PHI Never in Logs
Application logs shall contain only patient record IDs (UUIDs) — never names, national IDs, phone numbers, diagnosis codes, or any other PHI. Structured logging shall enforce this at the framework level.

#### NFR-SEC-06 — Immutable Audit Log
The `audit_log` table shall be append-only. No `UPDATE` or `DELETE` operations shall be permitted on this table at the database level. All PHI access events (READ, CREATE, UPDATE, DELETE, EXPORT, LOGIN, LOGOUT) shall be written to this log. Retention shall be 7 years per MoH policy.

#### NFR-SEC-07 — SQL Injection Prevention
All database queries shall use Spring Data JPA parameterised queries. No native SQL string interpolation shall be permitted.

#### NFR-SEC-08 — Rate Limiting
The API gateway shall enforce rate limits of 100 requests/minute per IP address and 1,000 requests/minute per facility token.

#### NFR-SEC-09 — CORS Policy
The API shall whitelist only the Next.js frontend origin and Irembo callback URLs. All other origins shall be rejected.

#### NFR-SEC-10 — Rwanda Data Protection Compliance
The system shall comply with Rwanda Law No. 058/2021 on Personal Data Protection. Consent shall be captured in `consent_records` before any patient data is shared with government systems. The legal basis shall be documented per consent record.

#### NFR-SEC-11 — Government API Idempotency
All government sync operations shall use globally unique idempotency keys in the format `{target_system}:{sync_type}:{resource_id}:{timestamp}` to prevent duplicate submissions on network timeout and retry.

---

### 5.3 Availability & Reliability

#### NFR-AVAIL-01 — Uptime Target
The system shall target **99.5% monthly uptime** for the production environment, monitored by Uptime Robot with 5-minute health check intervals against `/actuator/health`.

#### NFR-AVAIL-02 — Database Backups
Daily encrypted database snapshots shall be taken and stored in off-site S3-compatible storage. The Recovery Point Objective (RPO) shall be 24 hours maximum.

#### NFR-AVAIL-03 — Outbox Pattern Resilience
No government API call shall be made directly from a user-facing request thread. All external calls shall go through the `gov_sync_log` outbox pattern, ensuring that user operations succeed even when government APIs are temporarily unreachable.

#### NFR-AVAIL-04 — Retry with Exponential Backoff
Failed government sync operations shall be retried with exponential backoff: `2^retry_count` minutes between attempts. After 5 consecutive failures, the entry shall be marked `DEAD_LETTER` and an admin alert sent via SMS.

#### NFR-AVAIL-05 — Health Indicators
The `/actuator/health` endpoint shall include custom health indicators for the Africa's Talking API and the NIDA API, allowing automated monitoring to detect third-party service degradation.

---

### 5.4 Scalability

#### NFR-SCALE-01 — Multi-Facility Isolation
The `facility_id` foreign key on every patient table shall provide complete row-level multi-tenancy. Adding new facilities shall require no schema changes — only a new row in the `facilities` table.

#### NFR-SCALE-02 — Connection Pool Sizing
HikariCP connection pool shall be tuned to a maximum of 10 connections on the Railway PostgreSQL plan, with pool sizing documented in `application-prod.yml` and `DEPLOYMENT.md`.

#### NFR-SCALE-03 — Audit Log Partitioning
The `audit_log` table shall use monthly partitioning in production (e.g. `audit_log_2026_04 PARTITION OF audit_log`), managed via Flyway V10 migration, to maintain query performance as audit volume grows over the 7-year retention period.

#### NFR-SCALE-04 — Future Multi-Facility Groups
The database schema shall accommodate a future `facility_groups` table and `SUPER_ADMIN` role without requiring breaking schema changes. The current `facilities` table structure shall support this extension.

---

### 5.5 Usability & Accessibility

#### NFR-UX-01 — WCAG 2.1 AA Compliance
All six role portals shall meet WCAG 2.1 Level AA accessibility standards, verified by both automated (axe-core) and manual audits conducted in Sprint 5.

#### NFR-UX-02 — Keyboard Navigation
Every form, table, and interactive element in the application shall be fully operable using keyboard alone. Tab order shall be logical and predictable.

#### NFR-UX-03 — Screen Reader Compatibility
All images shall have meaningful alt text in Kinyarwanda. All form inputs shall have associated `<label>` elements. All status badges shall have text alternatives (not colour alone) for screen reader users. Tested with NVDA (Windows) and VoiceOver (Mac).

#### NFR-UX-04 — Skip Navigation
Every layout shall include a "skip to main content" link as the first focusable element for screen reader and keyboard users.

#### NFR-UX-05 — Mobile-First Patient Portal
The patient and health worker portals shall be designed mobile-first. The vaccination card shall be fully usable and printable on a mobile device. The health worker portal shall include a bottom tab bar (MobileNav) for touch-friendly navigation.

#### NFR-UX-06 — Offline Support
The patient vaccination card page shall be functional offline via a service worker, caching the last-fetched data for 24 hours. This accounts for areas of Rwanda with intermittent internet connectivity.

---

### 5.6 Maintainability

#### NFR-MAINT-01 — CI/CD Pipeline
Every pull request shall trigger a GitHub Actions pipeline that: compiles the Maven multi-module project, runs all unit and integration tests, enforces Checkstyle code style rules, generates a Jacoco coverage report uploaded to Codecov, and creates a Vercel preview deployment for the frontend.

#### NFR-MAINT-02 — Automated Deployments
Merging to `main` shall automatically build the Docker image, push it to GitHub Container Registry, and deploy to the Railway staging environment.

#### NFR-MAINT-03 — Database Migration Management
All schema changes shall be managed exclusively via Flyway versioned migrations (`V1__`, `V2__`, ...). No ad-hoc schema changes to the database shall be permitted. Migrations shall be tested in the CI pipeline against a Testcontainers PostgreSQL instance.

#### NFR-MAINT-04 — OpenAPI Documentation
All API endpoints shall be documented with Springdoc OpenAPI 3.1 annotations (`@Operation`, `@Parameter`, `@ApiResponse`). The JWT bearer security scheme shall be correctly applied. The specification shall be accessible at `/v3/api-docs`.

#### NFR-MAINT-05 — Test Coverage
The codebase shall maintain minimum unit test coverage of 70% for service-layer classes, measured by Jacoco. Integration tests shall cover the three critical user flows: mother registration → child registration → vaccination; service request lifecycle; and government report generation → HMIS push.

#### NFR-MAINT-06 — Error Monitoring
Sentry shall be configured for both the Spring Boot backend (unhandled exceptions) and the Next.js frontend (runtime errors). Error alerts shall be sent to the development team's notification channel.

---

### 5.7 Internationalisation

#### NFR-I18N-01 — Three-Language Support
The frontend shall support Kinyarwanda (`rw`), English (`en`), and French (`fr`) using i18next. All UI strings shall use translation keys following the pattern `section.key` (e.g. `login.title`, `login.submit`).

#### NFR-I18N-02 — Language Switcher
A language switcher shall be visible on the login page and in the application top bar, allowing users to change language at any time.

#### NFR-I18N-03 — SMS Language Preference
SMS messages sent to patients shall always be delivered in the language stored in `users.preferred_language`. The appointment reminder cron and vaccination reminder jobs shall look up this field before composing the message.

---

## 6. System Constraints

| Constraint | Detail |
|---|---|
| **Database** | PostgreSQL 15 only. The schema uses PostgreSQL-specific features: UUID primary keys, `UUID[]` array columns (`scoped_geo_ids`), `JSONB` columns (`payload`, `aggregates`), and monthly table partitioning. These are not compatible with MySQL or H2. |
| **Java Version** | Java 21 (LTS) is required. The project uses features and frameworks only available in Java 17+. |
| **Node.js Version** | Node.js 20 LTS is required for the Next.js 14 frontend. |
| **Rwanda Geo Data** | The `geo_locations` table must be seeded with the complete Rwanda administrative hierarchy (~14,000 villages). This data is sourced from official Rwanda government GIS records and is a prerequisite for all registration and scoping features. |
| **NIDA API Access** | The NIDA e-indangamuntu API requires a formal integration agreement with Rwanda's National Identification Agency. A stub implementation shall be used during development and testing. |
| **Africa's Talking Account** | A production Africa's Talking account with a Rwanda short code is required for SMS delivery. A sandbox account shall be used during development. |
| **Railway / Render Plan** | The production database connection pool is capped at 10 connections due to the Railway PostgreSQL plan tier. |
| **MoH HMIS Format** | Report payloads pushed to MoH HMIS must conform to the DHIS2-compatible schema. Any changes to HMIS requirements may require updates to `HmisApiClient`. |

---

## 7. External Integrations

### 7.1 NIDA — National Identification Agency

| Attribute | Detail |
|---|---|
| **Purpose** | Verify mother's identity at registration; cross-check name, date of birth, and administrative location against national ID |
| **Protocol** | HTTPS REST API, OAuth2 client credentials, mutual TLS (mTLS) |
| **Trigger** | Asynchronous — called by `GovSyncService` after the mother registration request returns |
| **Failure handling** | Outbox retry with exponential backoff; `nida_verified_status` set to `FAILED` after max retries; manual override available |
| **Data written back** | `mothers.geo_location_id` (from NIDA village response), `mothers.nida_verified_status` |

### 7.2 MoH HMIS — Ministry of Health Health Management Information System

| Attribute | Detail |
|---|---|
| **Purpose** | Push aggregated statistical reports (vaccination coverage, ANC attendance, birth registrations, maternal health) |
| **Protocol** | DHIS2-compatible REST API |
| **Trigger** | Manually triggered by MOH_ADMIN via "Push to HMIS" button; executed asynchronously via outbox |
| **Data shared** | Aggregated statistics only — no individual patient data |
| **Idempotency** | All pushes use a unique `idempotency_key` in `gov_sync_log` to prevent duplicate submissions |

### 7.3 Irembo — Government of Rwanda Digital Services Portal

| Attribute | Detail |
|---|---|
| **Purpose** | Submit citizen service requests (birth certificates, vaccination cards, referral letters, reprints) |
| **Protocol** | REST API (integration details per Irembo partner agreement) |
| **Trigger** | When a service request is approved by FACILITY_ADMIN and eligible for Irembo submission |
| **Data shared** | Service request payload (`service_requests.payload` JSONB), uploaded documents |
| **Tracking** | `irembo_ticket_id` stored on the `service_requests` row for status tracking |

### 7.4 Africa's Talking — SMS Gateway

| Attribute | Detail |
|---|---|
| **Purpose** | Deliver SMS notifications (vaccination reminders, appointment reminders, service status updates, admin alerts) |
| **Protocol** | HTTPS REST API (Africa's Talking v1) |
| **Outbound** | `POST` to Africa's Talking API with phone number and message body; `at_message_id` stored for tracking |
| **Inbound webhook** | `POST /webhooks/at/delivery` receives delivery status callbacks; HMAC-SHA256 signature validation required |
| **Message limit** | Maximum 2 SMS segments (320 characters) per message |

---

## 8. Data Requirements

### 8.1 Data Retention

| Data Category | Retention Period | Policy |
|---|---|---|
| PHI (patient records) | Duration of care + 10 years | MoH Rwanda policy |
| Audit logs | 7 years | MoH Rwanda / Law No. 058/2021 |
| SMS notifications | 2 years | Operational requirement |
| Government sync logs | 5 years | Audit and compliance |
| Aggregated reports | Indefinite | Statistical record |

### 8.2 Data Seeding Requirements

The following reference data must be seeded via Flyway migrations before any user-facing feature can operate:

- **`geo_locations`** (V1): Complete Rwanda administrative hierarchy — 5 provinces, 30 districts, 416 sectors, 2,148 cells, ~14,000 villages
- **`vaccination_schedules`** (V5): Complete Rwanda EPI schedule including BCG, OPV 0–3, PENTA 1–3, ROTA 1–2, PCV 1–3, MR, and MMR

### 8.3 Sensitive Data Classification

| Field | Classification | Protection |
|---|---|---|
| `users.national_id` | PHI | Encrypted at rest (pgcrypto); unique index; NIDA-verified |
| `users.phone_number` | PII | Encrypted at rest; used for SMS delivery |
| `users.password_hash` | Credentials | bcrypt cost ≥ 12; never logged or transmitted |
| `mothers.*` | PHI | Facility-scoped access; full audit trail |
| `health_visits.*` | Clinical PHI | Health worker scoped; full audit trail |
| `diagnoses.icd10_code` | Clinical PHI | Included in audit log resource tracking |
| `gov_sync_log.payload_hash` | Integrity | SHA-256; not PHI itself |
| `service_request_docs.file_hash` | Integrity | SHA-256 tamper detection |

---

## 9. Glossary

| Term | Definition |
|---|---|
| **ANC** | Antenatal Care — medical care provided to a pregnant woman before childbirth |
| **AT** | Africa's Talking — SMS gateway provider used for all outbound SMS in Rwanda |
| **CHW** | Community Health Worker — a community-based health worker assigned at the cell level in Rwanda's health system |
| **DHIS2** | District Health Information Software 2 — the platform used by MoH Rwanda for HMIS data collection |
| **EDD** | Estimated Due Date — computed as LMP date + 280 days |
| **EPI** | Expanded Programme on Immunisation — Rwanda's national childhood vaccination programme |
| **Flyway** | Database migration tool used to manage all PostgreSQL schema changes in versioned SQL files |
| **geo_location_id** | A UUID foreign key referencing the `geo_locations` table; used to pin any entity to Rwanda's administrative hierarchy |
| **HMIS** | Health Management Information System — MoH Rwanda's national health data platform |
| **ICD-10** | International Classification of Diseases, 10th revision — the coding system used for diagnoses |
| **Irembo** | Rwanda's government digital services portal for citizen service request submission |
| **JWT** | JSON Web Token — the authentication token format used for all API access |
| **LMP** | Last Menstrual Period — the date used to compute pregnancy gestational age and EDD |
| **MapStruct** | Java code generation library used to write entity-to-DTO mapping code at compile time |
| **MUAC** | Mid-Upper Arm Circumference — a field measurement used for malnutrition screening in children |
| **mTLS** | Mutual Transport Layer Security — a two-way TLS authentication method used for government API connections |
| **NIDA** | National Identification Agency — Rwanda's national ID authority; provides the e-indangamuntu identity verification API |
| **Outbox Pattern** | A reliability pattern where operations are written to a local `gov_sync_log` table before being executed by a background job, ensuring at-least-once delivery without blocking user requests |
| **PHI** | Protected Health Information — any information that can identify a patient and relates to their health condition or care |
| **PII** | Personally Identifiable Information — any data that could identify an individual |
| **PNC** | Postnatal Care — medical care provided to a mother and newborn after childbirth |
| **RBAC** | Role-Based Access Control — the system of permissions where each user role is granted specific access to resources |
| **scoped_geo_ids** | A PostgreSQL `UUID[]` array on `government_users` containing the sector UUIDs that a DISTRICT_OFFICER is authorised to access |
| **SRD** | Software Requirements Document — this document |
| **TTL** | Time To Live — the duration for which a JWT token is valid before expiry |
| **USSD** | Unstructured Supplementary Service Data — a mobile protocol enabling text-based menus without internet access, for reaching patients on low-end phones |

---