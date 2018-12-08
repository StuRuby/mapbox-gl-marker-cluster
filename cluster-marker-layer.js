import supercluster from 'supercluster';
import mapboxgl from 'mapbox-gl';

const defaultOptions = {
    radius: 80,
    maxZoom: 20
};

export default class ClusterMarkerLayer {
    constructor(map, options = defaultOptions) {
        this.clusterMarkerLayer = new supercluster(options);
        this._map = map;
        this.clusters = {};
        this.markers = [];
    }

    init(points) {
        this.clusterMarkerLayer.load(points);
        this._map.on('moveend', this.updateClusters.bind(this));
        this.updateClusters();
    }

    updateClusters() {
        const bounds = this._map.getBounds();
        const zoom = this._map.getZoom();
        const clusterGeojson = this.clusterMarkerLayer.getClusters([
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth()
        ], Math.floor(zoom));

        if (Object.keys(this.clusters).length > 0) {
            // this.clusters.map(cluster => cluster.remove());
            Object.keys(this.clusters).map(key => this.clusters[key].remove());
        }

        this.displayFeatures(clusterGeojson);

    }

    displayFeatures(features) {
        if (!Array.isArray(this.markers)) throw new Error('this.markers should be an array!');
        if (this.markers.length > 0) {
            this.markers.forEach(marker => marker.remove());
        }

        features.map((feature, index) => {
            const isCluster = feature.properties.cluster ? true : false;
            let el = document.createElement('div');
            let marker = null;
            if (isCluster) {
                const count = feature.properties.point_count;
                let className = '';
                if (count > 50) {
                    className = 'extraLarge';
                } else if (count > 25) {
                    className = 'large';
                } else if (count > 15) {
                    className = 'medium';
                } else if (count > 10) {
                    className = 'small';
                } else {
                    className = 'extraSmall';
                }
                const html = `<div class='cluster ${className}' tabindex = '0' >${feature.properties.point_count_abbreviated}</div>`;
                el.innerHTML = html;
                marker = new mapboxgl.Marker(el);
                this.clusters[feature.properties.cluster_id] = marker;
                marker.setLngLat(feature.geometry.coordinates).addTo(this._map);
            } else {
                el.innerHTML = `<div class='marker' tabindex='0'></div>`;
                marker = new mapboxgl.Marker(el);
                marker.setLngLat(feature.geometry.coordinates).addTo(this._map);
                this.markers.push(marker);
            }
        });
    }
}


