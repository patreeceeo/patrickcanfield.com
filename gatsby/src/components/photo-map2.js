import EXIF from 'exif-js';
import Helmet from 'react-helmet';
import Image from '../Image';
import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import sum from 'lodash.sum';

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

export class PhotoMap2 extends React.Component {

    componentDidMount () {
        this.renderMap();
    }

    renderPhoto (index) {
        const div = document.createElement("div");
        ReactDOM.render(<img src={this.props.photos[index].src} style={{maxWidth: "32px"}} />, div);
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
            const map = new mapboxgl.Map({
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
                new mapboxgl.Marker(this.renderPhoto(index)).setLngLat([
                    mapRefToSign[GPSLongitudeRef] * convertToDecimalDegrees(GPSLongitude),
                    mapRefToSign[GPSLatitudeRef] * convertToDecimalDegrees(GPSLatitude)
                ]).addTo(map);
            });
        });
    }

    render () {
        return (
            <div ref={el => this.mapContainer = el} style={{height: '800px'}}/>
        );
    }
}

