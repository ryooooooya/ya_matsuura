<template>
  <main class="index">
    <!-- nav -->
    <nav class="navigation">
      <h1 class="title">
        ys.ht
      </h1>
      <ul class="list">
        <li class="item">
          <a class="link">ABOUT</a>
        </li>
        <li class="item">
          <a href="" class="link">NOTES</a>
        </li>
        <li class="item">
          <a class="link">CONTACT</a>
        </li>
      </ul>
    </nav>
    <!-- work menu -->
    <section class="work-menu container">
      <ul class="list">
        <li
          v-for="(article, index) in articles"
          :key="index"
          class="item">
            <nuxt-link
              :to="`#${article.fields.slug}`"
              class="link"
            >
            {{ article.fields.title }}
          </nuxt-link>
        </li>
      </ul>
    </section>
    <section class="work-list container">
      <article
        v-for="(article, index) in articles"
        :key="index"
        :id="`#${article.fields.slug}`"
        class="work-item"
      >
        <div class="image">
          <div class="cover-image">
            <img
            :src="`${ article.fields.coverImage.fields.file.url }?w=512`"
            alt=""
          >
          </div>
          <div class="image-list">
            <div
              v-for="image in article.fields.subImage"
              :key="image.fields.file.url"
              class="item"
            >
              <div class="image-wrap">
                <img
                  :src="`${ image.fields.file.url }?fm=webp&w=256`"
                  alt=""
                >
              </div>
            </div>
          </div>
        </div>
        <div class="information">
          <h3 class="title">
            {{ article.fields.title }}
          </h3>
          <div class="caption">
            <dt class="definition">
              Date :
            </dt>
            <dd class="description">
              {{ article.fields.date }}
            </dd>
          </div>
          <div class="caption">
            <dt class="definition">
              Note :
            </dt>
            <dd class="description">
              {{ article.fields.note }}
            </dd>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    // Logo: () => import('@/components/Logo.vue'),
  },
  async fetch ({ store, query }) {
    try {
      /**
       * MEMO: query paramを使ってpaginateが可能
       * e.g. http://localhost:3000/?page=10, http://localhost:3000/?page=100 などでアクセス
       */
      const page = query.page ? query.page : 1
      await store.dispatch('article/fetchArticles', { page, limit: 10, category: 'work' })
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

<style lang="scss" scoped>
// layout
// $content-width:1024px;
.container{
  width: $content-width;
  margin: 0 auto;
}
.link{
  color: #000000;
}

.index{
  position: relative;
  > .navigation{
    position: fixed;
    top: 80px;
    left: 40px;
    width: 100%;
    > .title{
      position: absolute;
      top: 0;
      left: 0;
      font-size: 1.5rem;
      color: #000000;
      letter-spacing: 0.1em;
      line-height: 1.5;
    }
    > .list{
      position: absolute;
      top: 0;
      left: calc(((100% - #{$content-width}) / 2) - 40px);
      display: flex;
      width: $content-width;
      > .item{
        font-size: 1.5rem;
        letter-spacing: 0.1em;
        line-height: 1.5;
        & + .item{
          margin-left: 20px;
        }
      }
    }
  }
  > .work-menu{
    margin-top: 137px;
    > .list{
      display: flex;
      > .item{
        position: relative;
        &::after{
          content: "・";
          position: absolute;
          top: 0;
          right: -1.5em;
        }
        &:last-child{
          &::after{
            display: none;
          }
        }
        & + .item{
          margin-left: 2em;
        }
        > .link{
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          line-height: 2em;
        }
      }
    }
  }
  > .work-list{
    margin-top: 50px;
    margin-bottom: 120px;
    > .work-item{
      & + .work-item{
        margin-top: 60px;
      }
      > .image{
        display: flex;
        > .cover-image{
          width: 512px;
          height: 288px;
          background: #f0f0f0;
          border: 1px solid #ffffff;
          > img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        > .image-list{
          display: flex;
          flex-wrap: wrap;
          // flex-direction: row-reverse;
          width: 512px;
          height: 288px;
          background: #f0f0f0;
          > .item{
            position: relative;
            width: 50%;
            height: 50%;
            background: #f0f0f0;
            border: 1px solid #ffffff;
            > .image-wrap{
              width: 100%;
              height: 100%;
              > img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            &:nth-child(1){
              z-index: 5000;
            }
            &:nth-child(2){
              z-index: 5000;
            }
            &:nth-child(3){
              z-index: 5000;
            }
            &:nth-child(4){
              z-index: 5000;
            }
            &:nth-child(4n+5){
              margin-top: -288px;
            }
            &:nth-child(4n+6){
              margin-top: -288px;
            }
            &:nth-child(4n+7){
              margin-top: -144px;
            }
            &:nth-child(4n+8){
              margin-top: -144px;
            }
          }
        }
      }
      > .information{
        > .title{
          margin-top: 18px;
          font-size: 0.925rem;
          letter-spacing: 0.12em;
          line-height: 1.5;
        }
        > .caption{
          display: flex;
          margin-top: 15px;
          & + .caption{
            margin-top: 0;
          }
          > .definition{
            flex-basis: 48px;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
            line-height: 1.5;
          }
          > .description{
            font-size: 0.8rem;
            letter-spacing: 0.05em;
            line-height: 1.5;
          }
        }
      }
    }
  }
}
</style>
