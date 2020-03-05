<template lang="pug">
.mode-wrap-theme2
  .menu-wrap
    a(v-for="(item, idx) in formatLotteryMode" :key="item.label + item.id" :class="{active: item == modeObj}" v-text="item.label" @click="changeMode(item)")
  p.mode-help(v-if="help.desc")
    Icon.text-warning(type="ios-information")
    | &nbsp;&nbsp;玩法提示：{{help.desc}}
  .submenu-wrap(v-if="modeObj.children && modeObj.children.length > 1")
    a(v-for="item in modeObj.children" :key="item.id" :class="{active: item.alias == mode}" @click="changeMode(item)")
      span(v-text="item.label")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Mode_Theme2',
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
    };
  },
  computed: {
    ...mapGetters(['requesting', 'error', 'lotteryMode', 'selectMode']),
    formatLotteryMode() {
      const { lotteryMode } = this;
      if (!lotteryMode.length) return [];
      return lotteryMode[0].children;
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations({
      selectModeHandler: 'selectMode',
    }),
    init() {
      this.fetchData();
    },
    fetchData() {
      this.category = this.alias;
      const { category } = this;
      // 传统玩法
      let tpl;
      if (/(SSC|PK10|11X5)$/.test(category)) {
        tpl = 1;
      }
      this.$store
        .dispatch('lotteryMode', {
          category,
          tpl,
        })
        .then(list => {
          let mode = '';
          const { children } = list[0];

          mode = this.selectMode[category];
          if (mode == null) {
            mode = children[0].alias;
          }
          this.modeObj = children.find(item => item.alias == mode);
          if (this.modeObj == null) {
            this.modeObj = children[0];
            mode = this.modeObj.alias;
          }

          this.subModeObj = this.modeObj;
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
    changeMode(value) {
      this.modeObj = value;
      this.subModeObj = value;
      this.mode = value.alias;

      this.selectModeHandler({
        category: this.category,
        mode: this.mode,
      });

      // change mode
      // log(this.mode, this._mode);
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
        modeLabel: modeObj.label,
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
.mode-wrap-theme2 {
  font-size: 14px;
  .menu-wrap {
    border-top: 1px solid #e3e3e3;
    border-bottom: 1px solid #e3e3e3;
    background: #fff;
    @include clearfix();
    a {
      float: left;
      padding: 0 15px;
      margin-bottom: -1px;
      line-height: 40px;
      border-bottom: 1px solid #e3e3e3;
      text-align: center;
      color: #495060;
    }
    a.active,
    a:hover,
    a:active {
      color: $light-color;
      border-bottom-color: $light-color;
    }
  }
  .submenu-wrap {
    margin-bottom: 10px;
    width: 920px;
    line-height: 50px;
    text-align: center;
    a {
      display: inline-block;
      margin: 0 20px;
      color: #495060;
    }
    a:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      width: 28px;
      height: 28px;
      border: 1px solid #d7d7d7;
      border-radius: 50%;
    }
    a.active {
      color: $light-color;
      &:before {
        border: 6px solid $light-color;
      }
    }
  }

  .mode-help {
    padding-left: 20px;
    line-height: 40px;
    color: $gray-color;
  }
}
</style>
