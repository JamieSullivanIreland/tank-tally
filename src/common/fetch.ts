import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { TOKEN } from './constants';

import type { LocationInput } from './types';

export const getLocationSuggestions = async (query: string) =>
  await axios
    .get(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&access_token=${TOKEN}&session_token=${uuid()}`
    )
    .then((res) => res.data.suggestions)
    .catch((err) => err);

export const retrieveLocationCoordinates = async (id: string) =>
  await axios
    .get(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?access_token=${TOKEN}&session_token=${uuid()}`
    )
    .then((res) => res.data.features[0].properties.coordinates)
    .catch((err) => err);

export const getIpAddress = async () =>
  await axios
    .get('https://ipapi.co/json/')
    .then((res) => res.data)
    .catch((err) => err);
