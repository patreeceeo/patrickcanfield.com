import Dimensions from './dimensions';
import EXIF from 'exif-js';
import Helmet from 'react-helmet';
import Image from '../Image';
import React from 'react';
import ReactDOM from 'react-dom';
import css from './photo-map2.module.css';
import cx from 'classnames';
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

const getCenter = (exifs) => {
    return [
        sum(exifs.map(({
            GPSLongitudeRef,
            GPSLongitude
        }) => {
            return mapRefToSign[GPSLongitudeRef] * convertToDecimalDegrees(GPSLongitude);
        })) / exifs.length,

        sum(exifs.map(({
            GPSLatitudeRef,
            GPSLatitude
        }) => {
            return mapRefToSign[GPSLatitudeRef] * convertToDecimalDegrees(GPSLatitude);
        })) / exifs.length
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

export class PhotoMap2 extends React.Component {

    static defaultProps = {
        aspectRatio: 1
    }

    componentDidMount () {
        this.renderMap();
    }

    renderPhoto (index) {
        const { src } = this.props.photos[index];
        return (
            <img className={css.photo} src={src}/>
        );
    }

    getDOMPhoto (index) {
        const div = document.createElement("div");
        div.classList.add(css.PhotoMarker);
        ReactDOM.render(this.renderPhoto(index), div);
        return div;
    }

    renderMap () {
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
            this.exifs = exifs;
            this.map = new mapboxgl.Map({
                container: this.mapContainer,
                style: 'mapbox://styles/mapbox/light-v9',
                center: getCenter(exifs),
                zoom: 15
            });

            exifs.forEach(({
                GPSLatitudeRef,
                GPSLatitude,
                GPSLongitudeRef,
                GPSLongitude
            }, index) => {
                new mapboxgl.Marker(this.getDOMPhoto(index)).setLngLat([
                    mapRefToSign[GPSLongitudeRef] * convertToDecimalDegrees(GPSLongitude),
                    mapRefToSign[GPSLatitudeRef] * convertToDecimalDegrees(GPSLatitude)
                ]).addTo(this.map);
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

