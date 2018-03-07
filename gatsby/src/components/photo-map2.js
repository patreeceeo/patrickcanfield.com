const TRANSITION_DURATION_MAP_SHRINK = 250;


import Dimensions from './dimensions';
// TODO: look at using supercluster instead
// https://github.com/mapbox/mapbox-gl-js/issues/4491
// Or Uber's thing
// http://uber.github.io/deck.gl/#/examples/core-layers/icon-layer
import { DBSCAN } from 'density-clustering';
import EXIF from 'exif-js';
import Image from '../Image';
import React from 'react';
import ReactDOM from 'react-dom';
import '../mapbox.overrides.css';
import css from './photo-map2.module.css';
import cx from 'classnames';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import sum from 'lodash.sum';
import max from 'lodash.maxby';
import min from 'lodash.minby';

// Must conditionally import mapboxgl
// because it references `window` which causes
// Gatsby's build process to blow up.
let mapboxgl;
if(typeof window !== 'undefined') {
    mapboxgl = require('mapbox-gl');
} else {
    mapboxgl = {
        Map: function () {},
        Popup: function () {}
    };
}
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
    const lngLats = exifs.map(convertExifToLngLat);
    return [
        [min(lngLats, ([lng, lat]) => lng)[0], min(lngLats, ([lng, lat]) => lat)[1]],
        [max(lngLats, ([lng, lat]) => lng)[0], max(lngLats, ([lng, lat]) => lat)[1]],
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
        return [...memo, {
            centerLngLat: getCenter(clusterExifs),
            clusterIndexes: indexes
        }];
    }, []);
};

export class PhotoMap2 extends React.Component {

    static defaultProps = {
        aspectRatio: 1
    }

    constructor (props) {
        super(props);

        this.exifBySrc = {};
        this.exifList = [];

        this.state = {
            shouldShrinkMap: false,
            enlargedPhotoIndex: -1
        };
    }

    componentDidMount () {
        this.renderMap();
    }

    shouldShrinkMap () {
        return this.state.shouldShrinkMap;
    }

    getEnlargedPhoto () {
        return this.props.photos[this.state.enlargedPhotoIndex];
    }

    addPopupsToMap (exifs) {
        const clusters = findClusters(exifs, this.props.photos, this.map);

        this.popups = clusters
            .map(this.createPopupForCluster);
        this.popups.map((popup) => popup.addTo(this.map));
    }

    handleMapMove = throttle((event, exifs) => {
        this.popups.forEach((popup) => popup.remove());
        this.addPopupsToMap(exifs);
    }, 200).bind(this);

    handleDimensionsChange = debounce(() => {
        if(this.map) {
            this.map.easeTo({center: getCenter(this.exifList)});
        }
    }, 200).bind(this);

    createPopupForCluster = ({centerLngLat, clusterIndexes}) => {
        const popup = new mapboxgl.Popup({
            anchor: 'bottom',
            closeButton: false,
            closeOnClick: false
        });
        popup
            .setDOMContent(this.generatePopupDOM(clusterIndexes))
            .setLngLat(centerLngLat);
        return popup;
    }

    handlePopupClick = (clusterIndexes) => {
        const [topIndex, ...otherIndexes] = clusterIndexes;

        const exifs = clusterIndexes.map((index) => this.exifList[index]);
        const bounds = getBounds(exifs);

        if(this.getEnlargedPhoto()) {
            return;
        }

        this.map.fitBounds(bounds, {
            linear: true,
            padding: this.screenWidth * 0.2,
        });

        if(otherIndexes.length === 0) {
            this.setState({
                shouldShrinkMap: true,
                enlargedPhotoIndex: topIndex
            });
        }
    }

    handleMapClick = () => {
        this.setState({
            shouldShrinkMap: false
        });

        this.map.setZoom(17);
        setTimeout(() => {
            this.setState({
                enlargedPhotoIndex: -1
            });
        }, TRANSITION_DURATION_MAP_SHRINK);
    }

    renderPhotos (clusterIndexes) {
        const topIndex = clusterIndexes[0];
        const { src } = this.props.photos[topIndex];

        return (
            <div
                className={css.PhotoPopup}
                onClick={() => this.handlePopupClick(clusterIndexes)}
            >
                <img className={css.photo} src={src}/>
                {clusterIndexes.length > 1 && (
                    <div className={css.cornerbox}>
                        +{clusterIndexes.length - 1}
                    </div>
                )}
            </div>
        );
    }

    generatePopupDOM (clusterIndexes) {
        const div = document.createElement("div");
        ReactDOM.render(this.renderPhotos(clusterIndexes), div);
        return div;
    }

    renderMap () {
        // Not sure what zoom should be yet.
        const zoom = 14;
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
            this.map = new mapboxgl.Map({
                container: this.mapContainer,
                style: 'mapbox://styles/mapbox/light-v9',
                center: getCenter(exifs),
                zoom: zoom
            });

            this.addPopupsToMap(exifs);

            this.map.on("move", (event) => {
                this.handleMapMove(event, exifs);
            });

            this.exifList = exifs;
        });
    }

    renderWithDimensions = ({width}) => {
        const onMapClick = this.handleMapClick;
        const enlargedPhoto = this.getEnlargedPhoto();

        this.screenWidth = width;

        return (
            <div
                className={cx(css.PhotoMap, {
                    [css.PhotoMap__withEnlargedPhoto]: this.shouldShrinkMap()
                })}
                style={{height: `${width/this.props.aspectRatio}px`}}
            >
                <div
                    className={css.PhotoBox}
                    style={{backgroundImage: enlargedPhoto ? `url(${enlargedPhoto.src})` : 'none'}}
                />
                <div
                    className={css.MapBox}
                    ref={el => this.mapContainer = el}
                    style={{transitionDuration: TRANSITION_DURATION_MAP_SHRINK + 'ms'}}
                >
                    <div className={css.MapGlassCasing}
                        onClick={enlargedPhoto ? onMapClick : undefined}
                    />
                </div>
            </div>
        );
    }

    render () {
        return <Dimensions onResize={this.handleDimensionsChange}>{this.renderWithDimensions}</Dimensions>;
    }
}

