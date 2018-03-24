import React from 'react';
import IndexPage from '../../components/index-page';
import FilterPosts from '../../components/filter-posts';

const WritingIndex = ({data}) => {
    return (
        <IndexPage
            data={data}
        >
            <FilterPosts query={{tag: "writing"}} />
        </IndexPage>
    );
};

export default WritingIndex;

export const pageQuery = graphql`
  query WrittenQuery {
    allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { tags: { in: ["writing"] } } }
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

