import Header from './header';
import Link from 'gatsby-link';
import React from 'react';
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
        <Header>
            {children}
        </Header>
        <h3>recent posts</h3>
        <Posts data={data} />
    </div>
);

export default IndexPage;
