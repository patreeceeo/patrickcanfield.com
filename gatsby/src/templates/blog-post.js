import React from 'react';
import ReactHTMLParser from 'react-html-parser';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';

import styles from './blog-post.module.css'; // make it pretty!

const makeLoader = (requireContext) => (filePath) => {
    return require.context(requireContext, true)('./' + filePath);
};

export default function Template({
    data // this prop will be injected by the GraphQL query we'll write in a bit
}) {
    const { markdownRemark: post } = data; // data.markdownRemark holds our post data
    return (
        <div className="blog-post-container">
            <Helmet title={`${post.frontmatter.title} - blog`}>
                {/* Twitter Card data */}
                <meta name="twitter:description" content={post.excerpt}/>
                <meta name="twitter:title" content={`${post.frontmatter.title} - Patrick's blog`}/>
                { /* Twitter Summary card images must be at least 120x120px
                <meta name="twitter:image" content="http://www.example.com/image.jpg">
                */}

                {/* Open Graph data */}
                <meta property="og:url" content={`http://patrickcanfield.com${post.frontmatter.path}`} />
                <meta property="og:title" content={`${post.frontmatter.title} - Patrick's blog`} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:site_name" content="Patrick Canfield's blog" />

                {/* for mapbox maps */}
                <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css" rel="stylesheet" />
            </Helmet>
            <div className={styles.blog_post}>
                <h5><Link to="/">&laquo; 🏠 home</Link> &mdash; there's more where that came from.</h5>
                <h1>{post.frontmatter.title}</h1>
                <h4>
                    posted {post.frontmatter.date} in
                    {" "}<i>{post.frontmatter.category || "life, the universe and everything"}</i>
                </h4>
                <div className="blog-post-content">{ReactHTMLParser(post.html, {
                    transform: (node) => { /*eslint-disable-line */
                        const replaceWith = node.attribs && node.attribs['replace-with'];
                        const propsName = node.attribs && node.attribs['props'];
                        if(node.type === "tag") {
                            if(replaceWith) {
                                const componentLoader = makeLoader('../components/index');
                                const propsLoader = makeLoader('../props/index');
                                return React.createElement(
                                    componentLoader(replaceWith),
                                    {
                                        ...propsLoader(propsName + replaceWith),
                                        key: replaceWith
                                    }
                                );
                            }
                        }
                    }
                })}</div>
            </div>
        </div>
    );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 250)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        category
      }
    }
  }
`;
