import { LocationSuggestion } from './types';

export const formatLocationAddress = (location: LocationSuggestion) => {
  const { name, full_address, place_formatted } = location;
  return `${name}, ${full_address || place_formatted}`;
};
