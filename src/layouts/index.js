import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import * as icons from '../favicons/index';
import meImg from '../me-np.png';
import doLogoImg from '../digitalocean-logo.svg';
import gatsbyImg from '../gatsby-logo.svg';

import './normalize.css';
import './global.css';
import css from './index.module.css';

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      titleTemplate="%s - Patrick Canfield"
      defaultTitle="Patrick Canfield"
      meta={[
        { name: 'description', content: 'Personal site of Patrick Canfield' },
        { name: 'keywords', content: 'blog personal art technology philosophy food travel' },
      ]}
    >
        <link rel="apple-touch-icon" sizes="180x180" href={icons.appleTouch}/>
        <link rel="icon" type="image/png" sizes="32x32" href={icons.size32}/>
        <link rel="icon" type="image/png" sizes="16x16" href={icons.size16}/>
        <link rel="manifest" href="/manifest.json?v=YAo0PGOwK0"/>
        <link rel="mask-icon" href={icons.safariPinnedTab} color="#5bbad5"/>
        <link rel="shortcut icon" href={icons.icoFormat}/>
        {/* for IndieAuth */}
        <link href="https://github.com/patreeceeo" rel="me"/>

        <meta name="apple-mobile-web-app-title" content="patreeceeo"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="application-name" content="patreeceeo"/>
        <meta name="theme-color" content="#ffffff"/>

        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="Personal site of Patrick Canfield"/>
        <meta name="twitter:creator" content="@patreeceeo"/>

        {/* Open Graph data */}
        <meta property="og:site_name" content="Personal site of Patrick Canfield" />
        <meta property="og:url" content="http://patrickcanfield.com/" />
        <meta property="og:image" content={`http://patrickcanfield.com${meImg}`} />
    </Helmet>
    <div
      style={{
        margin: '1rem auto',
        maxWidth: 800,
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      {children()}
    </div>
    <div className={css.Footer}>
      <p>
        <a href="https://xn--sr8hvo.ws/💇/previous">←</a>
        An IndieWeb Webring 🕸💍 site
        <a href="https://xn--sr8hvo.ws/💇/next">→</a>
      </p>

      <p>
        When was the last time you played &mdash;
        <ul>
          <li><a href="/boggle">&mdash; a puzzle?</a></li>
          <li>&mdash; a platformer? (WIP)</li>
        </ul>
      </p>

      <p>
        Proudly built with <img src={gatsbyImg}/> <a href="https://www.gatsbyjs.org">Gatsby</a> and hosted on <img src={doLogoImg}/> <a href="http://digitalocean.com/">Digital Ocean.</a>
          <div><sub>Copyright &copy; 2018 Patrick Canfield</sub></div>
      </p>
    </div>
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
