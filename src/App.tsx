import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
// @ts-ignore
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import './App.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY || '';

function App() {
  const map = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const directions = new MapboxDirections({
    accessToken: process.env.REACT_APP_MAPBOX_KEY,
    unit: 'metric',
    profile: 'mapbox/cycling',
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
      map.current.addControl(directions, 'top-left');
    }
  }, []);

  return (
    <div className='App'>
      <div
        ref={mapContainer}
        className='map-container'
      />
    </div>
  );
}

export default App;
