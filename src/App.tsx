import { useRef, useEffect, useState, ChangeEvent } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import './App.css';
import Input from './components/Input';

const token = process.env.REACT_APP_MAPBOX_KEY || '';

mapboxgl.accessToken = token;

function App() {
  const map = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [locationText, setLocationText] = useState('');
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
    if (locationText) {
      fetch();
    }
  }, [locationText]);

  const handleOnChange = (e: ChangeEvent) => {
    const element = e.currentTarget as HTMLInputElement;
    console.log(element.value);
    setLocationText(element.value);
  };

  const fetch = () => {
    axios
      .get(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${locationText}&access_token=${token}&session_token=${sessionId}`
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <div className='App'>
      <div
        ref={mapContainer}
        className='map-container'
      />
      <div className='location-container'>
        <Input
          name='startPoint'
          onChange={handleOnChange}
        />
        <Input
          name='destination'
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
}

export default App;
