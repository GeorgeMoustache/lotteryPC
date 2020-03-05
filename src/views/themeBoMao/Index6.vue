<template lang="pug">
.home(v-if="!isLogin")
  //- 大圖輪播
  Carousel.slider(v-if="sliderEnabled" :items="1" :nav="true" :dots="false" :autoplay="true" :autoplayTimeout="4000" :loop="true")
    a(v-for="(item, index) in sliderList" :key="index")
      img(:src="item.src")
  //- 快捷登入窗
  .layout-wrap
    .login 登入
      .outer
        .inner
          img.logo(:src="appConfig.logo")
          Form(ref="form" :model="form" :rules="rules" label-position="right")
            //-userName 標配
            FormItem.id(prop="userName")
              Input(v-model="form.userName" 
                    :placeholder="holder.userName.holderLog" 
                    @on-keyup="onKeyup('userName', $event)")
            //- password
            FormItem.password(prop="password")
              Input(v-model="form.password" type="password" 
                    :placeholder="holder.password.holderLog" 
                    :maxlength="holder.password.maxLength" 
                    @on-keyup="onKeyup('password', $event)")
            //- vcode
            FormItem.verify(prop="vcode" key=0)
              Input(v-model="form.vcode" 
                    :placeholder="holder.vcode.holderLog" 
                    @on-focus="vcodeFocus" 
                    @on-keyup="onKeyup('vcode', $event)" 
                    @keyup.enter.native="handleSubmit('form')")
                img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
            .buttons
              a.submit(@click="handleSubmit('form')") 登录
              router-link.register(:to="{path: '/register'}") 注册
    //- 最新消息
    .notice
      .label 最新消息
      marquee(v-text="noticeMsg")
    //- 快速註冊
    .quick-register(v-if="quickRegEnabled")
      .layout-wrap
        img.logo(:src="appConfig.logo")
        .copyright Copyright © {{appConfig.AppName}} All Rights Reserved. 
          | V{{appConfig.buildVersion}}
        router-link.reg(:to="{path:'/register'}") 立即注册
        a.close(@click="quickRegEnabled = false") 关闭
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { newsApi, lotteryApi } from '@/api';
import Carousel from 'vue-owl-carousel';
import mixin1 from '@/utils/Register_Login/Register_Login';
import mixin2 from '@/utils/Register_Login/regRules_mixin';

export default {
  name: 'Index',
  mixins: [mixin1, mixin2],
  inject: ['ivNotice'],
  components: {
    Carousel,
  },
  data() {
    return {
      //是否已登入
      isLogin: true,

      //大圖輪播參數，需設置開關在 api 拉到資料後再初始化輪播套件不然會錯誤
      sliderEnabled: false,
      sliderList: [],

      //最新消息
      noticeMsg: '',

      //熱門彩種
      lotteryList: [],

      //快速註冊開關
      quickRegEnabled: true,
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      accountInfo: ACCOUNT.ACCOUNTINFO,
    }),
  },
  created() {
    this.fetchUserData();
    this.fetchBanner();
    this.fetchNews();
  },
  methods: {
    //獲取使用者資料
    fetchUserData() {
      this.$store.dispatch('accountInfo').then(data => {
        //如果是遊客或其他不知名狀況
        if (data === 'visitor' || data === '') {
          this.isLogin = false;
          return;
        }

        //變更登入狀態
        this.isLogin = true;

        //獲取第一個熱門彩種並導向該頁
        lotteryApi.hots().then(data => {
          let { code, msg, hots } = data;
          if (code != 0) return this.ivNotice('error', msg);
          this.$router.push({path: `/lottery/${hots[0].alias}`})
        });
      });
    },
    //獲取大圖輪播資料
    fetchBanner() {
      newsApi.banner().then(data => {
        let { code, msg, list } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.sliderList = list;
        this.sliderEnabled = true;
      });
    },
    //獲取最新消息
    fetchNews() {
      newsApi.system().then(data => {
        let { code, msg, notice } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.noticeMsg = notice;
      });
    },
  },
};
</script>