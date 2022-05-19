import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'


mapboxgl.accessToken = 'pk.eyJ1IjoibHVwYXR0aW4iLCJhIjoiY2wxYTlnY2RxMDRuMTNicGoweW5lYngzaCJ9.6J1n8RlyZoGMdN4K_5nkjQ';

export function initMapbox(shadowEl){
      return new mapboxgl.Map({
      container: shadowEl, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-71.4694, -41.1821], // starting position [lng, lat]
      zoom: 9 // starting zoom
      });
}

