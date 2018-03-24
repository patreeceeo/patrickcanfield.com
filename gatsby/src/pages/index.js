import React from 'react';
import IndexPage from '../components/index-page';
import Tabs from '../components/tags-tabs';

const AllIndex = ({data}) => {
    return (
        <IndexPage
            data={data}
        >
            <Tabs selected="all"/>
        </IndexPage>
    );
};

export default AllIndex;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`;

