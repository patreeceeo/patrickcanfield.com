module.exports = {
    siteMetadata: {
        title: `Personal site of Patrick Canfield`,
        description: ``,
        siteUrl: `https://patrickcanfield.com`
    },
    plugins: [
        `gatsby-plugin-sharp`, // for gatsby-remark-images
        `gatsby-plugin-react-helmet`,
        {

            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                    {
                      site {
                        siteMetadata {
                          title
                          description
                          siteUrl
                          site_url: siteUrl
                        }
                      }
                    }
                `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => {
                            return allMarkdownRemark.edges.map(edge => {
                                return Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.excerpt,
                                    url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                                    guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                                    custom_elements: [{ 'content:encoded': edge.node.html }],
                                });
                            });
                        },
                        query: `
                            {
                              allMarkdownRemark(
                                limit: 1000,
                                sort: { order: DESC, fields: [frontmatter___date] },
                              ) {
                                edges {
                                  node {
                                    excerpt
                                    html
                                    frontmatter {
                                      title
                                      date
                                      path
                                    }
                                  }
                                }
                              }
                            }
                          `,
                        output: '/rss.xml',
                        feedTitle: 'Blog of Patrick Canfield'
                    }
                ]
            }
        },
        {
            resolve: `gatsby-plugin-typography`,
            options: {
                pathToConfigModule: `src/utils/typography.js`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/blog`,
                name: 'pages',
            },
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    `gatsby-remark-smartypants`,
                    // {
                    //     resolve: `gatsby-remark-images`,
                    //     options: {
                    //         // It's important to specify the maxWidth (in pixels) of
                    //         // the content container as this plugin uses this as the
                    //         // base for generating different widths of each image.
                    //         maxWidth: 800,
                    //         // Remove the default behavior of adding a link to each
                    //         // image.
                    //         linkImagesToOriginal: true,
                    //     },
                    // },
                    {
                        resolve: 'gatsby-remark-copy-linked-files',
                        options: {
                            // `ignoreFileExtensions` defaults to [`png`, `jpg`, `jpeg`, `bmp`, `tiff`]
                            // as we assume you'll use gatsby-remark-images to handle
                            // images in markdown as it automatically creates responsive
                            // versions of images.
                            //
                            // If you'd like to not use gatsby-remark-images and just copy your
                            // original images to the public directory, set
                            // `ignoreFileExtensions` to an empty array.
                            ignoreFileExtensions: [],
                        },
                    }
                ]
            }
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: 'UA-109095087-1',
                // Setting this parameter is optional
                // anonymize: true
            },
        },
    ],
};
