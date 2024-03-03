import { useRef, useEffect, useState, SyntheticEvent } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import { Autocomplete, TextField, Stack } from '@mui/material';

import './App.css';
import { getLocations } from './common/fetch';
import { TOKEN } from './common/constants';

import type { Location, LocationInput } from './common/types';

mapboxgl.accessToken = TOKEN;

function App() {
  const map = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [startLocationOptions, setStartLocationOptions] = useState<Location[]>(
    []
  );
  const [endLocationOptions, setEndLocationOptions] = useState<Location[]>([]);
  const [locationInput, setLocationInput] = useState<LocationInput>({
    active: '',
    start: '',
    end: '',
  });

  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current) {
      map.current = new Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom,
      });
    }
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      await getLocations(locationInput)
        .then((locations: Location[]) => {
          if (!locations) return;
          if (locationInput.active === 'start') {
            setStartLocationOptions(locations);
          }
          if (locationInput.active === 'end') {
            setEndLocationOptions(locations);
          }
        })
        .catch((err) => console.log(err));
    }

    if (locationInput.active === 'start') {
      locationInput.start ? fetchLocations() : setStartLocationOptions([]);
    }
    if (locationInput.active === 'end') {
      locationInput.end ? fetchLocations() : setEndLocationOptions([]);
    }
  }, [locationInput.active, locationInput.start, locationInput.end]);

  const handleLocationChange = (e: SyntheticEvent<Element, Event>) => {
    const element = e.target as HTMLInputElement;
    const { id, value } = element;
    setLocationInput({
      ...locationInput,
      active: id,
      [id]: value,
    });
  };

  // const selectedValues = useMemo(
  //   () => startLocationOptions.filter((v) => v.selected),
  //   [allValues]
  // );

  return (
    <div className='App'>
      <div
        ref={mapContainer}
        className='map-container'
      />
      <div className='location-container'>
        <Stack
          spacing={2}
          sx={{ width: 300 }}
        >
          <Autocomplete
            id='start'
            value={locationInput.start}
            onInputChange={handleLocationChange}
            freeSolo
            options={startLocationOptions.map(
              (location: Location) =>
                `${location.name} ${location.place_formatted}`
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
            freeSolo
            options={endLocationOptions.map(
              (location: Location) =>
                `${location.name} ${location.place_formatted}`
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
