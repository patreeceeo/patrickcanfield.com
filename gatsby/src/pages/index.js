import React from 'react';
import Link from 'gatsby-link';
import meImg from '../me-np.png';
import css from './index.module.css';

const IndexPage = () => (
    <div className={css.Header}>
        <img src={meImg} className={css.Header_photo} />
        <div>
            <h2 className={css.Title}>Patrick Canfield</h2>
            <h4>art, ideas, hacks, travel, etc.</h4>
        </div>
    </div>
);

export default IndexPage;
