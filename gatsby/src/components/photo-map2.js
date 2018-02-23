import Dimensions from './dimensions';
import { DBSCAN } from 'density-clustering';
import EXIF from 'exif-js';
import Image from '../Image';
import React from 'react';
import ReactDOM from 'react-dom';
import css from './photo-map2.module.css';
import cx from 'classnames';
import throttle from 'lodash.throttle';
import mapboxgl from 'mapbox-gl';
import sum from 'lodash.sum';
import max from 'lodash.maxby';
import min from 'lodash.minby';

mapboxgl.accessToken = 'pk.eyJ1IjoicHNjYWxlMDEiLCJhIjoiY2pkcWI5NzVhMDJvdTJxbzlrcDRoOTVhayJ9.fCWGc7YYwB0bz9Dc8AloNA';

const mapRefToSign = {
    N: 1,
    S: -1,
    E: 1,
    W: -1
};

const convertToDecimalDegrees = ([degrees, minutes, seconds]) => {
    return degrees + minutes / 60 + seconds / (60 * 60);
};

const convertExifToLngLat = ({
    GPSLongitudeRef,
    GPSLongitude,
    GPSLatitudeRef,
    GPSLatitude
}) => {
    return [
        mapRefToSign[GPSLongitudeRef] * convertToDecimalDegrees(GPSLongitude),
        mapRefToSign[GPSLatitudeRef] * convertToDecimalDegrees(GPSLatitude)
    ];
};

// TODO: refactor in terms of convertExifToLngLat?
const getCenter = (exifs) => {
    const lngLats = exifs.map(convertExifToLngLat);
    return [
        sum(lngLats.map(([lng, lat]) => lng)) / lngLats.length,
        sum(lngLats.map(([lng, lat]) => lat)) / lngLats.length,
    ];
};

const getBounds = (exifs) => {
    const lngLats = exifs.map(({GPSLatitude, GPSLongitude}) => [
        convertToDecimalDegrees(GPSLongitude),
        convertToDecimalDegrees(GPSLatitude)
    ]);
    return [
        max(lngLats, ([lng, lat]) => Math.sqrt(lng * lng + lat * lat)),
        min(lngLats, ([lng, lat]) => Math.sqrt(lng * lng + lat * lat))
    ];
};

const findClusters = (exifs, photos, map) => {
    const clustering = new DBSCAN();

    const lngLats = exifs.map(convertExifToLngLat);

    // Where does 23 come from? Trial and error.
    const neighborhoodRadius = 23 / map.transform.scale;
    const lngLatClusters = clustering.run(lngLats, neighborhoodRadius, 1);

    return lngLatClusters.reduce((memo, indexes) => {
        const clusterExifs = indexes.map((i) => exifs[i]);
        const clusterPhotos = indexes.map((i) => photos[i]);
        return [...memo, {
            centerLngLat: getCenter(clusterExifs),
            photos: clusterPhotos
        }];
    }, []);
};

export class PhotoMap2 extends React.Component {

    static defaultProps = {
        aspectRatio: 1
    }

    componentDidMount () {
        this.renderMap();
    }

    addMarkersToMap (exifs, map) {
        const clusters = findClusters(exifs, this.props.photos, map);

        this.markers = clusters
            .map(this.createMarkerForCluster);
        this.markers.map((marker) => marker.addTo(map));
    }

    handleMapMove = throttle((event, exifs) => {
        this.markers.forEach((marker) => marker.remove());
        this.addMarkersToMap(exifs, event.target);
    }, 200)

    createMarkerForCluster = ({centerLngLat, photos}) => {
        const marker = new mapboxgl.Marker(this.getDOMPhotoMarker(photos));
        marker.setLngLat(centerLngLat);
        return marker;
    }

    renderPhotos (photos) {
        const { src } = photos[0];
        return (
            <React.Fragment>
                <img className={css.photo} src={src}/>
                {photos.length > 1 && (
                    <div className={css.cornerbox}>
                        +{photos.length - 1}
                    </div>
                )}
            </React.Fragment>
        );
    }

    getDOMPhotoMarker (photos) {
        const div = document.createElement("div");
        div.classList.add(css.PhotoMarker);
        ReactDOM.render(this.renderPhotos(photos), div);
        return div;
    }

    renderMap () {
        // Not sure what zoom should be yet.
        const zoom = 15;
        const promises = this.props.photos.map(({src}) => {
            const img = new Image(1,1);
            const promise = new Promise((resolve) => {
                img.onload = () => {
                    EXIF.getData(img, function () {
                        resolve(EXIF.getAllTags(this));
                    });
                };
            });
            img.src = src;
            return promise;
        });

        Promise.all(promises).then((exifs) => {
            const map = new mapboxgl.Map({
                container: this.mapContainer,
                style: 'mapbox://styles/mapbox/light-v9',
                center: getCenter(exifs),
                zoom: zoom
            });

            this.addMarkersToMap(exifs, map);

            map.on("move", (event) => {
                this.handleMapMove(event, exifs);
            });
        });
    }

    renderWithDimensions = ({width}) => {
        return (
            <div
                ref={el => this.mapContainer = el} style={{height: `${width/this.props.aspectRatio}px`}}
                className={cx(css.PhotoMap)}
            />
        );
    }

    render () {
        return <Dimensions onResize={this.onDimensionsChange}>{this.renderWithDimensions}</Dimensions>;
    }
}

