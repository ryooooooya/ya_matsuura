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
          <div class="slider-list">
            <!-- <figure class="slide" /> -->
            <figure
              v-for="image in article.fields.subImage"
              :key="image.fields.file.url"
              class="slide"
            >
              <img
                :src="`${ image.fields.file.url }?fm=webp&w=256`"
                alt=""
              >
            </figure>
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
          <div class="controller">
            <button class="prev" @click="prev" disabled="true">＜</button>
            <button class="next" @click="next">＞</button>
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
  mounted(){
    this.zindex()
  },
  methods: {
    zindex() {
      const slide = document.getElementsByClassName('slide')
      let zindex = 0
      for (let num = 0; num < slide.length; num++) {
        zindex = slide.length - num
        slide[num].setAttribute("style", "z-index:" + zindex)
      }
    },
    // 次へ
    next() {
      const controller = document.getElementsByClassName('controller')
      const buttonNext = document.getElementsByClassName('next')
      const buttonPrev = document.getElementsByClassName('prev')

      // -viewedあり
      if(document.getElementsByClassName('-viewed').length) {
        const viewedEle = document.getElementsByClassName('-viewed')

        let slide = document.getElementsByTagName("figure")
        slide = [].slice.call( slide )
        const index = slide.indexOf( viewedEle[0] )

        const slideAll = document.getElementsByTagName("figure")

        for (let i = 0; i < 4; i++) {
          const viewedDeleteEle = slideAll[index + i]
          const viewedNextEle = slideAll[index + i + 4]
          viewedDeleteEle.classList.remove("-viewed")
          viewedNextEle.classList.add("-viewed")
        }

        controller[0].classList.add("-disable")

        setTimeout(function(){
          for (let i = 0; i < 4; i++) {
            const viewedNextEle = slideAll[index + i + 4]
            viewedNextEle.setAttribute("style", "z-index:0")
          }
          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")

          buttonPrev[0].removeAttribute("disabled")

          const indexEnd = slide.indexOf( viewedEle[3] )
          if(indexEnd === slide.length - 5) {
            buttonNext[0].setAttribute("disabled", true)
          }
        }, 1000)
      }
      // 最初
      else if(document.getElementsByClassName('-viewed').length === 0 &&
      document.getElementsByClassName('-back').length === 0) {
        const slideFst = document.getElementsByClassName('slide')
        for (let i = 0; i < 4; i++) {
          slideFst[i].classList.add("-viewed")
        }
        controller[0].classList.add("-disable")

        setTimeout(function(){
          for (let i = 0; i < 4; i++) {
            slideFst[i].setAttribute("style", "z-index:0")
          }
          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")
          buttonPrev[0].removeAttribute("disabled")
        }, 1000)
      }
      // -viewedなし
      else {
        const backedEle = document.getElementsByClassName('-back')

        let slide = document.getElementsByTagName("figure")
        slide = [].slice.call( slide )
        const index = slide.indexOf( backedEle[0] )

        const slideAll = document.getElementsByTagName("figure")

        for (let i = 0; i < 4; i++) {
          const viewedReplaceEle = slideAll[index + i]
          viewedReplaceEle.classList.replace("-back", "-viewed")
        }

        // backedEle[0].classList.replace("-back", "-viewed")

        controller[0].classList.add("-disable")

        setTimeout(function(){
          const viewedEle = document.getElementsByClassName('-viewed')
          for (let i = 0; i < 4; i++) {
            viewedEle[i].setAttribute("style", "z-index:0")
          }
          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")

          buttonPrev[0].removeAttribute("disabled")

          const indexEnd = slide.indexOf( viewedEle[3] )
          if(indexEnd === slide.length - 5) {
            buttonNext[0].setAttribute("disabled", true)
          }
        }, 1000)
      }
    },
    // 前へ
    prev() {
      const controller = document.getElementsByClassName('controller')
      const buttonNext = document.getElementsByClassName('next')
      const buttonPrev = document.getElementsByClassName('prev')

      // -viewedあり : 戻り始め
      if(document.getElementsByClassName('-viewed').length) {
        const viewedEle = document.getElementsByClassName('-viewed')

        let slide = document.getElementsByTagName("figure")
        slide = [].slice.call( slide )
        const index = slide.indexOf( viewedEle[0] )

        const slideAll = document.getElementsByTagName("figure")

        for (let i = 0; i < 4; i++) {
          const indexNum = slide.length - index - i

          const viewedReplaceEle = slideAll[index + i]

          viewedReplaceEle.setAttribute("style", "z-index:" + indexNum)
          viewedReplaceEle.classList.replace("-viewed", "-back")
        }

        buttonNext[0].removeAttribute("disabled")
        controller[0].classList.add("-disable")

        setTimeout(function(){
          const backEle = document.getElementsByClassName('-back')
          const index = slide.indexOf( backEle[0] )

          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")

          if(index === 0) {
            buttonPrev[0].setAttribute("disabled", true)
          }
        }, 1000)
      }
      // -viewedなし : 連続戻り
      else {
        const backedEle = document.getElementsByClassName('-back')

        let slide = document.getElementsByTagName("figure")
        slide = [].slice.call( slide )
        const index = slide.indexOf( backedEle[0] )

        const slideAll = document.getElementsByTagName("figure")

        for (let i = 0; i < 4; i++) {
          const backDeleteEle = slideAll[index + i]
          const backNextEle = slideAll[index + i - 4]
          backDeleteEle.classList.remove("-back")
          backNextEle.classList.add("-back")

          const indexNum = slide.length - index + 4 - i
          backNextEle.setAttribute("style", "z-index:" + indexNum)
        }

        controller[0].classList.add("-disable")

        setTimeout(function(){
          const backEle = document.getElementsByClassName('-back')
          const index = slide.indexOf( backEle[0] )

          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")

          if(index === 0) {
            buttonPrev[0].setAttribute("disabled", true)
          }
        }, 1000)
      }
    },
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
        > .slider-list{
          position: relative;
          display: flex;
          flex-wrap: wrap;
          width: 512px;
          height: 288px;
          background: #f0f0f0;
          > .slide{
            width: 50%;
            height: 50%;
            background: #f0f0f0;
            border: 1px solid #ffffff;
            > img{
              width: 100%;
              height: 100%;
              object-fit: cover;
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
            // js
            &.-viewed{
              animation: 900ms ease 0s 1 normal both running viewed;
            }
            &.-back{
              animation: 900ms ease 0s 1 normal both running back;
            }
          }
        }
      }
      > .information{
        position: relative;
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
        > .controller{
          position: absolute;
          bottom: 30px;
          left: 50%;
          display: flex;
          transform: translate(-50%, 0);
          &.-disable{
            pointer-events: none;
          }
          > .prev{
            cursor: pointer;
          }
          > .next{
            cursor: pointer;
          }
        }
      }
    }
  }
  @keyframes viewed {
    0% {
      clip-path: inset(0 0 0 0);
    }
    100% {
      clip-path: inset(0 100% 0 0);
    }
  }
  @keyframes back {
    0% {
      clip-path: inset(0 100% 0 0);
    }
    100% {
      clip-path: inset(0 0 0 0);
    }
  }
}
</style>
