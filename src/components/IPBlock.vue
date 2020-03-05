<template lang="pug">
#ip-block
  .logo
    img(:src="appConfig.logo" :title="appConfig.AppName")
  .outer
    .inner
      h1 访问限制 FORBIDDEN
      h2 由于您的国家和地区限制，我们无法为您提供服务。给您造成不便，敬请谅解。
      p 若有任何疑问，请点击“客服”与我们的在线客服联系
      p 不便之处，敬请谅解！
    a(:href="appConfig.serviceUrl" target="_blank" v-if="appConfig.serviceUrl != ''") 客服
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'IPBlock',
  computed: {
    ...mapGetters(['appConfig']),
  }
}
</script>

<style lang="scss" scoped>
#ip-block {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 60px 0;
  background: url('~assets/ipblock-bg.png') center center no-repeat;
  background-size: cover;
  .logo {
    width: 1280px;
    height: 70px;
    margin: 0 auto 5% auto;
    img {
      display: block;
      width: auto;
      height: 100%;
    }
  }
  .outer {
    display: flex;
    align-items: flex-start;
    width: 1280px;
    margin: 0 auto;
    &::before {
      content: "";
      display: block;
      width: 115px;
      height: 115px;
      margin-right: 50px;
      background: url('~assets/ipblock-notallow.svg');
      background-size: 100% auto;
    }
    .inner {
      position: relative;
      width: 900px;
      color: #FFF;
      h1 {
        width: 245px;
        margin-bottom: 40px;
        font-size: 40px;
        line-height: 1.3;
      }
      h2 {
        margin-bottom: 10%;
        font-size: 24px;
      }
      p {
        font-size: 18px;
        line-height: 3;
      }
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 100%;
        width: 380px;
        height: 267px;
        margin-top: -50px;
        background: url('~assets/ipblock-img.png');
      }
    }
    a {
      display: block;
      width: 130px;
      height: 130px;
      padding: 15px;
      background: rgba(81, 83, 101, 0.4);
      border-radius: 4px;
      font-size: 16px;
      color: #FFF;
      text-align: center;
      &::before {
        content: "";
        display: block;
        width: 55px;
        height: 62px;
        margin: 0 auto 10px auto;
        background: url('~assets/themeBoMao/header-support-white.svg');
        background-size: 100% auto;
      }
    }
  }
}
</style>