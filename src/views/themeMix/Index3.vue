<template lang="pug">
.theme3.theme3-home
  banner(:speed="4000")
  .main
    .layout-wrap
      .cailists
        .cailists-content
          router-link(
            v-for="(item, idx) in hots"
            :key="item.alias"
            :to="{path: `/lottery/${item.alias}`}"
            :title="item.label"
            )
            img(:src="item.popular_img_path")
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
import Banner from 'components/themeMix/Banner';
import ICountUp from 'vue-countup-v2';
import { mapGetters } from 'vuex';
import { lotteryApi } from '@/api';
import Announcement from 'components/themeMix/Announcement';
import QuickContact from '@/components/QuickContact';

export default {
  name: "Index2",
  components: {
    Banner,
    ICountUp,
    Announcement,
    QuickContact
  },
  data() {
    return {
      hots: [], // 热门推荐
      features: [
        {
          icon: require("@/assets/themeMix/tpl3/d1.png"),
          title: "超高的赔率",
          content: "行业最优赔率，带给<br />您更多的盈利"
        },
        {
          icon: require("@/assets/themeMix/tpl3/d2.png"),
          title: "丰富的彩种",
          content: "拥有时时彩等丰富的高频彩种<br />同步官网数据，精彩无限"
        },
        {
          icon: require("@/assets/themeMix/tpl3/d3.png"),
          title: "快捷支付",
          content: "支持微信支付宝等一键支付<br />和各种银行入款通道"
        },
        {
          icon: require("@/assets/themeMix/tpl3/d4.png"),
          title: "手机投注",
          content: "所有彩种支持手机投注<br />让您随时随地游戏"
        }
      ]
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
        if (code != 0) return this.notice(msg, 'warning');
        this.hots = hots.splice(0, 8);
      });
      this.$store.dispatch("sideNav");
    },
    notice(msg, type) {
      this.$Message[type](msg);
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
#themeMix .theme3-home.layout-wrap {
  width:100%;
}
.main {
  padding-top: 40px;
}
.cailists,
.jclist {
  @include clearfix;
  position: relative;
  margin: 0 auto 40px;
  width: 1040px;
  text-align: center;
  line-height: 1;
  font-size: 0;
}
.cailists {
  .cailists-content {
    display: inline-block;
    font-size: 0;
    line-height: 0;
  }
  a {
    position: relative;
    display: inline-block;
    width: 260px;
    height: 216px;
    transition: all .3s;
  }
  a::after {
    opacity: 0;
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: url('~assets/themeMix/tpl3/home-hover-mask.png');
    transition: all .3s;
  }
  a:hover {
    transform: scale(1.1);
    z-index: 1;
    &::after {
      opacity: 1;
    }
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    background: #eee;
    border: none;
  }
  p {
    text-align: center;
    font-size: 22px;
    line-height: 36px;
    color: #333;
  }
}
.jclist {
  li {
    width: 260px;
    float: left;
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
.ad-w2 {
  overflow: hidden;
  padding-bottom: 35px;
  margin-top: 20px;
  min-width: 1015px;
  background-color: #64656a;
}
.tit-1,
.tit-2,
.tit-3 {
  margin: 40px 0;
  // width: 181px;
  height: 44px;
  background: url('~assets/themeMix/tpl3/tb.png') no-repeat;
}
.tit-1 {
  background-position: 0 0;
}
.tit-2 {
  background-position: -380px 0;
}
.tit-3 {
  background-position: -760px 0;
}
.bottom {
  overflow: hidden;
  min-width: 1015px;
  background-color: #3b3b3b;
}
.foot {
  text-align: center;
  margin: 35px 0 0;
  position: relative;
  .link {
    padding: 10px 0px;
  }
  .copyright {
    margin-top: 40px;
    height: 48px;
    line-height: 48px;
    background: #56565a;
    text-align: center;
    color: #fff;
  }
}
.tit-2 {
  margin-left: 56px;
}
.specdetail {
  overflow: hidden;
  margin-top: 34px;
  margin-left: 56px;
}
.specleft {
  width: 113px;
  float: left;
}
.specleft2 {
  float: left;
}
.specright {
  float: right;
}
.number1 {
  color: #59cdd1;
  line-height: 43px;
  overflow: visible;
  font-size: 30px;
  font-style: normal;
  float: left;
}
.number1txt {
  color: #59cdd1;
  font-size: 14px;
  margin-top: 18px;
  margin-left: 5px;
  float: left;
}
.stats1 {
  border-radius: 6px;
  width: 256px;
  height: 12px;
  overflow: hidden;
  position: relative;
  background-color: #cccccc;
  border-radius: 6px;
}
.stats2 {
  border-radius: 6px;
  top: 0px;
  width: 256px;
  height: 12px;
  right: 200px;
  position: absolute;
  background-color: #c93434;
  border-radius: 6px;
}
.specdetail h1 {
  margin: 0px;
  color: #555555;
  font-size: 18px;
}
.specdetail p {
  color: #fff;
  line-height: 1.33;
  font-size: 12px;
  margin-top: 14px;
}
.specgraph {
  margin-top: 6px;
  margin-left: 56px;
}
.coltxt a {
  color: #ffffff;
}
.cci_title {
  height: 24px;
  color: #fccb75;
  font-size: 18px;
  line-height: 1.33;
  white-space: nowrap;
}
.card_count {
  margin-top: -15px;
}
.cpys {
  width: 290px;
  margin-left: 118px;
  float: left;
  h2 {
    margin-top: 34px;
    font-size: 18px;
    color: #fccb75;
  }
  p {
    margin-top: 14px;
    color: #fff;
    font-size: 12px;
  }
}
</style>
