import { apiClient } from "./client";
import type {
  MotherProfileDTO,
  PregnancyDTO,
} from "@/shared/types/mother";

const MOTHERS_BASE_PATH = "/api/v1/mothers";

export function getMotherProfile(motherId: string): Promise<MotherProfileDTO> {
  return Promise.resolve({
    mother: {
      id: motherId,
      name: "Uwimana Marie",
      phone: "+250 788 000 000",
      dateOfBirth: "1995-03-15",
      nidaStatus: "verified",
      nidaNumber: "1199580123456789",
      location: {
        village: "Nyamirambo",
        cell: "Gitega",
        sector: "Nyarugenge",
        district: "Nyarugenge",
        province: "Kigali City",
      },
      chw: {
        id: "chw-001",
        name: "Jean Pierre Habimana",
        phone: "0788 123 456",
      },
    },
    pregnancies: [
      {
        id: "1",
        motherId: motherId,
        gravida: 3,
        para: 2,
        lmpDate: "2026-01-10",
        eddDate: "2026-09-17",
        status: "active",
        isActive: true,
      },
      {
        id: "2",
        motherId: motherId,
        gravida: 2,
        para: 1,
        lmpDate: "2022-06-01",
        eddDate: "2023-03-04",
        status: "completed",
        isActive: false,
      },
      {
        id: "3",
        motherId: motherId,
        gravida: 1,
        para: 0,
        lmpDate: "2020-01-15",
        eddDate: "2020-10-19",
        status: "completed",
        isActive: false,
      },
    ],
    activePregnancy: {
      id: "1",
      motherId: motherId,
      gravida: 3,
      para: 2,
      lmpDate: "2026-01-10",
      eddDate: "2026-09-17",
      status: "active",
      isActive: true,
    },
  });
}

export function openPregnancy(
  motherId: string,
  data: Pick<PregnancyDTO, "lmpDate">
): Promise<PregnancyDTO> {
  return apiClient.post<PregnancyDTO>(
    `${MOTHERS_BASE_PATH}/${motherId}/pregnancies`,
    data
  );
}

export function closePregnancy(
  motherId: string,
  pregnancyId: string
): Promise<PregnancyDTO> {
  return apiClient.patch<PregnancyDTO>(
    `${MOTHERS_BASE_PATH}/${motherId}/pregnancies/${pregnancyId}/close`,
    {}
  );
}
