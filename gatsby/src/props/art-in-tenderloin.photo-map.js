import React from 'react';
import sauerImg from '../blog/art-in-neighborhoods/Anna-Lena_Sauer_at_Adagio.jpg';
import planetImg from '../blog/art-in-neighborhoods/Jennifer_Banzaca__Planet__at_Marker.jpg';
import burnardzhievaImg from '../blog/art-in-neighborhoods/Simona_Burnardzhieva_at_Marker.jpg';
import cherryClarkImg from '../blog/art-in-neighborhoods/Cherry_Clark_at_Mosser.jpg';
import muralImg from '../blog/art-in-neighborhoods/Mural.jpg';
import jacobiImg from '../blog/art-in-neighborhoods/Stephanie_Steiner-Jacobi_at_Mosser.jpg';

const ArtInTenderloinPhotoMap2 = {
    photos: [
        {
            src: sauerImg,
            caption: <span>A piece by <a href="https://www.artspan.org/artist/barbeline" target="_blank">Anna-Lena Sauer</a> @ Adagio</span>
        },
        {
            src: planetImg,
            caption: <span>&ldquo;Planet&rdquo; by <a href="https://www.artspan.org/artist/jbanzaca" target="_blank">Jennifer Banzaca</a> @ The Marker</span>
        },
        {
            src: burnardzhievaImg,
            caption: <span>by <a href="http://www.simoneone.com/" target="_blank">Simona Burnardzhieva</a> @ The Marker</span>
        },
        {
            src: cherryClarkImg,
            caption: <span>by <a href="https://www.artspan.org/artist/CherryClark" target="_blank">Cherry Clark</a> @ Mosser</span>
        },
        {
            src: muralImg,
            caption: "A neighbor mural"
        },
        {
            src: jacobiImg,
            caption: <span>by <a href="http://www.ssjart.com/" target="_blank">Stephanie Steiner Jacobi</a> @ Mosser</span>
        },
    ]
};

export {
    ArtInTenderloinPhotoMap2
};
