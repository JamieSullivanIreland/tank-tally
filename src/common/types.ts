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

export interface Location extends Coordinates {
  name?: string;
}

export interface LocationInput {
  start: Location;
  end: Location;
}

export interface IpInfo {
  ip: string;
  country_name: string;
}
