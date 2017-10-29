import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import './normalize.css';
import './typography.css';

const Header = () => (
  <div
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Gatsby
        </Link>
      </h1>
    </div>
  </div>
);

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      titleTemplate="%s - Patrick Canfield"
      defaultTitle="Patrick Canfield"
      meta={[
        { name: 'description', content: 'Personal site of Patrick Canfield' },
        { name: 'keywords', content: '' },
      ]}
    >
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=YAo0PGOwK0"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=YAo0PGOwK0"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=YAo0PGOwK0"/>
        <link rel="manifest" href="/manifest.json?v=YAo0PGOwK0"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=YAo0PGOwK0" color="#5bbad5"/>
        <link rel="shortcut icon" href="/favicon.ico?v=YAo0PGOwK0"/>
        <meta name="apple-mobile-web-app-title" content="It's me, Patricio"/>
        <meta name="application-name" content="It's me, Patricio"/>
        <meta name="theme-color" content="#ffffff"/>
    </Helmet>
    <Header />
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      {children()}
    </div>
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
