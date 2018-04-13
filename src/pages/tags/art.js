import React from 'react';
import IndexPage from '../../components/index-page';
import FilterPosts from '../../components/filter-posts';

const ArtIndex = ({data}) => {
    return (
        <IndexPage
            data={data}
        >
            <FilterPosts query={{tag: 'art'}}/>
        </IndexPage>
    );
};

export default ArtIndex;

export const pageQuery = graphql`
  query ArtQuery {
    allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { tags: { in: ["art"] } } }
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

