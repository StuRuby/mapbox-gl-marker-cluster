import mapboxgl from 'mapbox-gl';
import clusterMarkerLayer from './cluster-marker-layer';
import points from './mockData';
import './cluster-marker-layer.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxtY2NvbiIsImEiOiJjaXhzam82cGUwMDA4MnFxbGhtYnlxZWpuIn0.lccg2WmAhgu2hcCwfdE4Tg';

const map = new mapboxgl.Map({
    container: 'map',
    center: [120, 31],
    zoom: 10,
    minZoom: 1,
    maxZoom: 20,
    style: 'mapbox://styles/mapbox/streets-v9',
});

var navigationControl = new mapboxgl.NavigationControl({
    showCompass: false,
    showZoom: true,
});
map.addControl(navigationControl, 'top-right');

const clusters = new clusterMarkerLayer(map);
clusters.init(points.features);