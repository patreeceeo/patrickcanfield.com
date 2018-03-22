import React from 'react';
import IndexPage from '../../components/index-page';

const WritingIndex = ({data}) => {
    return (
        <IndexPage
            data={data}
            blurb="The toughest book of all is the one full of blank pages."
        />
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

