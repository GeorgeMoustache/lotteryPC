<template lang="pug">
footer(v-if="footerEnabled")
  .layout-wrap
    p 建议使用分辨率：1280以上
    p 建议使用浏览器为:
      span.qq
      span.c360
      span.uc
      span.sogo
    p 郑重提示：彩票有风险，投注需谨慎！ 不向未满18周岁的青少年出售彩票
    p Copyright&copy; {{appConfig.AppName}} Reserved V.{{appConfig.buildVersion}}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LayoutFooter',
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
    }),
    //模板 6 特別設定，首頁需隱藏 Footer
    footerEnabled() {
      if (this.appConfig.themeName == 'theme6' && this.$route.path == '/') {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>