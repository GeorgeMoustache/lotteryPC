<template lang="pug">
.navbar(:class="{theme4: appConfig.themeName == 'theme4'}")
  .layout-wrap
    h2.nav.dropdown(v-if="!isTheme2" :class="[{'theme1': isTheme1}, {'home': isHome}]")
      template
        span.text-center
          i.icon-sprite.icon-list
          | 选择彩种
      Icon(type="ios-arrow-down")
      category-nav
    .navs(:class="{theme2: isTheme2}")
      router-link.nav(:to="{path: '/'}" exact title="首页") 首页
      router-link.nav(:to="{path: '/lottery'}" title="购彩大厅") 购彩大厅
      //- 第三方遊戲列表
      template(v-for="item in $root.thirdPartyTab")
        a.nav(:key="item.id" :title="item.showName" @click="thirdPartyLink(item)") {{item.showName}}
      router-link.nav(:to="{path: '/mobile'}" title="手机购彩")
        Icon(type="iphone")
        span 手机购彩
        i.hot-icon
      router-link.nav(:to="{path: '/promotion'}" title="优惠活动")
        span 优惠活动
        i.hot-icon
      router-link.nav(:to="{path: '/drawNotice'}" title="开奖公告") 开奖公告
      router-link.nav(:to="{path: '/trend'}" title="走势图表") 走势图表
</template>

<script>
import CategoryNav from 'components/themeMix/CategoryNav';
import { mapGetters } from 'vuex';

export default {
  name: "NavBar",
  components: {
    CategoryNav
  },
  data() {
    return {
      isTheme1: this.$parent.isTheme1,
      isTheme2: this.$parent.isTheme2,
      isHome: false
    };
  },
  created() {
    //判斷是否在首頁
    this.$route.path == '/' ? this.isHome = true : this.isHome = false;
  },
  computed: {
    ...mapGetters(["appConfig"])
  },
  methods: {
    //判斷第三方狀態執行對應動作
    thirdPartyLink(item) {
      let status = item.status;
      let linkEname = item.linkEname;

      if (status == 99) {
        this.$Modal.info({
          title: '系统提示',
          content: '正在开发中，敬请期待'
        })
      } else {
        this.$router.push({path: '/Game/' + linkEname})
      }
    }
  },
  watch: {
    $route() {
      if(this.$route.path != '/') {
        this.isHome = false;
      } else {
        this.isHome = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  padding: 0 20px;
  background: $layout-primary;
  color: #fff;
  z-index: 20;
  .layout-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1280px;
    &::after {
      display: none;
    }
  }
  .nav {
    position: relative;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 16px;
  }

  .dropdown .ivu-icon {
    margin-left: 20px;
    transition: 0.2s ease-in;
    &:hover .ivu-icon {
      transform: rotate(180deg);
    }
  }
  h2.nav {
    & > span {
      padding-left: px;
    }
    .domain {
      vertical-align: top;
      max-width: 150px;
      max-height: 40px;
      height: auto;
    }
  }

  h2.nav:hover .category_nav {
    display: block;
  }

  h2.nav.theme1.home .category_nav {
    display: block;
    top: 50px;
  }

  .navs {
    float: right;
    @include clearfix();
    .ivu-icon {
      margin-right: 5px;
      font-size: 26px;
      vertical-align: middle;
    }
  }
  .navs.theme2 {
    float: none;
    margin: 0 auto;
  }
  a {
    float: left;
    width: 120px;
    &:hover,
    &.router-link-active {
      background: darken($layout-primary, 8%);
    }
  }
  .hot-icon {
    position: absolute;
    right: 0;
    top: 6px;
    width: 22px;
    height: 18px;
    background: url('~assets/themeMix/navi-hot.gif') no-repeat;
  }
  &.theme4 {
    background: #262732;
    a:hover,
    a.router-link-active {
      background: #343544;
    }
  }
}
</style>