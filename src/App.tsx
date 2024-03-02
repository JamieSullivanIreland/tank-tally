import { useRef, useEffect, useState, SyntheticEvent } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { Autocomplete, TextField, Stack } from '@mui/material';

import './App.css';

const token = process.env.REACT_APP_MAPBOX_KEY || '';

mapboxgl.accessToken = token;

interface Location {
  name: string;
  place_formatted: string;
}

interface LocationInput {
  active: string;
  start: string;
  end: string;
}

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
  const sessionId = uuid();

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
    if (locationInput.active) {
      fetch();
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

  const fetch = () => {
    const key = locationInput.active as keyof LocationInput;
    if (!locationInput[key]) return;
    axios
      .get(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${locationInput[key]}&access_token=${token}&session_token=${sessionId}`
      )
      .then((res) => {
        if (locationInput.active === 'start') {
          setStartLocationOptions(res.data.suggestions);
        }
        if (locationInput.active === 'end') {
          setEndLocationOptions(res.data.suggestions);
        }
        console.log(res.data.suggestions);
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
