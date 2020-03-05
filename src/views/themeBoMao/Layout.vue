<template lang="pug">
div
  LayoutHeader
  router-view
  LayoutFooter
  //- 彈窗公告
  Announcement
  //- 快速聯絡我們
  QuickContact(:isLogin="isLogin")
  //- 紅包雨按鈕
  mammon-float(v-if="showMammon")
  //- 聊天室
  #chat-frame(v-if="webChatEnabled")
    WebChat
</template>

<script>
import LayoutHeader from '@/components/themeBoMao/Layout/Header';
import LayoutFooter from '@/components/themeBoMao/Layout/Footer';
import Announcement from '@/components/themeBoMao/Announcement';
import QuickContact from '@/components/QuickContact';
import MammonFloat from 'components/MammonFloat';
import WebChat from 'components/WebChat';

export default {
  name: 'Index',
  components: {
    LayoutHeader,
    LayoutFooter,
    Announcement,
    QuickContact,
    MammonFloat,
    WebChat
  },
  data() {
    return {
      isLogin: false,
      webChatEnabled: false,
      isCommissioner: Boolean, //是否為計劃專員
      userRoomAccess: Boolean, //使用者是否有訪問聊天室的權限
    }
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    showMammon() {
      return this.appConfig.hasRedRain && !/redRain/.test(this.$route.path);
    },
  },
  watch: {
    '$route' : {
      handler() {
        let lottery = this.$route.path.indexOf('lottery');
        if (lottery == 1) {
          this.webChatEnabled = true
        } else {
          this.webChatEnabled = false
        }
      },
      immediate: true,
    },
  }
}
</script>