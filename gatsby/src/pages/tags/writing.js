import React from 'react';
import IndexPage from '../../components/index-page';
import Tabs from '../../components/tags-tabs';

const WritingIndex = ({data}) => {
    return (
        <IndexPage
            data={data}
        >
            <Tabs selected="writing"/>
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

