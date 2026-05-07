import { NextResponse } from "next/server";

import type {
  VaccinationCardData,
} from "@/features/child/types";

const BACKEND_URL = process.env.VACCINATION_CARD_BACKEND_URL?.trim();

function normalizeChildId(childId: string) {
  return decodeURIComponent(childId).trim();
}

function createDemoVaccinationCard(childId: string): VaccinationCardData {
  const normalizedChildId = normalizeChildId(childId);

  return {
    child: {
      id: normalizedChildId,
      fullName: "Aline Uwase",
      dateOfBirth: "2025-12-28",
      motherName: "Nirere Clementine",
      facilityName: "Nyamata Health Center",
      householdPhone: "+250 788 123 456",
    },
    lastUpdatedAt: new Date().toISOString(),
    vaccines: [
      {
        id: "bcg",
        name: "BCG",
        doseLabel: "Birth dose",
        status: "completed",
        dueDate: "2025-12-28",
        administeredDate: "2025-12-28",
      },
      {
        id: "opv0",
        name: "OPV 0",
        doseLabel: "Birth dose",
        status: "completed",
        dueDate: "2025-12-28",
        administeredDate: "2025-12-28",
      },
      {
        id: "penta1",
        name: "Pentavalent 1",
        doseLabel: "6 weeks",
        status: "completed",
        dueDate: "2026-02-08",
        administeredDate: "2026-02-07",
      },
      {
        id: "pcv1",
        name: "PCV 1",
        doseLabel: "6 weeks",
        status: "completed",
        dueDate: "2026-02-08",
        administeredDate: "2026-02-07",
      },
      {
        id: "rota1",
        name: "Rotavirus 1",
        doseLabel: "6 weeks",
        status: "completed",
        dueDate: "2026-02-08",
        administeredDate: "2026-02-07",
      },
      {
        id: "penta2",
        name: "Pentavalent 2",
        doseLabel: "10 weeks",
        status: "completed",
        dueDate: "2026-03-12",
        administeredDate: "2026-03-12",
      },
      {
        id: "opv1",
        name: "OPV 1",
        doseLabel: "10 weeks",
        status: "overdue",
        dueDate: "2026-03-12",
        administeredDate: null,
      },
      {
        id: "pcv2",
        name: "PCV 2",
        doseLabel: "10 weeks",
        status: "overdue",
        dueDate: "2026-03-12",
        administeredDate: null,
      },
      {
        id: "rota2",
        name: "Rotavirus 2",
        doseLabel: "10 weeks",
        status: "due",
        dueDate: "2026-05-01",
        administeredDate: null,
      },
      {
        id: "mr",
        name: "Measles-Rubella",
        doseLabel: "9 months",
        status: "upcoming",
        dueDate: "2026-06-15",
        administeredDate: null,
      },
    ],
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { childId: string } },
) {
  if (BACKEND_URL) {
    try {
      const response = await fetch(
        `${BACKEND_URL.replace(/\/$/, "")}/children/${encodeURIComponent(params.childId)}/vaccinations`,
        {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      if (response.ok) {
        const payload = (await response.json()) as VaccinationCardData;
        return NextResponse.json(payload);
      }
    } catch {
      // Fall back to demo data below.
    }
  }

  return NextResponse.json(createDemoVaccinationCard(params.childId));
}