<template lang="pug">
.mode-wrap-theme2
  .menu-wrap
    a(v-for="(item, idx) in lotteryMode" :key="item.label + item.id" :class="{active: item == modeObj}" v-text="item.label" @click="changeMode(item)")
  p.mode-help(v-if="help.desc")
    Icon.text-warning(type="ios-information")
    | &nbsp;&nbsp;玩法提示：{{help.desc}} 
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Mode_CT',
  props: {
    alias: String,
  },
  data() {
    return {
      category: this.alias,
      modeObj: {},
      subModeObj: {},
      _mode: '', // 观察玩法是否有变化
      mode: '',
      help: {}, // 帮助
    };
  },
  computed: {
    ...mapGetters(['lotteryMode', 'selectMode']),
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
      if (/(PK10|FT|SSC)$/.test(category)) {
        tpl = 1;
      }
      this.$store.dispatch('lotteryMode', { category, tpl }).then(list => {
        let mode = '';

        mode = this.selectMode[category];
        if (mode == null) {
          mode = list[0].children[0].alias;
        }

        this.modeObj = list.find(child => {
          return child.children.find(item => item.alias == mode);
        });

        if (this.modeObj == null) {
          this.modeObj = list[0];
          mode = list[0].children[0].alias;
        }

        this.subModeObj = this.modeObj.children.find(item => item.alias == mode) || {};
        this.mode = mode;
        this._mode = mode;
        this.selectModeHandler({
          category,
          mode,
        });
        //改變mode時也要暫存玩法
        // this.$parent.$parent.savePlayType(category , this.$parent.$parent.playType);

        this.setHelp();

        // 初始化
        this.emitHandler();
      });
    },
    setHelp() {
      let desc = '';
      const { category, mode } = this;
      if (/(PK10|FT)$/.test(category)) {
        if (/^SMP/.test(mode)) {
          desc =
            '冠军龙虎比较冠军与第十名号码，冠军号码较大为龙、反之为虎，其余情况视为不中奖。亚军龙虎比较亚军与第九名号码。季军龙虎比较季军与第八名号码。第四名龙虎比较第四名与第七名号码。第五名龙虎比较第五名与第六名号码。';
        }
        // 定位胆
        else if (/^DWD/.test(mode)) {
          desc =
            '预测各名次之号码,所选号码与开奖结果相同即中奖。冠军龙虎比较冠军与第十名号码，冠军号码较大为龙、反之为虎，其余情况视为不中奖。亚军龙虎比较亚军与第九名号码。季军龙虎比较季军与第八名号码。第四名龙虎比较第四名与第七名号码。第五名龙虎比较第五名与第六名号码。';
        }
        // 冠亚军
        else if (/^GYJ/.test(mode)) {
          desc =
            '预测冠军号码与亚军号码相加,所选数字与开奖结果相同即中奖。预测冠军号码与亚军号码相加,所选数字与开奖结果相同即中奖。预测各名次之号码,所选号码与开奖结果相同即中奖。冠军龙虎比较冠军与第十名号码，冠军号码较大为龙、反之为虎，其余情况视为不中奖。亚军龙虎比较亚军与第九名号码。季军龙虎比较季军与第八名号码。第四名龙虎比较第四名与第七名号码。第五名龙虎比较第五名与第六名号码。';
        }
      }
      this.help.desc = desc;
    },
    changeMode(value) {
      // 分类的改变
      let category = this.category;
      if (value.children) {
        this.modeObj = value;
        this.subModeObj = value.children[0];
        this.mode = this.subModeObj.alias;

        this.selectModeHandler({
          category,
          mode: this.mode,
        });
      } else {
        // 玩法的改变
        let mode = value.alias;
        this.subModeObj = value; // fix
        this.mode = mode;

        this.selectModeHandler({
          category,
          mode: mode,
        });
      }
      this.setHelp();
      //改變mode時也要暫存玩法
      this.$parent.$parent.savePlayType(category , this.$parent.$parent.playType);
      
      // change mode
      if (this.mode != this._mode) {
        this.emitHandler();
        this._mode = this.mode;
      }
    },
    emitHandler() {
      // todo: v-mode
      let { mode, modeObj, subModeObj } = this;
      this.$emit('changeModeTpl', {
        mode,
        modeObj,
        modeLabel: modeObj.label,
        subModeObj,
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
    margin-top: 10px;
    line-height: 1.5;
    padding-left: 20px;
    color: $gray-color;
  }
}
</style>
