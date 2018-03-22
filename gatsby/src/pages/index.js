import React from 'react';
import IndexPage from '../components/index-page';

const AllIndex = ({data}) => {
    return (
        <IndexPage
            data={data}
            blurb="Maximalist and aspiring minimalist"
        />
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

