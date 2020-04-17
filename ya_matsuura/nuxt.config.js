const envPath = `configs/.env.${process.env.ENV || 'development'}`
require('dotenv').config({ path: envPath })
export const contentful = require('contentful')
export const config = {
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN,
  host: process.env.CTF_PREVIEW_HOST || null,
}
const client = contentful.createClient(config)

export default {
  srcDir: 'src/',
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        hid: 'robots',
        name: 'robots',
        content: process.env.META_ROBOTS || 'index',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/sitemap',
    '@nuxtjs/markdownit',
    ['@nuxtjs/google-analytics', {
      id: process.env.GOOGLE_ANALYTICS || '',
    }],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],

  /*
   ** Build configuration
   */
  env: {
    CTF_SPACE_ID: process.env.CTF_SPACE_ID || '',
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN || '',
    CTF_PREVIEW_HOST: process.env.CTF_PREVIEW_HOST || '',
  },

  // [optional] markdownit options
  // See https://github.com/markdown-it/markdown-it
  markdownit: {
    injected: true,
    breaks: true,
  },

  sitemap: {
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date(),
      lastmodrealtime: true,
    },
    path: '/sitemap.xml',
    hostname: process.env.HOST_NAME,
    cacheTime: 1000 * 60 * 60, // 60min
    gzip: true,
    exclude: [
      '/404*', // 404ページは除く
    ],
    routes: async () => {
      // 記事取得
      let hasNextPage = true
      const limit = 50
      let skip = 0
      hasNextPage = true
      skip = 0
      let articleList = []
      const categories = await client.getEntries({
        content_type: 'category',
        order: 'sys.createdAt',
        'fields.category': 'blog',
      })
      const categoriesSysId = categories.items[0].sys.id
      while (hasNextPage) {
        const articleParams = {
          content_type: 'blogPost',
          limit,
          skip,
          order: '-sys.createdAt',
          'fields.categories.sys.id': categoriesSysId,
        }
        const articlePosts = await client.getEntries(articleParams)
        articleList = articleList
          .concat(articlePosts.items)
          .filter((article, index, self) => {
            // 配列の中のarticle objectの重複削除
            return self.findIndex(articleObject => article.fields.slug === articleObject.fields.slug) === index
          })
        hasNextPage = articlePosts.total - (skip + limit) > 0
        skip += limit
      }
      return [
        ...articleList.map((article) => {
          return {
            route: `/articles/${article.fields.slug}`,
            priority: 0.7,
          }
        }),
      ]
    },
  },

  generate: {
    async routes() {
      // 記事取得
      let hasNextPage = true
      const limit = 50
      let skip = 0
      hasNextPage = true
      skip = 0
      let articleList = []
      const categories = await client.getEntries({
        content_type: 'category',
        order: 'sys.createdAt',
        'fields.category': 'blog',
      })
      const categoriesSysId = categories.items[0].sys.id
      while (hasNextPage) {
        const articleParams = {
          content_type: 'blogPost',
          limit,
          skip,
          order: '-sys.createdAt',
          'fields.categories.sys.id': categoriesSysId,
        }
        const articlePosts = await client.getEntries(articleParams)
        articleList = articleList
          .concat(articlePosts.items)
          .filter((article, index, self) => {
            // 配列の中のarticle objectの重複削除
            return self.findIndex(articleObject => article.fields.slug === articleObject.fields.slug) === index
          })
        hasNextPage = articlePosts.total - (skip + limit) > 0
        skip += limit
      }
      return [
        ...articleList.map((article) => {
          return {
            route: `/articles/${article.fields.slug}`,
            payload: article,
          }
        }),
      ]
    },
  },


  /*
   ** Build configuration
   */
  build: {
    publicPath: '/assets/',
    extractCSS: true,
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              targets: isServer
                ? { node: 'current' }
                : { browsers: ['last 2 versions'], ie: 11 },
              corejs: { version: 3 },
            },
          ],
        ]
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        if (!config.module) { return } // undefinedの場合、pushせずにreturnするように追加
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}
