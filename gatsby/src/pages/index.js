import React from 'react';
import Link from 'gatsby-link';
import meImg from '../me-np.png';
import css from './index.module.css';

const Posts = ({data}) => {
    const { edges: posts } = data.allMarkdownRemark;
    return (
        <div className="blog-posts">
            {posts
                    .filter(post => post.node.frontmatter.title.length > 0)
                    .map(({ node: post }) => {
                        return (
                            <Link
                                key={post.id}
                                className={css.PostPreview}
                                to={post.frontmatter.path}
                            >
                                <h2>
                                    {post.frontmatter.title}
                                </h2>
                                <p>{post.excerpt}</p>
                                <Link className={css.ReadMore} to={post.frontmatter.path}>read more &raquo;</Link>
                            </Link>
                        );
                    })}
                </div>
    );
};

const IndexPage = ({data}) => (
    <div>
        <div className={css.Header}>
            <a href="https://patrickcanfield.com"><img src={meImg} className={css.Header_photo} /></a>
            <div>
                <h2 className={css.Title}>Patrick Canfield</h2>
                <h4>art, ideas, hacks, travel, etc.</h4>
            </div>
        </div>
        <hr/>
        <h3>recent posts</h3>
        <Posts data={data} />
    </div>
);

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
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

