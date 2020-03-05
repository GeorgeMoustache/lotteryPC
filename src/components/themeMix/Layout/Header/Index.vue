<template lang="pug">
.layout-header
  TopBar
  LogoBar
  NavBar(v-once)
</template>

<script>
import { mapGetters } from "vuex";
import TopBar from './TopBar';
import LogoBar from './LogoBar';
import NavBar from './NavBar';

export default {
  name: 'LayoutHeader',
  components: {
    TopBar,
    LogoBar,
    NavBar
  },
  data () {
    return {
      isTheme1: false,
      isTheme2: false,
    }
  },
  computed: {
    ...mapGetters(["appConfig"])
  },
  created() {
    //判斷目前使用何種主題
    switch (this.appConfig.themeName) {
      case 'theme1':
        this.isTheme1 = true;
        this.isTheme2 = false;
        break;
      case 'theme2':
        this.isTheme1 = false;
        this.isTheme2 = true;
        break;
      default:
        this.isTheme1 = false;
        this.isTheme2 = false;
        break;
    }
  },
}
</script>
