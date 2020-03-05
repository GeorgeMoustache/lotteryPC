<template lang="pug">
.mobile-view
  .layout-wrap
    .info
      .app-icon
        img(:src="appConfig.AppIcon")
      h2(v-text="`下载${appConfig.h5Name}APP`")
      h3 [手机登录{{getUrl}}]
      h3 享受随时随地购彩的乐趣！
      .down-wrap
        a(:href="appConfig.IosUrl")
          img.fn-left(src="@/assets/themeMix/mobile-iphone.png")
        a(:href="appConfig.AndroidUrl")
          img.fn-right(src="@/assets/themeMix/mobile-android.png")
      .qrcode-wrap
        .fn-left
          .qrcode-bg
            img(:src="appConfig.Ios2code")
          p IOS客户端
        .fn-right
          .qrcode-bg
            img(:src="appConfig.Android2code")
          p 安卓客户端
      .wapurl-wrap(v-text="getUrl")
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Mobile',
  computed: {
    ...mapGetters(['appConfig']),
    getUrl() {
      let { wsHost = '' } = this.appConfig;
      return wsHost.replace(/(:\d+)$/, '')
    }
  },
}
</script>

<style lang="scss" scoped>


.mobile-view {
  width: auto;
  background: #c81c4f url('~assets/themeMix/mobile-bg.jpg') no-repeat 50% 50%;
  height: 560px;
  font-size: 30px;
  color: #fff;
  @include clearfix();
  .info {
    margin-top: 90px;
    float: right;
    width: 480px;
    margin-right: 60px;
    @include clearfix();
  }
  .app-icon {
    float: left;
    width: 125px;
    height: 137px;
    margin: 10px 0 0 20px;
    img {
      display: block;
      width: 100px;
      height: 100px;
      background: #fff;
      border-radius: 20px;
    }
  }
  h2 {
    font-size: 32px;
  }
  h3 {
    font-size: 20px;
    letter-spacing: 2px;
  }
  .down-wrap {
    clear: both;
    @include clearfix();
  }
  .qrcode-wrap {
    width: 380px;
    margin: 20px auto;
    overflow: hidden;
    font-size: 18px;
    text-align: center;
    .qrcode-bg {
      background: url('~assets/themeMix/mobile-frame.png') no-repeat;
      width: 132px;
      height: 132px;
      padding: 8px;
      box-sizing: border-box;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .wapurl-wrap {
    background: url('~assets/themeMix/mobile-wap.png') no-repeat;
    width: 387px;
    height: 41px;
    margin: 0 auto;
    text-align: left;
    line-height: 41px;
    color: #555;
    padding-left: 10px;
    font-size: 16px;
    margin-top: 20px;
  }
}
</style>
