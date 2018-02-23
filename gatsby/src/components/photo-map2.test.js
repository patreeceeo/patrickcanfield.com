/* global jest */
/* global describe */
/* global it */
/* global expect */
jest.mock('mapbox-gl', () => {
    class Marker {
        setLngLat () {
            return this;
        }

        addTo () {
            return this;
        }

        remove () {}
    }

    Marker.prototype.setLngLat = jest.fn(Marker.prototype.setLngLat);

    const mapInstance = {
        events: {},
        on (eventName, callback) {
            this.events[eventName] = callback;
        },
        transform: {
            scale: 12345
        }
    };

    return {
        Map: jest.fn(() => mapInstance),
        Marker,
    };
});

jest.mock('exif-js', () => {
    return {
        getData: (imgElement, callback) => {
            const [
                DateTime,
                GPSLatitudeRef,
                lat,
                GPSLongitudeRef,
                long,
            ] = imgElement.src.split('/');

            callback.call({
                    tags: {
                        DateTime,
                        GPSLatitudeRef,
                        GPSLatitude: lat.split(',').map(Number),
                        GPSLongitudeRef,
                        GPSLongitude: long.split(',').map(Number),
                    }
                });
        },
        getAllTags: ({tags}) => {
            return tags;
        }
    };
});

jest.mock('../Image', () => {
    return function Image () {
        return Object.create(null, {
            src: {
                set: function (value) {
                    this._src = value;
                    this.onload();
                },
                get: function () {
                    return this._src;
                }
            }
        });
    };
});

jest.mock('./dimensions', () => {
    const React = require('react');
    class Dimensions extends React.Component {
        render () {
            return this.props.children({width: 800, height: 0});
        }
    }
    return Dimensions;
});

jest.mock('density-clustering', () => {
    class DBSCAN {
        run (dataset, epsilon, minPts) {
            const lengthMap = [
                [],
                [[0]],
                [[0,1]],
                [[0,1,2]],
                [[0,1,2], [3]],
                [[0,1,2], [3,4]],
                [[0,1,2], [3,4], [5]]
            ];

            return lengthMap[dataset.length];
        }
    }

    return {
        DBSCAN
    };
});

import React from 'react';
import { PhotoMap2 } from './photo-map2';
import mapboxgl from 'mapbox-gl';
import renderer from 'react-test-renderer';

describe("PhotoMap2", () => {
    it("creates mapboxgl.Markers using photo EXIF data", (done) => {
        const photos = [
            {
                src: "2018:02:13 12:44:09/N/37,47,3.12/W/122,24,45.05",
            },
        ];

        renderer.create(<PhotoMap2
            photos={photos}
        />);

        // Necessary.
        // Perhaps because of the promise?
        process.nextTick(() => {
            expect(mapboxgl.Marker.prototype.setLngLat).toHaveBeenCalledWith([
                -1 * (122 + 24 / 60 + 45.05 / (60 * 60)),
                37 + 47 / 60 + 3.12 / (60 * 60)
            ]);
            done();
        });
    });

    it("creates the mapboxgl.Map zoom and center so that all Markers are visible", (done) => {
        const photos = [
            {
                src: "2018:02:13 12:44:09/N/37,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/38,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/38,0,0/W/123,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/37,0,0/W/123,0,0",
            },
        ];

        renderer.create(<PhotoMap2
            photos={photos}
        />);

        process.nextTick(() => {
            expect(mapboxgl.Map).toHaveBeenCalledWith(expect.objectContaining({
                center: [-122.5, 37.5],
                // I don't know what `zoom` should actually be right now.
                zoom: 15
            }));
            done();
        });
    });

    it("maintains specified height/width ratio", () => {
        const component = renderer.create(<PhotoMap2
            photos={[]}
            aspectRatio={1.62}
        />);

        expect(component.toJSON().props.style.height).toBe(`${800/1.62}px`);
    });

    it("clusters photos based on density", (done) => {
        const photos = [
            {
                src: "2018:02:13 12:44:09/N/37,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/38,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/39,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/40,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/41,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/42,0,0/W/122,0,0",
            },
        ];

        renderer.create(<PhotoMap2
            photos={photos}
        />);

        process.nextTick(() => {
            expect(mapboxgl.Marker.prototype.setLngLat).toHaveBeenCalledWith([-122, 38]);
            expect(mapboxgl.Marker.prototype.setLngLat).toHaveBeenCalledWith([-122, 40.5]);
            expect(mapboxgl.Marker.prototype.setLngLat).toHaveBeenCalledWith([-122, 42]);
            done();
        });
    });

    it("re-clusters when the zoom level of the map changes", (done) => {
        const map = new mapboxgl.Map();

        const photos = [
            {
                src: "2018:02:13 12:44:09/N/37,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/38,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/39,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/40,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/41,0,0/W/122,0,0",
            },
            {
                src: "2018:02:13 12:44:09/N/42,0,0/W/122,0,0",
            },
        ];

        renderer.create(<PhotoMap2
            photos={photos}
        />);

        // What does the moveend event object look like?
        process.nextTick(() => {
            mapboxgl.Marker.prototype.setLngLat.mockReset();
            map.events.move({target: map});
            process.nextTick(() => {
                expect(mapboxgl.Marker.prototype.setLngLat).toHaveBeenCalledWith([-122, 38]);
                expect(mapboxgl.Marker.prototype.setLngLat).toHaveBeenCalledWith([-122, 40.5]);
                expect(mapboxgl.Marker.prototype.setLngLat).toHaveBeenCalledWith([-122, 42]);
                done();
            });
        });

    });
});
