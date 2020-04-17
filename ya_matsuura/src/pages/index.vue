<template>
  <div class="container">
    <div>
      <h1 class="title">
        sample-nuxt-firebase-contentful
      </h1>
      <h2 class="subtitle">
        This is a sample of Nuxt.js, Firebase hosting and Contentful
      </h2>
      <div class="links">
        <ul>
          <li
            v-for="(article, index) in articles"
            :key="index"
          >
            <nuxt-link
              :to="`/articles/${article.fields.slug}`"
            >
              {{ article.fields.title }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async fetch ({ store, query }) {
    try {
      /**
       * MEMO: query paramを使ってpaginateが可能
       * e.g. http://localhost:3000/?page=10, http://localhost:3000/?page=100 などでアクセス
       */
      const page = query.page ? query.page : 1
      await store.dispatch('article/fetchArticles', { page, limit: 10, category: 'blog' })
    } catch (error) {
      console.error(error)
    }
  },
  computed: {
    ...mapGetters({
      articles: 'article/articles',
    }),
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
