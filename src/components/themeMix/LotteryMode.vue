<template lang="pug">
.mode-wrap
  template(v-if="lotteryMode.length")
    //- 主mode
    .mode-tab-wrap
      a.prev(v-if="mainMode.prev" @click="mainModePage($event.target.className)") 上一頁
      ul.wrap
        li(v-for="(item, idx) in lotteryMode" :key="item.id" v-show="idx >= mainMode.startIndex && idx < mainMode.endIndex" :class="{active: item.id == modeObj.id}" @click="changeMode(item)") {{item.label}}
      a.next(v-if="mainMode.next" @click="mainModePage($event.target.className)") 下一頁
    //- 次mode
    ul.submode-tab(v-if="!/28$/.test(category)")
      li.tab-item(v-for="item in modeObj.children" :key="item.id" :class="{active: item.alias == mode}" @click="changeMode(item)")
        span.mode-label(v-text="item.label")
    .submode-tab(v-else)
  template(v-else)
    span 加载中
  .mode-help(v-if="help.desc")
    span.desc(v-text="help.desc")
    span(v-if="ratio") 赔率：
      b.text-primary-type2(v-text="ratio")
    Tooltip(v-if="help.example" placement="top")
      span(slot="content" v-html="help.example")
      span.example
        Icon(type="navicon")
        | 范例
    Tooltip(v-if="help.explain" placement="top")
      span(slot="content" v-html="help.explain")
      span.explain
        Icon(type="ios-information")
        | 中奖说明
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'LotteryMode',
  props: {
    alias: String,
    help: Object
  },
  data () {
    return {
      category: this.alias,
      modeObj: {},
      subModeObj: {},
      _mode: '',
      mode: '',
      selecPlayType: '',

      //玩法模式切換參數
      mainMode: {
        size: 10, //每頁筆數
        startIndex: 0, //展示筆數位置 start
        endIndex: 10, //展示筆數位置 end
        curPage: 1,
        totalPage: 0,
        prev: false,
        next: false,
      },
    }
  },
  computed: {
    ...mapGetters(['requesting', 'error', 'lotteryMode', 'selectMode', 'quickBet_list']),
    modeLen () {
      return this.lotteryMode.length
    },
    ratio: {
      get: function () {
        const { category, mode } = this;
        if (mode == '') return 0;

        const { ratio } = this.subModeObj;
        let ary = (ratio + '').split('|');

        if (/[^P]K3$/.test(category) && /HZHZ$/.test(mode)) return 0;

        if (/SSC$/.test(category)) {
          ary.sort((a, b) => b - a);
          // 前(后)三组合
          if (/(Q|H)3ZH$/.test(mode)) {
            return `一等奖：${ary[0]}、二等奖：${ary[1]}、三等奖：${ary[2]}`;
          }
          // 组选和值、组选包胆、任选三组选和值
          if (/(Q|H|RX)3(ZUXHZ|ZXBD)$/.test(mode) || /(Q|H)3HHZX_DS/.test(mode)) {
            return `组三：${ary[0]}、组六：${ary[1]}`;
          }
          // 特殊号
          if (/TSH$/.test(mode)) {
            return `豹子：${ary[0]}、顺子：${ary[1]}、对子：${ary[2]}`;
          }
        }
        return ratio;
      },
      set: function (value) {
        return value;
      }
    },
  },
  created () {
    this.init()
  },
  methods: {
    ...mapMutations({
      selectModeHandler: 'selectMode'
    }),
    init () {
      this.ratio = 0;
      this.fetchData()
      
    },
    fetchData () {
      this.category = this.alias
      let category = this.category
      this.$store.dispatch('lotteryMode', {category: category}).then(list => {
        //載入已紀錄的playType
        if (/PK10|FT|SSC/.test(this.category)) {
          this.selecPlayType = this.$parent.$parent.playType;
        }else if(/28$/.test(this.category)) {
          this.selecPlayType = '';
        }

        //產生主要玩法分頁
        if (this.lotteryMode.length > this.mainMode.size) {
          //取得總共頁數，開啟下一頁按鈕
          this.mainMode.totalPage = Math.ceil(this.lotteryMode.length / this.mainMode.size);
          this.mainMode.next = true;
        }

        let { quickBet_list } = this // store
        let mode = ''
        if (quickBet_list && quickBet_list[category]) {
          let ss = quickBet_list[category]
          mode = ss.mode
        } else {
          mode = this.selectMode[category + this.selecPlayType]
        }
        if (mode == null) {
          mode = list[0].children[0].alias
        }
        
				this.modeObj = list.find(child => {
					return child.children.find(item => item.alias == mode)
        })

        // 传统 & 官方的切换
        if (this.modeObj == null) {
          this.modeObj = list[0]
          mode = list[0].children[0].alias
        }

        this.subModeObj = this.modeObj.children.find(item => item.alias == mode) || {}
        this.mode = mode
        this._mode = mode

        // TODO: 缓存传统&官方的玩法
        this.selectModeHandler({
          category: category + this.selecPlayType,
          mode: this.mode
        })

        // 初始化
        this.emitHandler()
      })
    },
    //遊戲模式切換頁數(主mode)
    mainModePage(type) {
      let { size, startIndex, endIndex, curPage, totalPage, prev, next } = this.mainMode;
      if (type == 'next') {
        if (curPage < totalPage) {
          this.mainMode.prev = true;
          this.mainMode.curPage ++;
          this.mainMode.startIndex += size;
          this.mainMode.endIndex += size;
          if (curPage + 1 == totalPage) {
            this.mainMode.next = false;
          }
        }
      } else {
        if (curPage != 1) {
          this.mainMode.next = true;
          this.mainMode.curPage --;
          this.mainMode.startIndex -= size;
          this.mainMode.endIndex -= size;
          if (curPage == 2) {
            this.mainMode.prev = false;
          }
        }
      }
    },
    changeMode (value) {
      // 分类的改变
      if (value.children) {
        this.modeObj = value
        this.subModeObj = value.children[0]
        this.mode = this.subModeObj.alias
      } else {
        // 玩法的改变
        this.mode = value.alias
        this.subModeObj = value // fix
      }

      this.selectModeHandler({
        category: this.category + this.selecPlayType,
        mode: this.mode
      });
      
      //改變mode時也要暫存玩法
      if (/PK10|FT|SSC/.test(this.category)) {
        this.$parent.$parent.savePlayType(this.category , this.selecPlayType);
      }

      /**
         * change mode
         * 切換mode
         * mode: 目標
         * _mode: 原本(目前)
         */
      if (this.mode != this._mode) {
        this.emitHandler()
        this._mode = this.mode
      }
    },
    emitHandler () {
      // todo: v-mode
      let { mode, modeObj, subModeObj } = this
      this.$emit('changeModeTpl', {
        mode: mode,
        modeLabel: `${modeObj.label}_${subModeObj.label}`,
        subModeObj: subModeObj,
        price: subModeObj.price
      })
    }
  },
  watch: {
    alias: 'init'
  }
}
</script>

<style lang="scss" scoped>
.mode-tab-wrap {
  overflow: hidden;
  padding: 8px 0;
  background: #eee;
  a {
    flex-shrink: 0;
    display: block;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    background-size: 100% auto;
    text-indent: -9999px;
    &.prev {
      float: left;
      margin-left: 19px;
      background-image: url('~assets/themeMix/lottery-mode-arrowleft.svg')
    }
    &.next {
      float: right;
      margin-right: 19px;
      background-image: url('~assets/themeMix/lottery-mode-arrowright.svg')
    }
  }
  .wrap {
    float: left;
    display: flex;
    li {
      flex-shrink: 0;
      display: block;
      padding: 4px 20px;
      border-right: 1px solid #707070;
      font-size: 14px;
      color: #707070;
      line-height: 1;
      text-align: center;
      cursor: pointer;
    }
    li:last-child,
    li:nth-child(10n) {
      border: none;
    }
    li:hover,
    li.active {
      color: $ball-default-color;
    }
  }
}

.submode-tab {
  min-height: 60px;
  margin-bottom: 15px;
  padding: 16px;
  padding-left: 0;
  border-bottom: 2px #cecece dotted;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16) inset;
  li.tab-item {
    display: inline-block;
    margin-left: 10px;
    padding: 0 8px;
    border: 1px solid #fff;
    font-size: 14px;
    line-height: 26px;
    cursor: pointer;
    &.active {
      color: $primary-type2;
      border-color: $primary-type2;
      border-radius: 5px;
    }
  }
}
</style>
