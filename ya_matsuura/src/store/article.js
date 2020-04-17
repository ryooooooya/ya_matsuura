export const SET_ARTICLES = 'SET/ARTICLES'
export const SET_ARTICLE = 'SET/ARTICLE'
export const SET_TOTAL_PAGE = 'SET/TOTAL_PAGE'
export const SET_HTML = 'SET/HTML'
export const contentful = require('contentful')
export const config = {
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN,
  host: process.env.CTF_PREVIEW_HOST || null,
}

export const state = () => ({
  articles: [],
  article: null,
  totalPage: -1,
  html: null,
})

export const mutations = {
  [SET_ARTICLES] (_state, articles) {
    _state.articles = articles
  },
  [SET_ARTICLE] (_state, article) {
    _state.article = article
  },
  [SET_TOTAL_PAGE] (_state, totalPage) {
    _state.totalPage = totalPage
  },
  [SET_HTML] (_state, html) {
    _state.html = html
  },
}

export const getters = {
  articles (state) {
    return state.articles
  },
  article (state) {
    return state.article
  },
  totalPage (state) {
    return state.totalPage
  },
  html (state) {
    return state.html
  },
}

export const actions = {
  async fetchArticles ({ commit }, { page, limit, category }) {
    try {
      /**
       * ページネーションの設定
       */
      const skip = (page - 1) * limit
      const client = contentful.createClient(config)
      const articleParams = {
        content_type: 'blogpost',
        limit,
        skip,
        order: '-sys.createdAt',
      }
      if (category) {
        const categories = await client.getEntries({
          content_type: 'category',
          order: 'sys.createdAt',
          'fields.category': category,
        })
        if (categories.items.length > 0) {
          articleParams['fields.categories.sys.id'] = categories.items[0].sys.id
        }
      }
      const posts = await client.getEntries(articleParams)
      const totalPage = Math.ceil(posts.total / limit)
      commit(SET_ARTICLES, posts.items)
      commit(SET_TOTAL_PAGE, totalPage)
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  },
  async fetchArticle ({ commit }, { slug, md }) {
    try {
      const client = contentful.createClient(config)
      const posts = await client.getEntries({
        content_type: 'blogpost',
        'fields.slug': slug,
      })
      if (posts.items.length > 0) {
        commit(SET_ARTICLE, posts.items[0])
        /**
         * iframe対応
         */
        let html = md.render(posts.items[0].fields.body)
        // replace <iframe
        html = html.replace(/(<p>&ltiframe.)/gi, '<iframe ')
        // replace /iframe>
        html = html.replace(/(&gt&lt\/iframe&gt<\/p>)/gi, '></iframe>')
        // replace " (&quot)
        html = html.replace(/&quot/gi, '"')
        commit(SET_HTML, html)
      } else {
        throw new Error('404 not found')
      }
    } catch (e) {
      throw new Error(e)
    }
  },
  setArticle ({ commit }, { payload, md }) {
    commit(SET_ARTICLE, payload)
    /**
     * iframe対応
     */
    let html = md.render(payload.fields.body)
    // replace <iframe
    html = html.replace(/(<p>&ltiframe.)/gi, '<iframe ')
    // replace /iframe>
    html = html.replace(/(&gt&lt\/iframe&gt<\/p>)/gi, '></iframe>')
    // replace " (&quot)
    html = html.replace(/&quot/gi, '"')
    commit(SET_HTML, html)
  },
}
