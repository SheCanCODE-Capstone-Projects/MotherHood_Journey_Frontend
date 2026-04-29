import type { PageResponse } from "./api";

export type NidaStatus = "verified" | "unverified" | "pending";

export type PregnancyStatus = "active" | "completed" | "lost" | "referred";

export type CommunityHealthWorkerDTO = {
  id: string;
  name: string;
  phone: string;
};

export type MotherLocationDTO = {
  village: string;
  cell: string;
  sector: string;
  district: string;
  province: string;
};

export type MotherDTO = {
  id: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  nidaStatus: NidaStatus;
  nidaNumber?: string;
  location: MotherLocationDTO;
  chw: CommunityHealthWorkerDTO;
};

export type PregnancyDTO = {
  id: string;
  motherId: string;
  gravida: number;
  para: number;
  lmpDate: string;
  eddDate: string;
  status: PregnancyStatus;
  isActive: boolean;
};

export type MotherProfileDTO = {
  mother: MotherDTO;
  pregnancies: PregnancyDTO[];
  activePregnancy: PregnancyDTO | null;
};
