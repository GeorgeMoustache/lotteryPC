<template lang="pug">
.quick_bet(@mouseover="hover($event.target)")
  Tabs.tabs-card-hack(v-if="list.length" v-model="tabIndex" :animated="false")
    TabPane(v-for="(item, index) in list" :key="index" :name="''+index" :label="item.label")
      QuickBetTabItem(:lottery="item")
  p.null-tip(v-else) 加载中...
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import QuickBetTabItem from './QuickBetTabItem';

// 获取玩法
function getMode(category) {
  if (/SSC$/.test(category)) return 'WXZX'; // 五星直选
  // if (/PK10$/.test(category)) return 'Q3ZX'; // 前三直选
  if (/11X5$/.test(category)) return 'SMQ3ZHX'; // 前三直选复式
  if (/[^P]K3$/.test(category)) return 'HZHZ'; // 和值
  // if (/28$/.test(category)) return 'TMTM'; // 特码
  return false;
}

export default {
  name: 'QuickBet',
  components: {
    QuickBetTabItem
  },
  data() {
    return {
      tabIndex: '0',
      list: [],
      labels: []
    };
  },
  computed: {
    ...mapGetters(['requesting', 'error', 'appConfig']),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('lotteryList').then(data => {
        if (data.code != 0) return this.notice(data.msg, 'warning');
        let list = data.list.filter(item => item.isQuick == 1 && getMode(item.alias));
        this.list = list.map(item => {
          item.mode = getMode(item.alias); // 玩法
          this.getEndTime(item); // 倒计时
          return item;
        });
        this.labels = list.map(item => item.label);
      });
    },
    ...mapMutations(['getEndTime']),
    notice(msg, type) {
      this.$Message[type](msg);
    },
    hover(target) {
      if (~target.className.indexOf('ivu-tabs-tab')) {
        let label = target.innerHTML;
        label = label.replace(/<!---->/g, '').trim();
        let index = this.labels.findIndex(item => item == label);
        if (index != -1) {
          this.$nextTick(() => (this.tabIndex = '' + index));
        }
      }
    }
  }
};
</script>

<style lang="scss">
.quick_bet {
  width: 522px;
  .ivu-tabs,
  .null-tip {
    height: 245px;
    background: #fff;
  }
  .null-tip {
    padding: 50px;
    text-align: center;
  }
  .ivu-tabs-nav {
    width: 520px;
  }
  .ivu-tabs-tab {
    width: 20%;
  }
  .tab-content {
    font-size: 14px;
    .hd {
      padding: 10px;
      line-height: 22px;
      a {
        padding: 0 3px;
        color: #666;
        &:hover {
          color: $layout-primary;
        }
      }
    }
    .lottery-issue {
      margin-right: 10px;
      font-size: 18px;
      font-weight: normal;
    }
    .count-down {
      color: #666;
      font-size: 0;
    }
    .count-down-num,
    .count-down-separator {
      font-size: 14px;
    }
    .count-down-num {
      color: $layout-primary;
    }
    .bd {
      margin-bottom: 10px;
    }
    .lottery-icon {
      float: left;
      margin: 0 10px 0 20px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .lottery-balls {
      float: left;
      margin-top: 15px;
    }
    .ft {
      padding: 0 20px 20px;
    }
  }
}
</style>
