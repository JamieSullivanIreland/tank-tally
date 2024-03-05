import { useRef, useEffect, useState, SyntheticEvent } from 'react';
import mapboxgl, { GeoJSONSource, Map } from 'mapbox-gl';
import {
  Autocomplete,
  TextField,
  Stack,
  CircularProgress,
} from '@mui/material';

import './App.css';
import {
  getDirections,
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
  Location,
} from './common/types';

mapboxgl.accessToken = TOKEN;

function App() {
  const map = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [activeInput, setActiveInput] = useState<string>('');
  const [locationInput, setLocationInput] = useState<LocationInput>({
    start: {
      name: '',
      longitude: 0,
      latitude: 0,
    },
    end: {
      name: '',
      longitude: 0,
      latitude: 0,
    },
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
      const key = activeInput as keyof LocationInput;
      const location = locationInput[key] as Location;

      if (location && location.name) {
        await getLocationSuggestions(location.name)
          .then((locations: LocationSuggestion[]) => {
            if (!locations) return;
            setLocationSuggestions(locations);
          })
          .catch((err) => console.log(err));
      }
    }

    locationInput.start.name || locationInput.end.name
      ? fetchLocations()
      : setLocationSuggestions([]);
  }, [activeInput, locationInput.start.name, locationInput.end.name]);

  // Fetch directions
  useEffect(() => {
    async function fetchDirections() {
      const start = {
        longitude: locationInput.start.longitude,
        latitude: locationInput.start.latitude,
      };
      const end = {
        longitude: locationInput.end.longitude,
        latitude: locationInput.end.latitude,
      };
      return await getDirections(start, end);
    }

    if (
      map.current &&
      locationInput.end.longitude &&
      locationInput.end.latitude
    ) {
      fetchDirections().then((res) => {
        const data = res.routes[0];
        const route = data.geometry.coordinates;
        paintMapDirections(route);
      });
    }
  }, [locationInput.end.longitude, locationInput.end.latitude]);

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

  const paintMapDirections = (coordinates: Array<number[]>) => {
    const geojson: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.current && map.current.getSource('route')) {
      const source = map.current.getSource('route') as GeoJSONSource;
      source.setData(geojson);
    } else {
      // otherwise, we'll make a new request
      if (!map.current) return;
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson,
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
    }
  };

  const handleLocationChange = (e: SyntheticEvent<Element, Event>) => {
    const element = e.target as HTMLInputElement;
    const key = element.id as keyof LocationInput;
    setActiveInput(key);
    setLocationInput({
      ...locationInput,
      [key]: {
        ...locationInput[key],
        name: element.value,
      },
    });
  };

  const handleOnChange = async (e: SyntheticEvent<Element, Event>) => {
    const element = e.target as HTMLInputElement;
    const { innerText } = element;
    const key = element.id.split('-')[0] as keyof LocationInput;
    const location = locationSuggestions.find(
      (location) => formatLocationAddress(location) === innerText
    );

    if (location) {
      const coordinates: Coordinates = await retrieveLocationCoordinates(
        location.mapbox_id
      );

      if (map.current && coordinates) {
        setLocationInput({
          ...locationInput,
          [key]: {
            ...locationInput[key],
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
          },
        });

        map.current.setCenter([coordinates.longitude, coordinates.latitude]);
        map.current.setZoom(15);

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
            value={locationInput.start.name}
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
            value={locationInput.end.name}
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
