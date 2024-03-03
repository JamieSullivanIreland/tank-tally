export interface LocationSuggestion {
  mapbox_id: string;
  name: string;
  place_formatted: string;
  full_address: string;
}

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface LocationInput {
  active: string;
  start: string;
  end: string;
}

export interface IpInfo {
  ip: string;
  country_name: string;
}
