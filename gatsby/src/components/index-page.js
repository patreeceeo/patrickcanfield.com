import Link from 'gatsby-link';
import React from 'react';
import * as Tabs from './tabs';
import meImg from '../me-np.png';
import css from './index-page.module.css';

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
                                to={`${post.frontmatter.path}/`}
                            >
                                <h2>
                                    {post.frontmatter.title}
                                </h2>
                                <p>{post.excerpt}</p>
                                <div className={css.ReadMore}>read more &raquo;</div>
                            </Link>
                        );
                    })}
                </div>
    );
};

const IndexPage = ({data, children}) => (
    <div>
        <div className={css.Header}>
            <a href="https://patrickcanfield.com"><img src={meImg} className={css.Header_photo} /></a>
            <div>
                <h2 className={css.Title}>Patrick Canfield</h2>
                {children}
            </div>
        </div>
        <h3>recent posts</h3>
        <Posts data={data} />
    </div>
);

export default IndexPage;
