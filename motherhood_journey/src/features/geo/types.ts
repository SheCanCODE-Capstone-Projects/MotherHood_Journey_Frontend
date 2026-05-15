export interface GeoLocation {
  id: string;
  name: string;
  code?: string;
}

export interface Province extends GeoLocation {}
export interface District extends GeoLocation {}
export interface Sector extends GeoLocation {}
export interface Cell extends GeoLocation {}
export interface Village extends GeoLocation {}

export interface GeoLocationSummaryDTO {
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  sectorId?: string;
  sectorName?: string;
  cellId?: string;
  cellName?: string;
  villageId?: string;
  villageName?: string;
}
