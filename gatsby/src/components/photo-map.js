import Dimensions from './dimensions';
import Icon from 'react-fontawesome';
import React from 'react';
import css from './photo-map.module.css';
import cx from 'classnames';
import faStyles from 'font-awesome/css/font-awesome.css';

const getPixelCoords = ([lat, long], coord0, coord1) => {
    const {pixel: [ x0, y0 ], latlong: [ lat0, long0 ] } = coord0;
    const {pixel: [ x1, y1 ], latlong: [ lat1, long1 ] } = coord1;

    const xScale = (x1 - x0) / (long1 - long0);

    const yScale = (y1 - y0) / (lat1 - lat0);

    const xOffset = x0 - long0 * xScale;
    const yOffset = y0 - lat0 * yScale;

    const x = long * xScale + xOffset;
    const y = lat * yScale + yOffset;

    return [x,y];
};

export class PhotoMap extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            zoomPhotoIndex: -1,
            fixClipping: false
        };
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({fixClipping: true});
        }, 1500);
    }

    handleClickPhoto = (index) => {
        this.setState({
            zoomPhotoIndex: index
        });
    }

    handleClickClose = () => {
        this.setState({
            zoomPhotoIndex: -1
        });
    }

    handleKeyPress = (e) => {
        this.setState(({zoomPhotoIndex}) => {
            const delta = e.keyCode === 37 ? -1 : 1;
            const maxIndex = this.props.photos.length - 1;
            if(e.keyCode === 27) {
                return { zoomPhotoIndex: -1 };
            }
            return { zoomPhotoIndex: zoomPhotoIndex + delta < 0
                ? maxIndex
                : zoomPhotoIndex + delta > maxIndex
                    ? 0
                    : zoomPhotoIndex + delta
            };
        });
    }

    handleClickRoot = () => {
        document.addEventListener("keyup", this.handleKeyPress);
    }

    renderCaption () {
        if(this.state.zoomPhotoIndex >= 0) {
            const { locationName, time, blurb } = this.props.photos[this.state.zoomPhotoIndex];
            return (
                <div className={css.caption}>
                    <h4 className={css.location}>
                        {time || "Unknown"}
                        {" "}<Icon name="map-marker"/> {locationName || "Unknown"}
                    </h4>
                    {" "}<span className={css.blurb}>{blurb}</span>
                </div>
            );
        }
    }

    renderPhoto = ({src, latlong }, index) => {
        const [width, height] = this.props.mapSize.pixel;
        const { zoomPhotoIndex, fixClipping } = this.state;
        const [x,y] = getPixelCoords(latlong, this.props.mapCoords[0], this.props.mapCoords[1]);

        const photoWidth = width / 25;

        const xOffset = fixClipping && (x/width) + (photoWidth / this.containerWidth) > 1
            ? -(photoWidth/this.containerWidth)
            : 0;
        const yOffset = fixClipping && (y/height) + (photoWidth / this.containerWidth) > 1
            ? -(photoWidth/this.containerWidth)
            : 0;

        const left = `${(x / width + xOffset) * 100}%`;
        const top = `${(y / height + yOffset) * 100}%`;

        return (
            <div
                key={src}
                className={cx(css.photoThumb, {[css.__zoom]: zoomPhotoIndex === index})}
                style={zoomPhotoIndex === index ? {} : {
                    width: `${photoWidth}px`,
                    height: `${photoWidth}px`,
                    left: left,
                    top: top,
                }}
                onClick={() => this.handleClickPhoto(index)}
            >
                <div className={css.photo} style={{backgroundImage: `url(${src})`}}/>
            </div>
        );
    }

    renderWithDimensions = ({width, height}) => {
        const { photos, mapImage, mapSize } = this.props;

        const [ mapWidth, mapHeight ] = this.props.mapSize.pixel;
        const xRatio = width / mapWidth;

        this.containerWidth = width;

        return (
            <div onClick={this.handleClickRoot}>
                <div
                    className={cx(css.PhotoMap, {[css.__zoom]: this.state.zoomPhotoIndex >= 0})}
                    style={{
                        backgroundImage: `url(${mapImage})`,
                        width: `100%`,
                        height: `${mapHeight * xRatio}px`,
                    }}
                >
                    {photos.map(this.renderPhoto)}
                    {this.state.zoomPhotoIndex >= 0 ? (
                        <div
                            className={css.closeButton}
                            onClick={this.handleClickClose}
                        >&times;</div>
                    ) : null}
                    <div className={css.backdrop}/>
                </div>
                {this.renderCaption()}
            </div>
        );
    }

    render () {
        return <Dimensions>{this.renderWithDimensions}</Dimensions>;
    }
}

