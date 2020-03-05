<template lang="pug">
#trend-ball-list(:class="{'active': show}" v-if="trendBallEnabled")
  .back(v-if="appConfig.themeName != 'theme5' && appConfig.themeName != 'theme6'")
    a(@click="show = false")
      Icon(type="chevron-left")
      | 收回
  .tabs
    a(v-for="(item, index) in trendType" :key="index" v-text="item")
  perfect-scrollbar.content
    .range
      RadioGroup(v-model="params.limit" type="button" @on-change="changeLimit($event)")
        Radio(v-for="(item, index) in rangeList" :label="item.limit" :key="index") {{item.title}}
    .section(v-for="(item, index) in trendList" :key="index")
      .title(v-text="index == 0 ? '总和大小' : '总和单双'")
      .total(v-if="index == 0") 累计：大
        span （{{bigBall}}）
        | 小
        span （{{smallBall}}）
        | 总和大小
        span 最新↓
      .total(v-else) 累计：单
        span （{{oddBall}}）
        | 双
        span （{{evenBall}}）
        | 总和单双
        span 最新↓
      perfect-scrollbar.list(:id="`scrollBar${index}`")
        li(v-for="(child, childIdx) in item" :key="childIdx")
          span(v-for="(ball, ballIdx) in child" :key="ballIdx" v-text="ball" :class="ball == '小' || ball == '双' ? 'blue' : 'red'")
</template>

<script>
import { WS } from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  name: 'TrendBallList',
  props: ['category'],
  inject: ['ivNotice'],
  data() {
    return {
      show: false, //路單開關
      trendType: ['总和路单'], //路單類別清單

      //期數範圍
      rangeList: [
        {
          title: '最近30期',
          limit: 30,
        },
        {
          title: '最近50期',
          limit: 50,
        },
        {
          title: '最近100期',
          limit: 100,
        },
        {
          title: '最近200期',
          limit: 200,
        },
      ],

      //球兒的 list
      trendList: [],

      //獲取參數
      params: {
        category: this.category,
        limit: 30,
      },
    };
  },
  computed: {
    ...mapGetters({
      websocketMessage: WS.LOTTERY_INFO,
      appConfig: 'appConfig',
    }),
    //大球
    bigBall() {
      let ballNum = 0;
      this.trendList[0].forEach(item => {
        item.forEach(childItem => {
          if (childItem == '大') {
            ballNum += 1;
          }
        });
      });
      return ballNum;
    },
    //小球
    smallBall() {
      let ballNum = 0;
      this.trendList[0].forEach(item => {
        item.forEach(childItem => {
          if (childItem == '小') {
            ballNum += 1;
          }
        });
      });
      return ballNum;
    },
    //單球
    oddBall() {
      let ballNum = 0;
      this.trendList[1].forEach(item => {
        item.forEach(childItem => {
          if (childItem == '单') {
            ballNum += 1;
          }
        });
      });
      return ballNum;
    },
    //雙球
    evenBall() {
      let ballNum = 0;
      this.trendList[1].forEach(item => {
        item.forEach(childItem => {
          if (childItem == '双') {
            ballNum += 1;
          }
        });
      });
      return ballNum;
    },
    trendBallEnabled() {
      if (this.appConfig.bet_history_analysis == '1') {
        if (/SSC/.test(this.category)) {
          return true
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.appConfig.bet_history_analysis == '1' && /SSC/.test(this.category)) {
        this.params.category = this.category;
        this.fetchTrendList();
      }
    },
    fetchTrendList() {
      this.$store.dispatch('trendData', this.params).then(data => {
        let { code, list } = data;
        if (code != 0) return this.ivNotice('error', '获取路单资料失败');

        let trendList = [[], []];
        let list1 = trendList[0];
        let list2 = trendList[1];
        
        let reverseList = list.reverse();

        reverseList.forEach(item => {
          let openNum = item.openNum.split(',');
          let count = 0;

          //計算號碼總合
          openNum.forEach(item => {
            count += Number(item);
          });

          //判斷大小單雙取得對應資料
          let curItem1 = '';
          let curItem2 = '';

          if (count >= 23) {
            curItem1 = '大';
          } else {
            curItem1 = '小';
          }

          if (count % 2 != 0) {
            curItem2 = '单';
          } else {
            curItem2 = '双';
          }

          if (list1.length == 0) {
            list1.push([curItem1]);
          } else {
            let curIdx = list1.length - 1;
            let curLength = list1[curIdx].length - 1;
            if (list1[curIdx][curLength] != curItem1 || list1[curIdx].length == 8) {
              list1.push([curItem1]);
            } else {
              list1[curIdx].push(curItem1);
            }
          }

          if (list2.length == 0) {
            list2.push([curItem2]);
          } else {
            let curIdx = list2.length - 1;
            let curLength = list2[curIdx].length - 1;
            if (list2[curIdx][curLength] != curItem2 || list2[curIdx].length == 8) {
              list2.push([curItem2]);
            } else {
              list2[curIdx].push(curItem2);
            }
          }
        });
        this.trendList = trendList;
        this.trendList.forEach(item =>{
          if (item.length < 15) {
            item.length = 15;
          }
        })

        this.$nextTick(() => {
          let scrollBar0 = document.getElementById('scrollBar0');
          let scrollBar1 = document.getElementById('scrollBar1');
          scrollBar0.scrollLeft = scrollBar0.scrollWidth;
          scrollBar1.scrollLeft = scrollBar1.scrollWidth;
        });
      });
    },
    //變更顯示期數
    changeLimit(value) {
      this.params.limit = value;
      this.fetchTrendList();
    },
  },
  watch: {
    $route(to) {
      this.init();
    },
    websocketMessage({ open_lottery, open_code_list, open_issue }) {
      if (this.category != open_lottery) return;
      this.fetchTrendList();
    },
  },
};
</script>

<style lang="scss" scoped>
#trend-ball-list {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: #fff;
  font-size: 12px;
  visibility: hidden;
  z-index: 100;
  transform: translateX(-100%);
  transition: all 0.3s;
  z-index: 101;
  &.active {
    visibility: visible;
    transform: translateX(0);
  }
  .back {
    padding: 10px;
    a {
      font-size: 12px;
      color: #495060;
      i {
        margin-right: 10px;
      }
    }
  }
  .tabs {
    padding: 0 20px;
    border-bottom: 1px solid #f2f2f2;
    a {
      display: inline-block;
      padding-bottom: 5px;
      border-bottom: 2px solid #ff454a;
      color: #ff454a;
    }
  }
  .content {
    height: calc(100vh - 300px);
    padding: 20px;
    .range {
      margin-bottom: 30px;
      .ivu-radio-wrapper {
        height: 22px;
        margin-right: 10px;
        padding: 0 10px;
        border-color: #e3e3e3;
        font-size: 12px;
        color: #495060;
        line-height: 22px;
        &::after {
          display: none;
        }
        &.ivu-radio-wrapper-checked {
          background: #f13131;
          color: #fff;
        }
        &.ivu-radio-focus {
          box-shadow: none;
        }
        &:last-child {
          margin: 0;
        }
      }
    }
    .section {
      margin-bottom: 30px;
      .title {
        margin-bottom: 10px;
        font-size: 14px;
        color: #495060;
      }
      .total {
        padding: 7px;
        background: #f2f2f2;
        border: 1px solid #eaeaea;
        color: #495060;
        text-align: right;
        span {
          color: #ff454a;
          &:last-child {
            display: inline-block;
            margin-left: 10px;
          }
        }
      }
      .list {
        display: flex;
        overflow: auto;
        li {
          flex-shrink: 0;
          list-style: none;
          width: 22px;
          height: 172px;
          border-right: 1px solid #eaeaea;
          border-bottom: 1px solid #eaeaea;
          vertical-align: top;
          &:nth-child(even) {
            background: #f8f8f8;
          }
          &:first-child {
            border-left: 1px solid #eaeaea;
          }
          span {
            display: block;
            width: 16px;
            height: 16px;
            margin: 2px auto;
            border-radius: 50%;
            color: #fff;
            line-height: 16px;
            text-align: center;
            &.blue {
              background: #5988f4;
            }
            &.red {
              background: #f13131;
            }
          }
        }
      }
    }
  }
}
</style>