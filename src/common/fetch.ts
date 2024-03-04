import axios from 'axios';

import {
  SEARCH_URL,
  DIRECTIONS_URL,
  URL_CREDENTIALS,
  IP_URL,
  TOKEN,
  TEST_TOKEN,
} from './constants';
import { Coordinates } from './types';

export const getLocationSuggestions = async (query: string) =>
  await axios
    .get(`${SEARCH_URL}/suggest?q=${query}&${URL_CREDENTIALS}`)
    .then((res) => res.data.suggestions)
    .catch((err) => err);

export const retrieveLocationCoordinates = async (id: string) =>
  await axios
    .get(`${SEARCH_URL}/retrieve/${id}?${URL_CREDENTIALS}}`)
    .then((res) => res.data.features[0].properties.coordinates)
    .catch((err) => err);

export const getDirections = async (start: Coordinates, end: Coordinates) =>
  await axios
    .get(
      `${DIRECTIONS_URL}/${start.longitude}%2C${start.latitude}%3B${end.longitude}%2C${end.latitude}?access_token=${TOKEN}}`
    )
    .then((res) => res.data.features[0].properties.coordinates)
    .catch((err) => err);

export const getIpAddress = async () =>
  await axios
    .get(IP_URL)
    .then((res) => res.data)
    .catch((err) => err);
