<template lang="pug">
.quick-contact(:class="{theme4: appConfig.themeName == 'theme4'}")
  .wrap
    ul.outer
      li.phone(v-if="qrcode != ''")
        .inner
          .content {{qrcode.content}}
          .qrcode
            img(:src="qrcode.imgSrc")
        .line 我是一條分隔線超沒用的~~~~~
      li(v-for="(item, index) in list" :key="index" :class="item.className" @click="link(item.link)")
        .inner
          .content(v-text="item.content")
          .qrcode(v-if="item.type == 1")
            img(:src="item.qrcode")
        .line 我是一條分隔線超沒用的~~~~~
    BackTop 返回顶部
    a.open-webchat(v-if="chatButtonEnabled" :class="{'active': $parent.webChatEnabled}" @click="openWebChat()") 聊天室
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'QuickContact',
  props: ['isLogin'],
  data() {
    return {
      qrcode: '',
      list: [],
      userRoomAccess: false,
    }
  },
	computed: {
    ...mapGetters(['appConfig']),
    //聊天室按鈕顯示開關
    chatButtonEnabled() {
      let themeName = this.appConfig.themeName;
      //判斷模板 模板5、6
      if (themeName == 'theme5' || themeName == 'theme6') {
        //判斷已登入且聊天室總開關開啟
        if (this.isLogin && this.appConfig.hasChat == 1) {
          return true
        } else {
          return false
        }
      } else {
        return false;
      }
    }
  },
  created() {
    this.initSideBar();
  },
  methods: {
    //初始化浮動客服視窗內容
    initSideBar() {
      if (this.appConfig.sideBar.qrcode) {
        this.qrcode = this.appConfig.sideBar.qrcode;
      }
      this.list = this.appConfig.sideBar.list;
      this.list.forEach(item => {
        switch (item.type) {
          case 2:
            item.className = 'tel';
            break;
          case 3:
            item.className = 'wechat';
            break;
          case 4:
            item.className = 'qq';
            break;
          default:
            break;
        }
      })  
    },
    //客服新開視窗
    link(link) {
      window.open(link, '客服系统', "width=740, height=660");
    },
    //開啟聊天室
    openWebChat() {
      this.$parent.webChatEnabled = !this.$parent.webChatEnabled;
    }
  }
}
</script>
