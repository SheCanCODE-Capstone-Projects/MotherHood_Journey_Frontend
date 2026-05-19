/**
 * Geographic location types
 */

export interface GeoLocation {
  id: string;
  name: string;
  province?: string;
  district?: string;
  sector?: string;
}

export interface GeoLocationHierarchy {
  provinces: GeoLocation[];
  districts: GeoLocation[];
  sectors: GeoLocation[];
}
