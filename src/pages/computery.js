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
          <p>Click <a href='https://patreeceeo.github.io/scatterplot-with-stepper-example/'>here</a> to graphically interact with some data.</p>
          <p>Click <a href='/careforus-v1.pdf'>here</a> to see a UI design I made with Sketch. (Firefox users: Firefox's PDF viewer doesn't render this file correctly, so I reluctantly suggest viewing it with Chrome or another browser.)</p>
        </div>
      );
    }
}

export default Portfolio;
