import React from 'react';
import IndexPage from '../../components/index-page';
import Tabs from '../../components/tags-tabs';

const VisualIndex = ({data}) => {
    return (
        <IndexPage
            data={data}
        >
            <Tabs selected="visual"/>
        </IndexPage>
    );
};

export default VisualIndex;

export const pageQuery = graphql`
  query VisualQuery {
    allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { tags: { in: ["visual"] } } }
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

