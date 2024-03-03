import { useRef, useEffect, useState, SyntheticEvent } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import {
  Autocomplete,
  TextField,
  Stack,
  CircularProgress,
} from '@mui/material';

import './App.css';
import {
  getIpAddress,
  getLocationSuggestions,
  retrieveLocationCoordinates,
} from './common/fetch';
import { TOKEN } from './common/constants';
import { formatLocationAddress } from './common/utils';

import type {
  LocationSuggestion,
  LocationInput,
  Coordinates,
  IpInfo,
} from './common/types';

mapboxgl.accessToken = TOKEN;

function App() {
  const map = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [locationInput, setLocationInput] = useState<LocationInput>({
    active: '',
    start: '',
    end: '',
  });

  // Render map and set inital location
  useEffect(() => {
    if (map.current) return;

    async function setInitialLocation() {
      await getIpAddress()
        .then((ipInfo: IpInfo) => getLocationSuggestions(ipInfo.country_name))
        .then((locations: LocationSuggestion[]) =>
          retrieveLocationCoordinates(locations[0].mapbox_id)
        )
        .then((coordinates: Coordinates) => {
          coordinates
            ? renderMap(coordinates, 6)
            : renderMap({ longitude: -24, latitude: 42 }, 1);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }

    // Set initial location to country ip or default
    setInitialLocation();
  }, []);

  // Fetch location suggestions on input change
  useEffect(() => {
    async function fetchLocations() {
      const key = locationInput.active as keyof LocationInput;
      await getLocationSuggestions(locationInput[key])
        .then((locations: LocationSuggestion[]) => {
          if (!locations) return;
          setLocationSuggestions(locations);
        })
        .catch((err) => console.log(err));
    }

    locationInput.start ? fetchLocations() : setLocationSuggestions([]);
  }, [locationInput.start, locationInput.end]);

  const renderMap = (coordinates: Coordinates, zoom: number) => {
    if (mapContainer.current) {
      map.current = new Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [coordinates.longitude, coordinates.latitude],
        zoom,
      });
    }
  };

  const handleLocationChange = (e: SyntheticEvent<Element, Event>) => {
    const element = e.target as HTMLInputElement;
    const { id, value } = element;
    setLocationInput({
      ...locationInput,
      active: id,
      [id]: value,
    });
  };

  const handleOnChange = async (e: SyntheticEvent<Element, Event>) => {
    const element = e.target as HTMLInputElement;
    const location = locationSuggestions.find(
      (location) => formatLocationAddress(location) === element.innerText
    );

    if (location) {
      const coordinates: Coordinates = await retrieveLocationCoordinates(
        location.mapbox_id
      );

      if (map.current && coordinates) {
        map.current.setCenter([coordinates.longitude, coordinates.latitude]);
        map.current.setZoom(16);

        // Set marker options.
        new mapboxgl.Marker({
          color: '#000000',
          // draggable: true,
        })
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .addTo(map.current);
      }
    }
  };

  return (
    <div className='App'>
      {isLoading ? (
        <CircularProgress size={100} />
      ) : (
        <div
          ref={mapContainer}
          className='map-container'
        />
      )}
      <div className='location-container'>
        <Stack
          spacing={2}
          sx={{ width: 300 }}
        >
          <Autocomplete
            id='start'
            value={locationInput.start}
            onInputChange={handleLocationChange}
            onChange={handleOnChange}
            freeSolo
            options={locationSuggestions.map((location: LocationSuggestion) =>
              formatLocationAddress(location)
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Start Location'
              />
            )}
          />
          <Autocomplete
            id='end'
            value={locationInput.end}
            onInputChange={handleLocationChange}
            onChange={handleOnChange}
            freeSolo
            options={locationSuggestions.map((location: LocationSuggestion) =>
              formatLocationAddress(location)
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label='End Location'
              />
            )}
          />
        </Stack>
      </div>
    </div>
  );
}

export default App;
