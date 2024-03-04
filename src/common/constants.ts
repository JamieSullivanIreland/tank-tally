import { v4 as uuid } from 'uuid';

export const TOKEN = process.env.REACT_APP_MAPBOX_KEY || '';
export const TEST_TOKEN = process.env.REACT_APP_TEST_MAPBOX_KEY || '';
export const IP_URL = 'https://ipapi.co/json/';
export const SEARCH_URL = 'https://api.mapbox.com/search/searchbox/v1';
export const DIRECTIONS_URL =
  'https://api.mapbox.com/directions/v5/mapbox/driving';
export const URL_CREDENTIALS = `access_token=${TOKEN}&session_token=${uuid()}`;
