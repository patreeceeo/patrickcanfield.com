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
    }

    Marker.prototype.setLngLat = jest.fn(Marker.prototype.setLngLat);

    return {
        Map: jest.fn(() => ({})),
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
});
