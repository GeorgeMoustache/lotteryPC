<template lang="pug">
div
  layout-header.g-head
  .filter
    ul.wrap
      li.filter-item.hot(:class="{'active': queryType == null}" @click="changeHotType") 购彩大厅
        a.refresh 刷新
      li.filter-item(v-for="(item, index) in filterTabs" :key="index" :class="{'active': queryType == item.groupId}" @click="changeType(item)")
        p {{item.groupName}}
  router-view
</template>

<script>
import LayoutHeader from 'components/themeMix/Layout/Header/Index';
import { mapGetters } from 'vuex';
import mixins from 'utils/mixins/bet';

export default {
  name: "LotteryStore",
  components: {
    LayoutHeader,
  },
  mixins: [mixins],
  data() {
    return {
      noticeMsg: "",
      toggle: false,
      loading: false,
      queryType: null,
      activeTabName: "热门彩种",
      filterTabs: this.$root.CATEGORYS
    };
  },
  computed: {
    ...mapGetters(["appConfig"])
  },
  methods: {
    loadSelectMode(toCategory) {
      //載入有紀錄的playType start
      var playType = "";
      if (localStorage.lastModeMap) {
        var lastModeMap = new Map(JSON.parse(localStorage.lastModeMap));
        if (lastModeMap.get(toCategory)) {
          var lastModeDt = new Map(lastModeMap.get(toCategory));
          playType = lastModeDt.get("playType") == null ? "":lastModeDt.get("playType");
          this.$router.push({ path: `/lottery/${toCategory}${playType}` });
        }
      }
    },
    changeType(item) {
      this.queryType = item.groupId;
      this.$router.push({ path: `/lottery/` });
      this.activeTabName = item.groupName;
    },
    changeHotType() {
      this.queryType = null;
      this.$router.push({ path: `/lottery/` });
      this.activeTabName = "热门彩种"
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        var toCategory, fromCategory;
        if (to)
          toCategory = to.path.match(/(?:\/lottery\/)?(\w+)/)? to.path.match(/(?:\/lottery\/)?(\w+)/)[1]: "";
        if (from)
          fromCategory = from.path.match(/(?:\/lottery\/)?(\w+)/)? from.path.match(/(?:\/lottery\/)?(\w+)/)[1]: "";
        if (toCategory != fromCategory) {
          this.loadSelectMode(toCategory);
        }
      },
      immediate: true // 代表在wacth里声明了这个方法之后立即先去执行handler方法
    }
  }
};
</script>

<style lang="scss" scoped>
/* filter */
.filter {
  margin-bottom: 16px;
  background: #fff;
  border-bottom: 1px solid #707070;
  .wrap {
    display: flex;
    width: $layout-wrap-width;
    margin: 0 auto;
  }
  li {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    width: 150px;
    padding-top: 10px;
    border-bottom: 6px solid transparent;
    font-size: 16px;
    color: #707070;
    text-align: center;
    cursor: pointer;
    &::before {
      content: "";
      display: block;
      width: 24px;
      height: 24px;
      margin-right: 12px;
      background: url('~assets/themeMix/lottery-star.svg');
    }
  }
  li.active {
    border-color: #ec917a;
    color: $primary-type2;
    &::before {
      background: url("~assets/themeMix/lottery-star-active.svg");
    }
    .refresh {
      background: url("~assets/themeMix/lottery-refresh-active.svg");
    }
  }
  li.hot::before {
    background:url('~assets/themeMix/lottery-home.svg')
  }
  li.hot.active::before {
    background:url('~assets/themeMix/lottery-home-active.svg')
  }
  .refresh {
    display: block;
    width: 14px;
    height: 15px;
    margin-left: 3px;
    background: url('~assets/themeMix/lottery-refresh.svg');
    text-indent: -9999px;
  }
}

$side-width: 210px;

.lottery_store {
  position: relative;
  margin: 0 auto;
  .logo {
    display: block;
    margin: 15px;
    min-height: 55px;
    max-height: 100px;
    img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
    }
  }
  &-side {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    float: left;
    border: 1px solid #c8c8c8;
    border-top: none;
    width: $side-width;
    background: #fff;
    overflow-y: auto;
  }
  &-main {
    min-width: 1000px;
    position: relative;
    margin-left: $side-width;
    height: 100%;
    background: #f6f6f6;
  }
  &-content {
    position: relative;
    margin: 0 auto;
    // width: 1000px;
    height: 100%;
  }
  &-head {
    position: fixed;
    left: $side-width;
    top: 0;
    right: 0;
    z-index: 500;
  }
  &-body {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: (65 + 34) * 1px;
    &.up {
      padding-top: 0;
    }
  }
  .notice {
    @include clearfix();
    height: 34px;
    line-height: 34px;
    background: #fff;
    .ivu-icon {
      float: left;
      padding: 8px 0 0 5px;
      font-size: 20px;
      color: #999;
    }
    marquee {
      display: block;
      margin-left: 30px;
      cursor: pointer;
      color: #333;
    }
  }
  .toggle-btn {
    position: absolute;
    left: 50%;
    width: 40px;
    margin-left: -19px;
    height: 20px;
    bottom: -20px;
    border: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background: #626262;
    text-align: center;
    color: #f5f5f5;
    font-size: 14px;
    outline: none;
    cursor: pointer;
  }
}

.main,
.lottery_play_wrap {
  width: $layout-wrap-width;
  margin: 0 auto;
}


</style>
