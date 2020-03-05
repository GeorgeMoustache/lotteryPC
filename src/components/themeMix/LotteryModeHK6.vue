<template lang="pug">
.mode-wrap
  //- 主mode
  .menu-wrap
    a.prev(v-if="mainMode.prev" @click="mainModePage($event.target.className)") 上一頁
    ul.wrap
      li(v-for="(item, idx) in formatLotteryMode" :key="item.label + item.id" v-show="idx >= mainMode.startIndex && idx < mainMode.endIndex" :class="{active: item == modeObj}" @click="changeMode(item)") {{item.label}}
    a.next(v-if="mainMode.next" @click="mainModePage($event.target.className)") 下一頁
  //- 次mode
  .submenu-wrap(v-if="modeObj.children && modeObj.children.length > 1 && modeObj.label === '连肖连尾'")
    ul.wrap
      li(v-for="(item, index) in modeObj.children" :key="item.id" :class="{active: item.alias == mode}" @click="changeMode(item)") {{item.label}}
  .submenu-wrap(v-else-if="modeObj.children && modeObj.children.length > 1")
    ul.wrap
      li(v-for="(item, index) in modeObj.children" :key="item.id" :class="{active: item.alias == mode}" @click="changeMode(item)") {{item.label}}
  .submenu-wrap(v-else)
  p.mode-help(v-if="help.desc")
    Icon.text-primary-type2(type="ios-information" size="14")
    | 玩法提示：{{help.desc}}
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Mode_HK6',
  props: {
    alias: String,
    help: Object,
  },
  data() {
    return {
      category: this.alias,
      modeObj: {},
      subModeObj: {},
      _mode: '',
      mode: '',

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
    };
  },
  computed: {
    ...mapGetters(['requesting', 'error', 'lotteryMode', 'selectMode']),
    formatLotteryMode() {
      const { lotteryMode } = this;
      //產生主要玩法分頁
      if (this.lotteryMode.length > this.mainMode.size) {
        //取得總共頁數，開啟下一頁按鈕
        this.mainMode.totalPage = Math.ceil(this.lotteryMode.length / this.mainMode.size);
        this.mainMode.next = true;
      }
      if (!lotteryMode.length) return [];
      return lotteryMode.map(obj => {
        const { label } =  obj;
        if (/^正码$/.test(label)) {
          obj.children.splice(1);
        }
        if (/^正码特$/.test(label)) {
          // 排除“大小”
          obj.children = obj.children.filter(item => !/DX$/.test(item.alias));
        }
        return obj;
      });
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapMutations({
      selectModeHandler: 'selectMode',
    }),
    fetchData() {
      this.category = this.alias;
      let { category } = this;
      this.$store.dispatch('lotteryMode', {category: category}).then(list => {
        let mode = '';
        mode = this.selectMode[category];
        if (mode == null) {
          mode = list[0].children[0].alias;
        }
        this.modeObj = list.find(child => {
          return child.children.find(item => item.alias == mode);
        });
        this.subModeObj = this.modeObj.children.find(item => item.alias == mode) || {};
        this.mode = mode;
        this._mode = mode;
        this.selectModeHandler({
          category: category,
          mode: this.mode,
        });
        // 初始化
        this.emitHandler();
      });
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
    changeMode(value) {
      // 分类的改变
      if (value.children) {
        this.modeObj = value;
        this.subModeObj = value.children[0];
        this.mode = this.subModeObj.alias;

        this.selectModeHandler({
          category: this.category,
          mode: this.mode,
        });
      } else {
        // 玩法的改变
        let mode = value.alias;
        this.subModeObj = value; // fix
        this.mode = mode;

        this.selectModeHandler({
          category: this.category,
          mode: mode,
        });
      }

      if (this.mode != this._mode) {
        this.emitHandler();
        this._mode = this.mode;
      }
    },
    emitHandler() {
      // todo: v-mode
      let { mode, modeObj, subModeObj } = this;
      this.$emit('changeModeTpl', {
        mode: mode,
        modeLabel: `${modeObj.label}_${subModeObj.label}`,
        subModeObj: subModeObj,
        price: subModeObj.price,
      });
    },
  },
  watch: {
    alias: 'init',
  },
};
</script>

<style lang="scss" scoped>
$light-color: #f33;
.menu-wrap {
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
.submenu-wrap {
  margin-bottom: 15px;
  padding: 16px 16px 16px 0;
  border-bottom: 2px #cecece dotted;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16) inset;
  overflow: hidden;
  font-size: 14px;
  .wrap {
    float: left;
    display: flex;
    li {
      flex-shrink: 0;
      display: block;
      margin-left: 10px;
      padding: 0 8px;
      border: 1px solid transparent;
      border-radius: 5px;
      font-size: 14px;
      color: #495060;
      line-height: 26px;
      cursor: pointer;
    }
    li.active {
      border-color: $light-color;
      color: $light-color;
    }
  }
}
</style>
