<template lang="pug">
#app
  router-view(v-if="isRouterAlive && !appConfig.ipBlock")
  IE
  IPBlock(v-if="appConfig.ipBlock")
</template>

<script>
import { mapGetters } from "vuex";
import IE from '@/views/IE';
import IPBlock from '@/components/IPBlock';

export default {
  name: 'app',
  components: {
    IE,
    IPBlock
  },
  provide() {
    return {
      reload: this.reload,
      ivNotice: this.ivNotice,
    }
  },
  computed: {
    ...mapGetters(['appConfig']),
    //判斷來源主題
    themeId() {
      let themeMixGroup = ['theme1', 'theme2', 'theme3', 'theme4'];
      let themeName = this.appConfig.themeName;
      if (themeMixGroup.includes(themeName)) {
        return 'themeMix';
      } else {
        return 'BoMao';
      }
    },
    //判斷來源模板
    themeClass() {
      return this.appConfig.themeName;
    }
  },
  created() {
    this.fetchBodyTheme();
    this.setFavicon();
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(()=> {
        this.isRouterAlive = true;
      })
    },
    //共用 iview 通知，type:訊息類型(String); msg:訊息內容; title:訊息標題，如不傳則使用預設值(String)
    ivNotice(type, msg, title) {
      if (!title) {
        title = '系统提示';
      }
      switch (type) {
        case 'success':
          this.$Notice.success({
            title: title,
            desc: msg
          })
          break;
        case 'warning':
          this.$Notice.warning({
            title: title,
            desc: msg
          })
          break
        case 'error':
          this.$Notice.error({
            title: title,
            desc: msg
          })
          break
        default:
          this.$Notice.info({
            title: title,
            desc: msg
          })
          break;
      }
    },
    //將樣式寫入 Body 以完整支援多模版
    fetchBodyTheme() {
      document.body.setAttribute('id', this.themeId);
      document.body.setAttribute('class', this.appConfig.themeName);
    },
    //取得 appIcon 加入頁面 favicon
    setFavicon() {
      let icon = this.appConfig.AppIcon;
      let link = document.getElementById('favicon');
      link.setAttribute('href', icon)
    }
  },
  watch: {
    themeId() {
      this.fetchBodyTheme();
    },
    themeClass() {
      this.fetchBodyTheme();
    }
  }
}
</script>