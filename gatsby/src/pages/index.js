import React from 'react';
import IndexPage from '../components/index-page';
import FilterPosts from '../components/filter-posts';

const AllIndex = ({data, location}) => {
    return (
        <IndexPage
            data={data}
        >
            <FilterPosts />
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

