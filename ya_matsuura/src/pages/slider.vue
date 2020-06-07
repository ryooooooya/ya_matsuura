<template>
  <main class="main">
    <div class="slider-list">
      <figure claSS="slide">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/img5.jpeg" alt="Sky">
      </figure>
      <figure claSS="slide">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/img4.jpeg" alt="Rain">
      </figure>
      <figure claSS="slide">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/img2.jpeg" alt="Ocean">
      </figure>
      <figure claSS="slide">
        <img src="https://source.unsplash.com/random" alt="Ocean">
      </figure>
      <figure claSS="slide">
        <img src="https://source.unsplash.com/user/erondu" alt="Ocean">
      </figure>
    </div>
    <div class="controller">
      <button class="prev" @click="prev" disabled="true">＜</button>
      <button class="next" @click="next">＞</button>
    </div>
 </main>
</template>

<script>

export default {
  mounted(){
    this.zindex()
    // this.addViewFirst()
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
    addViewFirst() {
      setTimeout(function(){
        const slide = document.getElementsByClassName('slide')
        slide[0].classList.add("-viewed")
      }, 500)
      setTimeout(function(){
        const slide = document.getElementsByClassName('slide')
        slide[0].setAttribute("style", "z-index:0")
      }, 1500)
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
        let index = slide.indexOf( viewedEle[0] )

        const viewedNextEle = viewedEle[0].nextElementSibling
        viewedEle[0].classList.remove("-viewed")
        viewedNextEle.classList.add("-viewed")

        controller[0].classList.add("-disable")

        setTimeout(function(){
          viewedEle[0].setAttribute("style", "z-index:0")
          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")

          index = slide.indexOf( viewedEle[0] )
          buttonPrev[0].removeAttribute("disabled")
          if(index === slide.length - 1) {
            buttonNext[0].setAttribute("disabled", true)
          }
        }, 1000)
      }
      // 最初
      else if(document.getElementsByClassName('-viewed').length === 0 &&
      document.getElementsByClassName('-back').length === 0) {
        const slideFst = document.getElementsByClassName('slide')
        slideFst[0].classList.add("-viewed")

        controller[0].classList.add("-disable")

        setTimeout(function(){
          slideFst[0].setAttribute("style", "z-index:0")

          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")
          buttonPrev[0].removeAttribute("disabled")
        }, 1000)
      }
      // -viewedなし
      else {
        const backedEle = document.getElementsByClassName('-back')
        backedEle[0].classList.replace("-back", "-viewed")

        controller[0].classList.add("-disable")

        setTimeout(function(){
          const viewedEle = document.getElementsByClassName('-viewed')
          viewedEle[0].setAttribute("style", "z-index:0")
          buttonPrev[0].removeAttribute("disabled")

          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")
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
        let slide = document.getElementsByTagName("figure")
        const viewedEle = document.getElementsByClassName('-viewed')
        slide = [].slice.call( slide )
        const index = slide.indexOf( viewedEle[0] )
        const indexNum = slide.length - index
        viewedEle[0].setAttribute("style", "z-index:" + indexNum)

        viewedEle[0].classList.replace("-viewed", "-back")
        buttonNext[0].removeAttribute("disabled")

        controller[0].classList.add("-disable")

        setTimeout(function(){
          const backEle = document.getElementsByClassName('-back')
          const index = slide.indexOf( backEle[0] )

          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")
          console.error("fst"+index)
          if(index === 1) {
            buttonPrev[0].setAttribute("disabled", true)
          }
        }, 1000)
      }
      // -viewedなし : 連続戻り
      else {
        const backedEle = document.getElementsByClassName('-back')
        const backedPrevEle = backedEle[0].previousElementSibling
        backedEle[0].classList.remove("-back")
        backedPrevEle.classList.add("-back")

        controller[0].classList.add("-disable")

        let slide = document.getElementsByTagName("figure")
        slide =  [].slice.call( slide )
        const index = slide.indexOf( backedEle[0] )
        const indexNum = slide.length - index
        backedPrevEle.setAttribute("style", "z-index:" + indexNum)

        setTimeout(function(){
          const disableEle = document.getElementsByClassName('-disable')
          disableEle[0].classList.remove("-disable")

          const backEle = document.getElementsByClassName('-back')
          const index = slide.indexOf( backEle[0] )
          console.error("renzoku"+index)
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
.main{
  position: relative;
  width: 100%;
  height: 100vh;
  .slider-list{
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    width: 640px;
    height: 480px;
    transform: translate(-50%, -50%);
    > .slide{
      position: relative;
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      z-index: 4000;
      > img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &:nth-child(n+2){
        margin-top: -480px;
      }
      // js
      &.-viewed{
        animation: 1s ease 0s 1 normal both running viewed;
      }
      &.-back{
        animation: 1s ease 0s 1 normal both running back;
      }
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
