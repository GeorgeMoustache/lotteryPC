<template lang="pug">
  .theme2.theme2-home
    banner(:speed="4000")
    .main
      .layout-wrap
        .cailists
          .cailists-content
            router-link(
              v-for="(item, idx) in hots"
              :key="item.alias"
              :to="{path: `/lottery/${item.alias}`}"
              :title="item.label")
              img(:src="item.popular_img_path")
              p {{item.label}}
        .jclist
          ul.clearfix
            li(v-for="(item, index) in features" :key="index")
              img(:src="item.icon" width="80" height="80")
              h3 {{item.title}}
              p(v-html="item.content")
    //- 彈窗公告
    Announcement
    //- 快速聯絡我們
    QuickContact
</template>

<script>
import LogoBar from 'components/themeMix/Layout/Header/LogoBar';
import NavBar from 'components/themeMix/Layout/Header/NavBar';
import Banner from 'components/themeMix/Banner';
import { mapGetters } from 'vuex';
import { lotteryApi } from '@/api';
import Announcement from 'components/themeMix/Announcement';
import QuickContact from '@/components/QuickContact';

export default {
  name: "Index2",
  components: {
    LogoBar,
    NavBar,
    Banner,
    Announcement,
    QuickContact
  },
  data() {
    return {
      hots: [], // 热门推荐
      features: [
        {
          icon: require("@/assets/themeMix/tpl2/d1.png"),
          title: "超高的赔率",
          content: "行业最优赔率，带给<br />您更多的盈利"
        },
        {
          icon: require("@/assets/themeMix/tpl2/d2.png"),
          title: "丰富的彩种",
          content: "拥有时时彩等丰富的高频彩种<br />同步官网数据，精彩无限"
        },
        {
          icon: require("@/assets/themeMix/tpl2/d3.png"),
          title: "快捷支付",
          content: "支持微信支付宝等一键支付<br />和各种银行入款通道"
        },
        {
          icon: require("@/assets/themeMix/tpl2/d4.png"),
          title: "手机投注",
          content: "所有彩种支持手机投注<br />让您随时随地游戏"
        }
      ],
      showCurtain: true,
    };
  },
  computed: {
    ...mapGetters(["appConfig"])
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      lotteryApi.hots().then(data => {
        const { code, msg, hots } = data;
        if (code != 0) return this.notice(msg, "warning");
        this.hots = hots.splice(0, 8);
      });
      this.$store.dispatch("sideNav");

      //是否顯示對聯(只有模版二有)
      if(this.appConfig.pc_show_curtain){
        this.showCurtain = this.appConfig.pc_show_curtain === '1' ? true : false;
      }
    },
    goPromotion() {
      this.$router.push({ path: "/promotion" });
    },
    goService() {
      window.open(this.appConfig.serviceUrl);
    }
  }
};
</script>

<style lang="scss" scoped>
.theme2-home .main {
  margin-top: -30px;
}

#themeMix .theme2-home.layout-wrap {
  width: 100%;
}
.logo {
  width: 325px;
  display: block;
  float: left;
  text-indent: -9999px;
  height: 108px;
}
.cailists,
.jclist {
  overflow: hidden;
  width: 980px;
  margin: 0 auto 40px;
  color: #4a4a4a;
  line-height: 1;
}
.cailists {
  width: 976px;
  margin-bottom: 20px;
  &-content {
    margin-left: -60px;
    line-height: 1;
  }
  a {
    float: left;
    margin-left: 65px;
    width: 192px;
  }
  img {
    overflow: hidden;
    display: block;
    width: 200px;
    height: 200px;
    background: #eee;
    border-radius: 100%;
    transition: 0.3s;
  }
  a:hover img {
    transform: rotate(360deg);
  }
  p {
    margin: 8px auto 20px;
    text-align: center;
    font-size: 26px;
    line-height: 1.35;
    color: #4a4a4a;
  }
}
.jclist {
  ul {
    margin-left: -60px;
  }
  li {
    float: left;
    width: 200px;
    margin-left: 60px;
    text-align: center;
  }
  h3 {
    margin: 4px 0;
    font-size: 20px;
    line-height: 1.35;
  }
  p {
    font-size: 14px;
    line-height: 1.36;
  }
}
</style>
