const path = require('path');

exports.createPages = ({ boundActionCreators, graphql }) => {
    const { createPage } = boundActionCreators;

    const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

    // TODO: implement pagination, once I have >1000
    return graphql(`{
        allMarkdownRemark(
          limit: 1000
        ) {
          edges {
            node {
              excerpt(pruneLength: 250)
              html
              id
              frontmatter {
                date
                path
                title
                tags
              }
            }
          }
        }
      }`
    ).then(result => {
        if (result.errors) {
            return Promise.reject(result.errors);
        }

        result.data.allMarkdownRemark.edges
            .forEach(({ node }) => {
                createPage({
                    path: node.frontmatter.path,
                    component: blogPostTemplate,
                    context: {} // additional data can be passed via context
                });
            });
    });
};