
import abaloneImage from '../blog/bikesgiving/abalone.jpg';
import abalone2Image from '../blog/bikesgiving/abalone2.jpg';
import abalone3Image from '../blog/bikesgiving/abalone3.jpg';
import abalone4Image from '../blog/bikesgiving/abalone4.jpg';
import mapImage from '../blog/bikesgiving/map.gif';
import berkeleyImage from '../blog/bikesgiving/berkeley.jpg';
import berkeley2Image from '../blog/bikesgiving/berkeley2.jpg';
import farmroadImage from '../blog/bikesgiving/farmroad.jpg';
import marshallImage from '../blog/bikesgiving/marshall.jpg';
import napaImage from '../blog/bikesgiving/napa.jpg';
import tamviewImage from '../blog/bikesgiving/tamview.jpg';
import pointReyesImage from '../blog/bikesgiving/pointreyes.jpg';
import rodeoImage from '../blog/bikesgiving/rodeo.jpg';
import rodeo2Image from '../blog/bikesgiving/rodeo2.jpg';
import santarosaImage from '../blog/bikesgiving/santarosa.jpg';
import sabastopolImage from '../blog/bikesgiving/sabastopol.jpg';
import stinsonImage from '../blog/bikesgiving/stinson.jpg';
import stinson2Image from '../blog/bikesgiving/stinson2.jpg';

const BikesgivingPhotoMap = {
    mapImage,
    mapCoords: [
        { pixel: [177, 150], latlong: [38.4, -123] },
        { pixel: [1281, 1238], latlong: [37.9, -122.3] }
    ],
    mapSize: { pixel: [1580, 1606]},
    photos: [
        {
            src: berkeley2Image,
            latlong: [37.87, -122.28],
            time: "Thursday, 9am",
            locationName: "Berkeley, CA"
        },
        {
            src: berkeleyImage,
            latlong: [37.87, -122.28],
            locationName: "Berkeley, CA",
            time: "Thursday, 9am",
            blurb: "0.01 miles into the ride! We sorta know what we're getting ourselves in to."
        },
        {
            src: rodeoImage,
            latlong: [38.05, -122.24],
            locationName: "Rodeo, CA",
            time: "Thursday, 11am",
            blurb: ""
        },
        {
            src: rodeo2Image,
            latlong: [38.05, -122.24],
            locationName: "Rodeo, CA",
            time: "Thursday, 11am",
            blurb: ""
        },
        {
            src: napaImage,
            latlong: [38.3, -122.28],
            time: "Thursday, 1pm",
            locationName: "Oxbow Preserve Park, Napa, CA",
            blurb: "Lunchtime! I think at least 30% of my pack is snacks."
        },
        {
            src: santarosaImage,
            latlong: [38.44, -122.59],
            time: "Thursday, 5pm",
            locationName: "Santa Rosa, CA",
            blurb: ""
        },
        {
            src: sabastopolImage,
            latlong: [38.40, -122.84],
            time: "Friday, 10am",
            locationName: "Sabastopol, CA",
            blurb: ""
        },
        {
            src: farmroadImage,
            latlong: [38.28, -122.97],
            time: "Friday, 12:30pm",
            locationName: "Between Occidental and Point Reyes Station, CA",
            blurb: ""
        },
        {
            src: marshallImage,
            latlong: [38.16, -122.94],
            time: "Friday, 2:30pm",
            locationName: "Near Hog Island Oyster Company",
            blurb: "Postlunch naptime"
        },
        {
            src: pointReyesImage,
            latlong: [38.06, -122.8],
            time: "Friday, 3:30pm",
            locationName: "Point Reyes Station, CA",
            blurb: "We decide that's far enough for today, now where to stay??"
        },
        {
            src: abaloneImage,
            latlong: [38.07, -122.83],
            time: "Friday, 5pm",
            locationName: "Abalone Inn",
            blurb: ""
        },
        {
            src: abalone2Image,
            latlong: [38.07, -122.83],
            time: "Friday, 6pm",
            locationName: "Abalone Inn",
            blurb: "Hot tub!"
        },
        {
            src: abalone3Image,
            latlong: [38.07, -122.83],
            time: "Friday, 6pm",
            locationName: "Abalone Inn",
            blurb: "Garden path"
        },
        {
            src: abalone4Image,
            latlong: [38.07, -122.83],
            time: "Friday, 7pm",
            locationName: "Tap Room near Abalone Inn",
            blurb: "Ordered the Heart's Desire then went to bed and immediately passed out"
        },
        {
            src: stinsonImage,
            latlong: [37.90, -122.64],
            time: "Saturday Noon",
            locationName: "Stinson Beach, CA",
            blurb: "Loontime"
        },
        {
            src: stinson2Image,
            latlong: [37.90, -122.64],
            time: "Saturday 1pm",
            locationName: "Stinson Beach, CA",
            blurb: "Naptime"
        },
        {
            src: tamviewImage,
            latlong: [37.92, -122.6],
            locationName: "Mount Tamalpais Summit",
            blurb: "center, far field: Home (San Francisco)"
        },
    ]
};

export {
    BikesgivingPhotoMap
};
