<template lang="pug">
.main
  .lottery-title {{$parent.activeTabName}}
  ul.lottery-list
    li.lottery-item(v-for="(item, index) in list" :key="item.alias" v-show="filterItem(item)")
      .card-head
        .icon
          img(:src="item.icon" :alt="item.label")
        .info
          dt(v-text="item.label")
          dd.issue(v-text="`第 ${item.curIssue} 期`")
          dd(v-if="isLoading")
            span.data-loading 加载中...
          dd(v-else)
            clocker.count-down(:time="item.endTime" format="%H：%M：%S" @on-finish="finish(item, index)")
      .card-body
        span 上期开奖
        ul.lottery-balls.ball-xs(v-html="$root.formatOpenNum(item)")
      .card-foot
        .btn-default
          a(@click="openLink(item)") 开奖结果
          a(@click="chartLink(item)") 开奖走势
        a.btn-primary(@click="betLink(item)") 立即投注
</template>

<script>
import { WS } from '@/store/mutation-types';
import clocker from 'components/themeMix/Clocker/index';
import { mapGetters, mapMutations } from 'vuex';
import { lotteryApi } from '@/api';

export default {
  name: "LotteryList",
  components: {
    clocker,
  },
  data() {
    return {
      isLoading: true,
      list: [],
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      websocketMessage: WS.LOTTERY_INFO,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(["getEndTime"]),
    init() {
      this.isLoading = true;
      this.$store.dispatch("lotteryList").then(data => {
        const { code, msg, list } = data;
        if (code != 0) return this.notice(msg, "warning");

        let hotCount = 0; // 热门彩种数量
        // 修复热门彩种的数量
        this.list = list.map(item => {
          if (item.isPopularShow == 1) {
            hotCount += 1;
            if (hotCount > 12) {
              item.isPopularShow == 0;
            }
            return item;
          }
          return item;
        });

        // 延迟获取时间
        setTimeout(() => {
          // TODO: 步进
          this.list = list.map(item => {
            this.getEndTime(item);
            return item;
          });
          this.isLoading = false;
        }, 0);
      });
    },
    /**
     * 筛选显示
     * @param {Object} item 彩种对象
     */
    filterItem(item) {
      const { queryType } = this.$parent;
      const { isPopularShow, groupId } = item;
      // 热门彩种
      if (queryType == null) {
        return isPopularShow == 1;
      }
      return queryType == 0 || groupId == queryType;
    },
    openLink({ alias }) {
      //let path = /(HKSIX|FT)$/.test(alias) ? "trend" : "history";
      this.$router.push({ path: `/drawNotice/${alias}` });
    },
    chartLink(obj) {
      this.$router.push({ path: `/trend/${obj.alias}` });
    },
    betLink(obj) {
      this.$router.push({ path: `/lottery/${obj.alias}` });
    },
    finish(obj, index) {
      obj.openNum = "";
      this.$store.dispatch("refreshIssue", obj);
      setTimeout(() => {
        this.getEndTime(obj);
        this.list.splice(index, 1, obj);
      }, COUNTDOWN_INTERVAL);
    },
    notice(msg, type) {
      this.$Message[type](msg);
    }
  },
  watch: {
    websocketMessage(msg) {
      this.list.map(item => {
        if (item.alias == msg.open_lottery) {
          item.curIssue = Number(msg.open_issue) + 1;
          item.openNum = msg.open_code_list;
          return item;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.lottery-title {
  display: inline-flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  color: #495060;
  font-weight: bold;
  &::before {
    content: "";
    display: block;
    width: 22px;
    height: 22px;
    margin-right: 13px;
    background: url('~assets/themeMix/lottery-title.svg');
  }
}

.lottery-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  min-height: 762px;
  background: #fff;
  padding: 15px 10px;
}

.lottery-item {
  position: relative;
  width: 300px;
  height: 210px;
  margin: 17px 7px;
  padding: 8px;
  background: #fff;
  list-style-type: none;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #c8c8c8;
}

.card-head {
  .icon {
    overflow: hidden;
    float: left;
    margin-right: 26px;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .info {
    dt {
      margin-bottom: 7px;
      font-size: 20px;
      color: #333;
    }
  }
  .issue {
    margin-bottom: 5px;
    font-size: 14px;
    color: #c5352f;
  }
  .data-loading,
  .count-down {
    display: inline-block;
    width: 120px;
    height: 25px;
    border-radius: 3px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  .data-loading {
    font-size: 16px;
    line-height: 23px;
  }
  .count-down {
    font-family: "digital-7";
    font-size: 26px;
    letter-spacing: -1px;
    line-height: 1;
  }
}

.card-body {
  margin: 8px 0;
  white-space: nowrap;
  font-size: 12px;
  color: #707070;
  line-height: 2;
}

.card-foot {
  text-align: center;
  a {
    display: block;
    border-radius: 2px;
    cursor: pointer;
  }
  .btn-default {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    a {
      width: 140px;
      background: #e1e1e1;
      font-size: 12px;
      color: #333;
      line-height: 24px;
    }
  }
  .btn-primary {
    border: 1px solid #d32036;
    font-size: 14px;
    color: #d32036;
    line-height: 34px;
    &:hover {
      background: $primary-type2;
      color: #fff;
    }
  }
}
</style>
