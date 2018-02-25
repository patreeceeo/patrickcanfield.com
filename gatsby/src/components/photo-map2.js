import Dimensions from './dimensions';
// TODO: look at using supercluster instead
// https://github.com/mapbox/mapbox-gl-js/issues/4491
import { DBSCAN } from 'density-clustering';
import EXIF from 'exif-js';
import Image from '../Image';
import React from 'react';
import ReactDOM from 'react-dom';
import '../mapbox.overrides.css';
import css from './photo-map2.module.css';
import cx from 'classnames';
import throttle from 'lodash.throttle';
import mapboxgl from 'mapbox-gl';
import sum from 'lodash.sum';
import max from 'lodash.maxby';
import min from 'lodash.minby';

// TODO: look at macOS's photo map for ideas/inspiration

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

    addPopupsToMap (exifs, map) {
        const clusters = findClusters(exifs, this.props.photos, map);

        this.popups = clusters
            .map(this.createPopupForCluster);
        this.popups.map((popup) => popup.addTo(map));
    }

    handleMapMove = throttle((event, exifs) => {
        this.popups.forEach((popup) => popup.remove());
        this.addPopupsToMap(exifs, event.target);
    }, 200).bind(this)

    createPopupForCluster = ({centerLngLat, photos}) => {
        const popup = new mapboxgl.Popup({
            anchor: 'bottom',
            closeButton: false,
            closeOnClick: false
        });
        popup
            .setDOMContent(this.generatePopupDOM(photos))
            .setLngLat(centerLngLat);
        return popup;
    }

    renderPhotos (photos) {
        const { src } = photos[0];
        return (
            <div className={css.PhotoPopup}>
                <img className={css.photo} src={src}/>
                {photos.length > 1 && (
                    <div className={css.cornerbox}>
                        +{photos.length - 1}
                    </div>
                )}
            </div>
        );
    }

    generatePopupDOM (photos) {
        const div = document.createElement("div");
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

            this.addPopupsToMap(exifs, map);

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

