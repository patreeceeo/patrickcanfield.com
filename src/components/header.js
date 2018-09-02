import React from 'react';
import meImg from '../me-np.png';
import css from './index-page.module.css';

const Header = ({children}) => {
    return (
        <div className={css.Header}>
            <a href="https://patrickcanfield.com"><img src={meImg} className={css.Header_photo} /></a>
            <div>
                <h2 className={css.Title}>Patrick Canfield</h2>
                <h3 className={css.Subtitle}>@patreeceeo</h3>
                {children}
            </div>
        </div>
    );
};

export default Header;
