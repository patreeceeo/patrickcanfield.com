var plugins = [{
      plugin: require('/Users/patrick/codez/patrickcanfield.com/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/patrick/codez/patrickcanfield.com/node_modules/gatsby-plugin-feed/gatsby-ssr'),
      options: {"plugins":[],"query":"\n                    {\n                      site {\n                        siteMetadata {\n                          title\n                          description\n                          siteUrl\n                          site_url: siteUrl\n                        }\n                      }\n                    }\n                ","feeds":[{"query":"\n                            {\n                              allMarkdownRemark(\n                                limit: 1000,\n                                sort: { order: DESC, fields: [frontmatter___date] },\n                              ) {\n                                edges {\n                                  node {\n                                    excerpt\n                                    html\n                                    frontmatter {\n                                      title\n                                      date\n                                      path\n                                    }\n                                  }\n                                }\n                              }\n                            }\n                          ","output":"/rss.xml","feedTitle":"Blog of Patrick Canfield"}]},
    },{
      plugin: require('/Users/patrick/codez/patrickcanfield.com/node_modules/gatsby-plugin-typography/gatsby-ssr'),
      options: {"plugins":[],"pathToConfigModule":"src/utils/typography.js"},
    },{
      plugin: require('/Users/patrick/codez/patrickcanfield.com/node_modules/gatsby-plugin-google-analytics/gatsby-ssr'),
      options: {"plugins":[],"trackingId":"UA-109095087-1"},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  let results = plugins.map(plugin => {
    if (plugin.plugin[api]) {
      const result = plugin.plugin[api](args, plugin.options)
      return result
    }
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
