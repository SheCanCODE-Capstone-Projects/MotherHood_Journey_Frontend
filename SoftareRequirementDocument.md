# MotherHood Journey — SRD
**SOFTWARE REQUIREMENTS DOCUMENT**


---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Stakeholders & User Roles](#2-stakeholders--user-roles)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)


---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Document (SRD) defines the functional and non-functional requirements for the **MotherHood Journey (MHJ)**, an MVP-scope web application designed to improve childhood vaccination compliance in Rwanda's community health infrastructure.


## 1.2 Project Background

Childhood immunization tracking in Rwanda's rural communities currently relies on paper-based records managed at health facilities. This creates gaps in follow-up when children miss vaccination appointments, particularly in geographically dispersed villages. The MHJ system directly addresses this by providing a digital, role-based platform that connects mothers, community health workers, nurses, and administrators in a unified workflow.

This MVP  focuses on the core immunization tracking loop — from child registration to vaccination recording to SMS reminder dispatch — before scaling to national-level government integrations (HMIS, NIDA, Irembo) in future versions.

## 1.3 Scope

The MVP covers the following core capabilities:

- User registration and authentication with role-based access control (4 roles)
- Mother and child registration by nurses
- Vaccination schedule management and recording
- SMS reminders to mothers for upcoming and missed vaccinations
- Community Health Worker (CHW) village vaccination dashboards
- Admin user management and system-wide reporting
- Mother access to view and download the child's Birth Certificate
- Mother access to view and download the child's Vaccination Card



## 1.4 Definitions & Abbreviations.

| **Term / Abbreviation** | **Definition** |
|---|---|
| **MHJ** | MotherHood Journey — the system described in this document |
| **RBAC** | Role-Based Access Control — restricting system access based on user role |
| **MVP** | Minimum Viable Product — a focused first release covering core functionality |
| **CHW** | Community Health Worker — a lay health worker supervising a village area |
| **HMIS** | Health Management Information System — Rwanda's national health data platform |
| **NIDA** | National Identification Agency — Rwanda's national ID authority |
| **SMS** | Short Message Service — text message notifications sent to mothers |
| **SRD** | Software Requirements Document — this document |
| **ADMIN** | System Administrator — the super admin role in the MVP RBAC |
| **FAC_ADMIN** | Facility Administrator — a role planned for v2, split from ADMIN |
| **BIRTH_CERT** | Birth Certificate — a downloadable PDF document generated per child |
| **VAX_CARD** | Vaccination Card — a downloadable PDF summarizing the child's immunization record |

---

# 2. Stakeholders & User Roles

## 2.1 Stakeholder Summary

The following parties have a direct interest in the MHJ system and its outcomes:

- **Ministry of Health (Rwanda)** — ultimate beneficiary; wants improved immunization coverage data
- **Health Facility Nurses** — primary operators who register children and record vaccinations
- **Community Health Workers** — field agents who follow up with mothers in their village
- **Mothers** — end beneficiaries who receive reminders, can check their child's records, and can access official documents (Birth Certificate, Vaccination Card)
- **System Administrator** — the technical manager who controls user access during MVP


## 2.2 MVP Role Definitions

The MVP implements exactly four (4) RBAC roles. This is a deliberate design decision: the full matrix (including DIST_OFFICER, GOV_ANALYST, MOH_ADMIN) is deferred to v2 as it depends on government integration features not built in the MVP.

| **Role** | **Description** | **Access Level** | **Registration** |
|---|---|---|---|
| **MOTHER** | A registered mother accessing her child's immunization schedule, receiving SMS reminders, and downloading official documents (Birth Certificate, Vaccination Card). | Own child's data only | Self-registers via unique code given at birth registration |
| **NURSE** | A verified health facility nurse who registers mothers/children and records vaccinations. | All children at assigned facility | Account created by ADMIN |
| **CHW (Community Health Worker)** | A field health worker who tracks upcoming/missed vaccinations and follows up with mothers. | Read-only view of village list at assigned facility/sector | Account created by ADMIN  |
| **ADMIN (Super Admin)** | System administrator who manages all users, facilities, and system-wide data. | Full system access — all facilities, all children, all stats | Seeded directly in database at deployment |

**Design rationale for role structure:**

- Self-registration is permitted only for MOTHER because this is a low-trust action — the mother can only access her own child's data.
- NURSE and CHW accounts are created by ADMIN because these roles carry high-trust access to other people's health data. Allowing self-registration for these roles would be a security vulnerability.
- The first ADMIN account is seeded directly in the database at deployment time. This is industry-standard practice — no one creates the first admin through a UI.
- When the system grows beyond MVP, ADMIN is split into FAC_ADMIN and MOH_ADMIN, and DIST_OFFICER and GOV_ANALYST roles are added. The enum-based code structure allows this without a rewrite.

## 2.3 Role-to-Feature Access Matrix

| **Feature** | **MOTHER** | **NURSE** | **CHW** | **ADMIN** |
|---|---|---|---|---|
| View own child's vaccination schedule | ✓ | ✓ | — | ✓ |
| Self-register with birth code | ✓ | — | — | — |
| Register mother and child | — | ✓ | — | ✓ |
| Record vaccination event | — | ✓ | — | ✓ |
| View village upcoming/missed list | — | — | ✓ | ✓ |
| Create NURSE accounts | — | — | — | ✓ |
| Create CHW accounts | — | — | — | ✓ |
| View all facilities & children | — | — | — | ✓ |
| View system-wide vaccination stats | — | — | — | ✓ |
| Trigger SMS reminders | — | ✓ | ✓ | ✓ |
| **View & download Birth Certificate** | **✓** | **✓** | **—** | **✓** |
| **View & download Vaccination Card** | **✓** | **✓** | **—** | **✓** |

---

# 3. Functional Requirements

## 3.1 Authentication & Authorization

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-AUTH-01** | The system shall support user login via email and password. | HIGH | ALL |
| **FR-AUTH-02** | The system shall issue a JWT token upon successful login with a configurable expiry (default: 24 hours). | HIGH | ALL |
| **FR-AUTH-03** | The system shall enforce role-based access control (RBAC) on every protected route. | HIGH | ALL |
| **FR-AUTH-04** | MOTHER accounts shall be created via a self-registration form using a unique birth registration code provided by a NURSE. | HIGH | MOTHER |
| **FR-AUTH-05** | NURSE and CHW accounts shall only be created by an ADMIN through the admin user management panel. | HIGH | ADMIN |
| **FR-AUTH-06** | The initial ADMIN account shall be seeded via a secure database migration script at deployment time — no UI creation path for the first admin. | HIGH | ADMIN |
| **FR-AUTH-07** | The system shall reject login attempts after 5 consecutive failures and lock the account for 15 minutes. | MEDIUM | ALL |
| **FR-AUTH-08** | Passwords shall be hashed using bcrypt with a minimum work factor of 12. | HIGH | ALL |
| **FR-AUTH-09** | The system shall provide a secure password reset flow via email link with a 30-minute expiry token. | MEDIUM | ALL |

## 3.2 Mother & Child Registration

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-REG-01** | A NURSE shall be able to register a new mother by entering: full name, phone number (Rwandan format), village, and sector. | HIGH | NURSE, ADMIN |
| **FR-REG-02** | Upon mother registration, the system shall generate a unique alphanumeric birth registration code and display it to the NURSE for handoff to the mother. | HIGH | NURSE, ADMIN |
| **FR-REG-03** | A NURSE shall be able to register a child under a mother record with: child name, date of birth, gender, and weight at birth. | HIGH | NURSE, ADMIN |
| **FR-REG-04** | Upon child registration, the system shall automatically generate the standard Rwanda immunization schedule (EPI schedule) for that child based on date of birth. | HIGH | NURSE, ADMIN |
| **FR-REG-05** | A MOTHER shall be able to self-register by providing her birth registration code, phone number, and setting a password. | HIGH | MOTHER |
| **FR-REG-06** | The system shall validate that a birth registration code exists and has not been previously claimed before allowing mother self-registration. | HIGH | MOTHER |
| **FR-REG-07** | Each child record shall be linked to exactly one facility and one mother. | HIGH | NURSE, ADMIN |

## 3.3 Vaccination Schedule & Recording

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-VAX-01** | The system shall display a vaccination schedule for each child, listing vaccine name, scheduled date, and status (upcoming / completed / missed). | HIGH | ALL |
| **FR-VAX-02** | A NURSE shall be able to record a vaccination event for a child by selecting the vaccine, recording the actual date given, batch number, and administering nurse. | HIGH | NURSE, ADMIN |
| **FR-VAX-03** | Upon recording a vaccination, the system shall automatically mark that schedule entry as 'completed' and log the timestamp. | HIGH | NURSE, ADMIN |
| **FR-VAX-04** | The system shall automatically mark a scheduled vaccination as 'missed' if the scheduled date passes without a recorded vaccination event. | HIGH | SYSTEM |
| **FR-VAX-05** | The system shall support Rwanda's standard EPI (Expanded Programme on Immunization) vaccine schedule: BCG, OPV, Pentavalent, Rotavirus, PCV, MR, and Yellow Fever. | HIGH | NURSE, ADMIN |
| **FR-VAX-06** | A NURSE shall be able to record a catch-up vaccination for a missed dose with an override date and a reason field. | MEDIUM | NURSE, ADMIN |
| **FR-VAX-07** | The system shall prevent duplicate vaccination recording for the same vaccine and dose within a configurable minimum interval. | MEDIUM | NURSE, ADMIN |

## 3.4 Mother Dashboard

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-MOM-01** | A MOTHER shall be able to log in and view her child's full vaccination schedule. | HIGH | MOTHER |
| **FR-MOM-02** | The dashboard shall clearly display each vaccine's: name, scheduled date, status badge (upcoming / completed / missed), and date administered if completed. | HIGH | MOTHER |
| **FR-MOM-03** | A MOTHER shall be able to view the contact details of the health facility where her child is registered. | LOW | MOTHER |
| **FR-MOM-04** | A MOTHER with multiple children shall see a selector to switch between child records. | MEDIUM | MOTHER |
| **FR-MOM-05** | The mother dashboard shall be responsive and usable on a low-end mobile browser. | HIGH | MOTHER |
| **FR-MOM-06** | A MOTHER shall be able to view her child's Birth Certificate (BIRTH_CERT) directly from the dashboard. | HIGH | MOTHER |
| **FR-MOM-07** | A MOTHER shall be able to download her child's Birth Certificate as a PDF file. | HIGH | MOTHER |
| **FR-MOM-08** | A MOTHER shall be able to view her child's Vaccination Card (VAX_CARD) directly from the dashboard, showing all administered and pending vaccines. | HIGH | MOTHER |
| **FR-MOM-09** | A MOTHER shall be able to download her child's Vaccination Card as a PDF file. | HIGH | MOTHER |
| **FR-MOM-10** | The Birth Certificate PDF shall include: child full name, date of birth, gender, weight at birth, facility name, and date of issuance. | HIGH | MOTHER, NURSE, ADMIN |
| **FR-MOM-11** | The Vaccination Card PDF shall include: child full name, date of birth, mother name, facility name, and a table of all vaccines with scheduled date, administered date, batch number, and status. | HIGH | MOTHER, NURSE, ADMIN |
| **FR-MOM-12** | Downloaded documents shall be generated on-demand as server-side PDFs and served securely — only to authenticated users with access to that child's record. | HIGH | MOTHER, NURSE, ADMIN |

## 3.5 CHW Dashboard

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-CHW-01** | A CHW shall be able to view a list of all children in their assigned village/sector, filtered by vaccination status. | HIGH | CHW |
| **FR-CHW-02** | The CHW dashboard shall show three lists: upcoming vaccinations (within 7 days), missed vaccinations, and recently completed vaccinations. | HIGH | CHW |
| **FR-CHW-03** | Each child entry in the CHW dashboard shall display: child name, mother name, mother phone number, next vaccine due, and due date. | HIGH | CHW |
| **FR-CHW-04** | A CHW shall be able to initiate an SMS reminder to a specific mother from the dashboard. | MEDIUM | CHW |
| **FR-CHW-05** | The CHW view shall be read-only — CHWs may not create, edit, or delete any records. | HIGH | CHW |

## 3.6 Nurse Dashboard

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-NRS-01** | A NURSE shall be able to view all children registered at their assigned facility. | HIGH | NURSE |
| **FR-NRS-02** | The nurse dashboard shall allow searching children by name, mother name, or date of birth. | HIGH | NURSE |
| **FR-NRS-03** | A NURSE shall be able to record vaccinations, register mothers/children, and view upcoming/missed appointments. | HIGH | NURSE |
| **FR-NRS-04** | A NURSE shall be able to generate a birth registration code for a new mother from the dashboard. | HIGH | NURSE |
| **FR-NRS-05** | A NURSE shall be restricted to data within their assigned facility only. | HIGH | NURSE |

## 3.7 Admin Dashboard

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-ADM-01** | An ADMIN shall be able to create NURSE accounts by providing: full name, email, phone number, and assigned facility. | HIGH | ADMIN |
| **FR-ADM-02** | An ADMIN shall be able to create CHW accounts by providing: full name, email, phone number, assigned facility/sector. | HIGH | ADMIN |
| **FR-ADM-03** | An ADMIN shall be able to deactivate or reactivate any NURSE or CHW account. | HIGH | ADMIN |
| **FR-ADM-04** | An ADMIN shall be able to view a system-wide dashboard showing: total registered children, total vaccinations recorded, upcoming and missed counts across all facilities. | HIGH | ADMIN |
| **FR-ADM-05** | An ADMIN shall be able to view a list of all registered facilities and their associated nurses. | HIGH | ADMIN |
| **FR-ADM-06** | An ADMIN shall be able to manually trigger batch SMS reminders for all children with upcoming vaccinations in the next 48 hours. | MEDIUM | ADMIN |

## 3.8 SMS Notification System

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-SMS-01** | The system shall send an automated SMS reminder to a mother 48 hours before a scheduled vaccination. | HIGH | SYSTEM |
| **FR-SMS-02** | The system shall send an automated SMS to a mother when a vaccination is recorded as missed. | HIGH | SYSTEM |
| **FR-SMS-03** | SMS messages shall be in Kinyarwanda by default, with English as a fallback. | MEDIUM | SYSTEM |
| **FR-SMS-04** | The system shall log every SMS sent, including timestamp, recipient, message content, and delivery status. | HIGH | SYSTEM |
| **FR-SMS-05** | The system shall integrate with a Rwandan SMS gateway (e.g., Africa's Talking or MTN Rwanda API). | HIGH | SYSTEM |
| **FR-SMS-06** | SMS sending shall be handled asynchronously via a background job queue to prevent blocking the main application thread. | MEDIUM | SYSTEM |

## 3.9 Document Generation (Birth Certificate & Vaccination Card)

> **New feature area added in v1.1**

| **Req. ID** | **Requirement** | **Priority** | **Role(s)** |
|---|---|---|---|
| **FR-DOC-01** | The system shall generate a Birth Certificate (BIRTH_CERT) PDF for each registered child upon request. | HIGH | MOTHER, NURSE, ADMIN |
| **FR-DOC-02** | The Birth Certificate shall be accessible from the Mother Dashboard via a "View Birth Certificate" button. | HIGH | MOTHER |
| **FR-DOC-03** | The Birth Certificate shall be downloadable as a PDF via a "Download Birth Certificate" button. | HIGH | MOTHER |
| **FR-DOC-04** | The system shall generate a Vaccination Card (VAX_CARD) PDF for each registered child upon request. | HIGH | MOTHER, NURSE, ADMIN |
| **FR-DOC-05** | The Vaccination Card shall be accessible from the Mother Dashboard via a "View Vaccination Card" button. | HIGH | MOTHER |
| **FR-DOC-06** | The Vaccination Card shall be downloadable as a PDF via a "Download Vaccination Card" button. | HIGH | MOTHER |
| **FR-DOC-07** | PDF generation shall be performed server-side and delivered as a secure file download or inline viewer. | HIGH | SYSTEM |
| **FR-DOC-08** | The document generation endpoint shall require a valid JWT and validate that the requesting user has access to the specified child's record. | HIGH | SYSTEM |
| **FR-DOC-09** | If a vaccination record is updated after a Vaccination Card has been downloaded, the next download shall reflect the most recent data. | HIGH | SYSTEM |
| **FR-DOC-10** | The Birth Certificate PDF shall display: child full name, date of birth, gender, weight at birth, facility name, nurse who registered the child, and issuance date. | HIGH | SYSTEM |
| **FR-DOC-11** | The Vaccination Card PDF shall display: child full name, date of birth, mother name, facility name, and a structured table of all vaccines with scheduled date, administered date, batch number, and status (Completed / Missed / Upcoming). | HIGH | SYSTEM |
| **FR-DOC-12** | The system shall allow a NURSE or ADMIN to regenerate and download a Birth Certificate or Vaccination Card for any child within their access scope. | MEDIUM | NURSE, ADMIN |

---

# 4. Non-Functional Requirements

## 4.1 Security

- All API endpoints shall require a valid JWT token, except the login, self-registration, and password-reset endpoints.
- Role authorization shall be enforced server-side on every request — client-side role checks are UI convenience only, never security.
- HTTPS shall be enforced in all environments (staging and production). HTTP requests shall be redirected to HTTPS.
- Patient health data (vaccination records, mother/child info) shall not be logged in application logs.
- Sensitive configuration (DB credentials, SMS API keys, JWT secret) shall be stored in environment variables, never in source code.
- A MOTHER's token shall only return data scoped to her own children. Any attempt to access another child's record shall return HTTP 403.
- Generated PDF documents (Birth Certificate, Vaccination Card) shall be served over HTTPS only and shall not be cached on the client beyond the active session.

## 4.2 Performance

- API response time for dashboard data queries shall be under 500ms at P95 with up to 1,000 concurrent users.
- The vaccination schedule generation (on child registration) shall complete within 200ms.
- SMS batch jobs shall not block the main application thread or degrade API response times.
- Database queries against children/vaccination tables shall use indexed columns (facility_id, mother_id, scheduled_date, status).
- **PDF document generation shall complete within 3 seconds under normal load.**

## 4.3 Usability

- The mother dashboard shall be fully usable on a 320px-wide mobile browser without horizontal scrolling.
- All user-facing error messages shall be written in plain language (not technical error codes).
- The CHW and nurse dashboards shall display data in tabular form with clearly labeled status badges.
- The admin user creation form shall provide inline validation feedback before submission.
- **The Birth Certificate and Vaccination Card download buttons shall be clearly visible on the Mother Dashboard and accessible within one tap/click.**

## 4.4 Reliability & Availability

- The system shall target 99.5% uptime during business hours (6am–10pm CAT).
- The system shall implement database connection pooling to handle burst traffic.
- All vaccination recording operations shall be atomic — partial saves shall be rolled back.

## 4.5 Maintainability & Scalability

- The role system shall be implemented as a database-level enum, allowing new roles (FAC_ADMIN, DIST_OFFICER, GOV_ANALYST, MOH_ADMIN) to be added without schema migration of existing tables.
- The permission check logic shall be centralized in a single middleware layer — not scattered across route handlers.
- The codebase shall follow MVC or layered architecture (routes → controllers → services → models).
- The system shall be containerized using Docker for consistent deployment across environments.


## 4.6 Data Privacy & Compliance

- Mother and child health records are classified as sensitive personal health data and shall be treated accordingly.
- No health records shall be shared with third parties outside the system without explicit authorization.
- Data retention policies shall be defined before production deployment (out of scope for MVP, but architecture shall not preclude future enforcement).
- Phone numbers used for SMS shall not be exposed in API responses beyond what is needed for the requesting role.
- Downloaded PDFs containing personal health data shall not include tracking pixels or third-party analytics embeds.

---
