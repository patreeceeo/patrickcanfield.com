import React from 'react';
import Link from 'gatsby-link';

class Portfolio extends React.Component {
    render () {
      return (
        <div>
          <p>This is a work in progress.</p>
          <p>Click <Link to='/'>here</Link> to check out my blog.</p>
          <p>Click <Link to='/boggle'>here</Link> to play my version of Boggle.</p>
          <p>Click <Link to='/blog/2018/2/13/art-in-tenderloin/'>here</Link> to see a project I did with Mapbox.</p>
        </div>
      );
    }
}

export default Portfolio;
