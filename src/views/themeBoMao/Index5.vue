<template lang="pug">
.home
  //- 大圖輪播
  Carousel.slider(v-if="sliderEnabled" :items="1" :nav="true" :dots="false" :autoplay="true" :autoplayTimeout="4000" :autoplayHoverPause="true" :loop="true" :stagePadding="340" :center="true")
    a(v-for="(item, index) in sliderList" :key="index" :href="item.url" target="_blank")
      img( :src="item.src")
  .container
    .layout-wrap
      //- 最新消息
      .notice
        .label 最新消息
        marquee(v-text="noticeMsg")
      //- 熱門彩種
      .hot-lottery(v-if="lotteryList.length")
        .sub-title 热门彩种
        ul.list
          li(v-for="item in lotteryList" :key="item.alias")
            router-link(:to="{path: '/lottery/' + item.alias}")
              img(:src="item.popular_img_path")
      //- 优惠活动
      .promotion(v-if="promotionList.length")
        .sub-title 优惠活动
        .list
          dl(v-for="item in promotionList" :key="item.id")
            dt
              router-link(:to="{path: '/promotion/' + item.id }" :style="'background-image: url(' + item.img + ')'")
            dd
              .title {{item.name}}
              p {{item.info}}
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters } from "vuex";
import { newsApi, lotteryApi } from '@/api';
import Carousel from 'vue-owl-carousel';


export default {
  name: 'Index',
  inject: ['ivNotice'],
  components: {
    Carousel
  },
  data() {
    return {
      //大圖輪播參數，需設置開關在 api 拉到資料後再初始化輪播套件不然會錯誤
      sliderEnabled: false,
      sliderList: [],

      //最新消息
      noticeMsg: "",

      //熱門彩種
      lotteryList: [],

      //優惠活動
      promotionList: []
    }
  },
  computed: {
    ...mapGetters({
      appConfig: "appConfig",
      accountInfo: ACCOUNT.ACCOUNTINFO
    })
  },
  created() {
    this.fetchBanner();
    this.fetchNews();
    this.fetchLotteryList();
    this.fetchPromotion();
  },
  methods: {
    //獲取大圖輪播資料
    fetchBanner() {
      newsApi.banner().then(data => {
        let { code, msg, list } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.sliderList = list;
        this.sliderEnabled = true;
      })
    },
    //獲取最新消息
    fetchNews() {
      newsApi.system().then(data => {
        let { code, msg, notice } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.noticeMsg = notice;
      });
    },
    //獲取熱門彩種
    fetchLotteryList() {
      lotteryApi.hots().then(data => {
        let { code, msg, hots } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.lotteryList = hots;
        if (this.lotteryList.length > 12) {
          this.lotteryList.length = 12;
        }
      });
    },
    //獲取優惠活動
    fetchPromotion() {
      newsApi.promotion().then(data => {
        let { code, msg } = data;
        let { activityList } = data.data;
        if (code != 0) return this.ivNotice('error', msg);
        this.promotionList = activityList;
        if (this.promotionList.length > 3) {
          this.promotionList.length = 3;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  //首頁樣式
  .container {
    background: url('~assets/themeBoMao/home-bodybg.png') center center no-repeat;
    background-size: cover;
  }
  .layout-wrap {
    background: rgba(255, 255, 255, 0.85);
    border-radius: 3px 3px 0 0;
    overflow: hidden;
  }

  //最新消息
  .notice {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background: $BoMao-yellow-1;
    font-size: 12px;
    color: $BoMao-text-color;
    .label {
      display: flex;
      align-items: center;
      width: 100px;
      font-size: 14px;
      font-weight: bold;
      &::before {
        content: "";
        display: block;
        width: 20px;
        height: 20px;
        background: url('~assets/themeBoMao/home-notice.svg') center center no-repeat;
      }
    }
  }

  //共用標題樣式
  .sub-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 22px;
    color: $BoMao-text-color;
    &::before {
      content: "";
      display: block;
      width: 4px;
      height: 24px;
      margin-right: 15px;
      background: $BoMao-yellow-1;
      border-radius: 3px;
    }
  }

  //熱門彩種
  .hot-lottery {
    padding: 20px;
    .list {
      display: flex;
      flex-wrap: wrap;
    }
    li {
      width: 24%;
      margin: 0 1.33% 1.33% 0;
    }
    li:nth-child(4n) {
      margin-right: 0;
    }
    @for $i from 1 through 4 {
      li:nth-last-child(#{$i}) {
        margin-bottom: 0;
      }
    }
    a {
      display: block;
      transition: all .3s;
      img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
    a:hover {
      opacity: .6;
    }
  }

  //優惠活動
  .promotion {
    padding: 20px;
    .list {
      display: flex;
    }
    dl {
      width: 33.33%;
      margin-right: 20px;
      background: #FFF;
    }
    dl:last-child {
      margin-right: 0;
    }
    dt {
      overflow: hidden;
      a {
        display: block;
        height: 160px;
        background-position: center center;
        background-size: cover;
        transition: all .3s;
      }
      img {
        display: block;
        width: 100%;
        height: auto;
      }
      a:hover {
        transform: scale(1.1, 1.1);
      }
    }
    dd {
      padding: 10px 20px;
      .title {
        margin-bottom: 5px;
        font-size: 14px;
        color: #2e2f41;
        @include ellipsis();
      }
      p {
        font-size: 12px;
        color: $BoMao-text-color;
        @include ellipsis();
      }
    }
  }
}
</style>