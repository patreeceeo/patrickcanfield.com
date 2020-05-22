import React from 'react';
import meImg from '../me-np.png';
import css from './index-page.module.css';

const Header = ({children}) => {
    return (
        <div className={css.Header}>
            <a href="https://patrickcanfield.com"><img src={meImg} className={css.Header_photo} /></a>
            <div>
              <div className={css.Names}>
                  <h2>Patrick Canfield</h2>
              </div>
              <div className={css.Blurb}>
                {children}
              </div>
            </div>
        </div>
    );
};

export default Header;
