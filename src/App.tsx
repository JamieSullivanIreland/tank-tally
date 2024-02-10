import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

import './App.css';
import Header from './Header';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY || '';

function App() {
  const map = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

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

  return (
    <div className='App'>
      <Header label='Tank Tally' />
      <div
        ref={mapContainer}
        className='map-container'
      />
    </div>
  );
}

export default App;
