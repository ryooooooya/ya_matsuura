<template>
  <div class="container">
    <div>
      <h1 class="title">
        {{ title }}
      </h1>
      <h2 class="subtitle">
        {{ description }}
      </h2>
      <div
        class="body"
        v-html="html"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async fetch ({ app, store, params, payload }) {
    try {
      if (payload) {
        store.dispatch('article/setArticle', { payload, md: app.$md })
      } else {
        const slug = params.slug ? params.slug : ''
        await store.dispatch('article/fetchArticle', { slug, md: app.$md })
      }
    } catch (error) {
      console.error(error)
    }
  },
  computed: {
    ...mapGetters({
      article: 'article/article',
      html: 'article/html',
    }),
    title () {
      return this.article && this.article.fields && this.article.fields.title
        ? this.article.fields.title
        : 'loading...'
    },
    description () {
      return this.article && this.article.fields && this.article.fields.description
        ? this.article.fields.description
        : ''
    },
    image () {
      return this.article && this.article.fields && this.article.fields.heroImage
        ? `https:${this.article.fields.heroImage.fields.file.url}`
        : ''
    },
  },
  head () {
    const title = `${this.title} | Sample Project`
    const description = this.description
    const image = this.image
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'NUXT FIREBASE SAMPLE SITE',
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website',
        },
      ],
    }
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
  font-weight: 50;
  font-size: 40px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 20;
  font-size: 22px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.body {
  padding-top: 15px;
}
</style>
