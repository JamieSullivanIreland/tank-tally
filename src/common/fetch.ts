import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { TOKEN } from './constants';

import type { LocationInput } from './types';

export const getLocations = async (locationInput: LocationInput) => {
  const key = locationInput.active as keyof LocationInput;
  return await axios
    .get(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${locationInput[key]}&access_token=${TOKEN}&session_token=${uuid()}`
    )
    .then((res) => res.data.suggestions)
    .catch((err) => err);
};
