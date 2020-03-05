<template lang="pug">
.bet-bar.hack-background(:class="betbarCls")
  CheckboxGroup(v-if="isMulti" v-model="betNum" @on-change="changeBetNumMulti")
    //- 自选不中、连码
    template(v-if="/ZXBZ|^LM/.test(mode)")
      .ball-3d(v-for="(item, i) in list", :key="`${mode}-${item.val}`")
        Checkbox.none-checkbox(:label="item.val")
          span.num(v-text="item.val", :class="`ball-${item.sb}`")
    template(v-else-if="/HXHX/.test(mode)")
      .rect-3d(v-for="(item, i) in list", :key="`${mode}-${item}`")
        Checkbox.none-checkbox(:label="item")
          span.num(v-text="item")
    template(v-else)
      .rect-3d(v-for="(item, i) in list", :key="`${mode}-${item}`")
        Checkbox.none-checkbox(:label="`${item}-${betInfo.ratios[i]}`")
          span.num(v-text="item")
        span.betnum-ratio(v-text="betInfo.ratios[i]")
    .hack-bet-util.fn-clear
      .fn-right
        span.mr10 赔率：{{ratio}}
        span 共{{realCount}}注
        Button.ivu-btn-middle.ml16(type="warning" :disabled="disabled" @click="addBetNums") 添加注单
  CheckboxGroup(v-else v-model="betNum" @on-change="changeBetNum")
    template(v-if="/HKSIX$/.test(category)")
      //- 色波
      template(v-if="hasColor")
        .ball-3d(v-for="(item, i) in list", :key="`${mode}-${item.val}`")
          Checkbox.none-checkbox(:label="`${item.val}-${betInfo.ratios[i]}`")
            span.num(v-text="item.val", :class="`ball-${item.sb}`")
          span.betnum-ratio(v-text="betInfo.ratios[i]")
      template(v-else v-for="(item, i) in list")
        .rect-3d(:key="`${mode}-${item}`")
          Checkbox.none-checkbox(:label="`${item}-${betInfo.ratios[i]}`")
            span.num(v-text="item")
          span.betnum-ratio(v-text="betInfo.ratios[i]")
        br(v-if="/^TWSTWS$/.test(mode) && i == 4")
        br(v-else-if="/^ZM16ZM/.test(mode) && i == 5")
    template(v-else-if="/(FT|PK10|SSC|11X5)$/.test(category)")
      template(v-for="(item, i) in list")
        .rect-3d
          Checkbox.none-checkbox(:label="`${item}-${betInfo.ratios[i]}`")
            span.num(v-text="item")
          span.betnum-ratio(v-text="betInfo.ratios[i]")
        //- FT|PK10: 冠亚和
        template(v-if="/(FT|PK10)$/.test(category)")
          br(v-if="/GYH$/.test(mode) ? item == 19 : /^(05|10|双)$/.test(item)")
</template>

<script>
const TWELVE = "鼠牛虎兔龙蛇马羊猴鸡狗猪";

export default {
  name: "BetBar_HK6",
  props: {
    category: String,
    mode: String, // 玩法
    modeLabel: String,
    betInfo: [Object, Array],
    // length: Number,
    // index: Number,
    // {}: 不做操作，null: 清空购物车，{...}: 删除某一项
    removeItem: Object, // 通过购物车移除

    selectedCount: {
      // 计算 注
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      hasColor: true,
      list: [],
      cache: {},
      betNum: [],
      isInit: false,

      count: 0, // 注（展示用的号码个数）
      needCount: 1 // 实际需要的注数
    };
  },
  computed: {
    betbarCls() {
      const { category, mode, isInit } = this;
      const isHK6 = /HKSIX$/.test(category);
      return {
        visible: isInit,
        padding10: /SSC$/.test(category),
        padding5: /11X5$/.test(category),
        // 球形
        'hack-ball': isHK6 && /(XM$|ZMTZ\dT|ZXBZ|^LM)/.test(mode),
        // 两面
        'hack-tmblm': isHK6 && /^TMBLM$/.test(mode),
        // 半波
        'hack-ssbb': isHK6 && /^SBBB$/.test(mode),
        // 半半波
        'hack-sbbbb': isHK6 && /^SBBBB$/.test(mode),
        // 生肖
        'hack-txsx': isHK6 && /^TXSX|HXHX|PT1XWS1X|ZXSX|LXLW\dLX$/.test(mode),
        // 连肖连尾-连尾
        'hack-lxlw2lw': isHK6 && /^LXLW\dLW$/.test(mode)
      };
    },
    disabled() {
      const { mode } = this;
      if (/ZXBZ/.test(mode)) {
        return this.count < 6;
      }
      return false;
    },
    ratio() {
      // 自选不中
      const { mode, count, isMulti, betNum, modeLabel } = this;
      let ratios = this.betInfo.ratios;
      let ratio = "--";
      if (!isMulti) return ratio;

      if (/ZXBZ/.test(mode)) {
        // 自选不中
        ratio = count > 5 ? ratios[count - 6] : "--";
      } else if (/HXHX/.test(mode)) {
        ratio = count > 1 ? ratios[count - 2] : "--";
      } else if (/LXLW/.test(mode)) {
        // 连肖连尾
        let _ratios = betNum.map(el => {
          let ary = el.split("-");
          return ary[1];
        });
        ratio = Math.min(..._ratios);
        ratio = isFinite(ratio) ? ratio : "--";
      } else if (/^LM/.test(mode)) {
        // 连码
        switch (mode) {
          case "LM3ZE7":
            ratio = ratios.join("(中二)") + "(中三)";
            break;
          case "LM2ZT7":
            ratio = ratios.join("(中特)") + "(中二)";
            break;
          default:
            ratio = ratios + `(${modeLabel.split("_")[1]})`;
            break;
        }
      }
      return ratio;
    },
    isMulti() {
      // 连肖连尾、连码、自选不中、合肖-合肖
      const { category, mode } = this;
      return /HKSIX$/.test(category) && /(LXLW\d+|^LM\d+|ZXBZ|HXHX)/.test(mode);
    },
    realCount() {
      const { isMulti, count, needCount } = this;
      return isMulti ? needCount : count;
    }
  },
  created() {
    this.changeCategory();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { mode } = this;
      let { nums } = this.betInfo;
      // 特码、正码、正码特、自选不中、连码
      this.hasColor = /(XM$|ZMTZ\dT|ZXBZ|^LM)/.test(mode);
      this.list = this.hasColor ? this.setSBColor(nums) : nums;
      this.isMulti && this.selectedCount();
    },
    // TODO: 切换彩种的hack
    changeCategory() {
      this.isInit = false;
      setTimeout(() => {
        this.isInit = true;
      }, 300);
    },
    setSBColor(list) {
      const { getHK6Color } = this.$root;
      return list.map(n => getHK6Color(n));
    },
    padLeftZero(str) {
      return ("0" + str).substr(-2);
    },
    changeBetNum(ary) {
      const { mode, modeLabel } = this;
      const value = ary.map(item => {
        const [nums, ratio] = item.split("-");
        return {
          nums,
          ratio,
          mode,
          modeLabel
        };
      });
      this.$emit("changeSelected", {
        value
      });
    },

    // 多个组成一注
    changeBetNumMulti(ary) {
      const { mode, modeLabel, isMulti } = this;
      this.selectedCount();
      const { count } = this;

      // 方法执行之后才能生效
      if (!isMulti) return;
      if (/(ZXBZ|HXHX)/.test(mode) && count > 11) {
        // 自选不中、合肖-合肖
        this.betNum.shift();
        this.count = 11;
      } else if (/^LM/.test(mode)) {
        // 连码
        var rex = mode.match(/^LM\d+[A-Z]+(\d+)$/);
        var len = rex ? rex[1] : 7;
        if (count > len) this.betNum.shift();
        this.selectedCount();
      }
    },
    addBetNums() {
      let { mode, modeLabel, betNum, ratio } = this;
      let msg = "";
      let count = 1;
      if (this.needCount === 0) {
        let rex1 = mode.match(/LXLW(\d+)/); // 连肖连尾
        let rex2 = mode.match(/^LM(\d+)/); // 连码
        let rex3 = mode.match(/ZXBZ/); // 自选不中
        let rex4 = mode.match(/HXHX/); // 合肖
        let num = rex1 ? rex1[1] : rex2 ? rex2[1] : rex3 ? 6 : rex4 ? 2 : 2;
        msg = `您必须选择${num}个及以上号码`;
      } else if (this.count == 0) {
        msg = "您还没有选择任何号码";
      }
      if (msg) {
        this.$Modal.warning({
          title: "温馨提示",
          content: msg
        });
        return;
      }

      let nums = betNum;
      if (/(LXLW|^LM)/.test(mode)) {
        // 连肖连尾、连码
        nums = betNum.map(item => {
          let [value] = ("" + item).split("-"); // fix: LM item typeof Number
          return value;
        });
        count = this.needCount;
      }
      if (/^LM/.test(mode)) {
        // 连码
        ratio = Math.max(...this.betInfo.ratios);
        ratio = parseFloat(ratio);
      }

      nums = nums
        .sort((a, b) => {
          return isNaN(parseInt(a))
            ? TWELVE.indexOf(a) - TWELVE.indexOf(b)
            : parseInt(a) - parseInt(b);
        })
        .join(",");
      const value = [
        {
          nums,
          ratio,
          mode,
          modeLabel,
          count
        }
      ];
      this.$emit("changeSelected", {
        value
      });
      this.needCount = 0;
      this.count = 0;
      this.betNum.splice(0); // 恢复初始状态
    }
  },
  watch: {
    category(cur, old) {
      // 不是相同彩种
      if (cur.substr(-2) != old.substr(-2)) {
        this.changeCategory();
      }
    },
    mode(cur, old) {
      let { cache, betNum, init } = this;
      // 存储到缓存中
      cache[old] = JSON.parse(JSON.stringify(betNum));
      // 初始化betNum
      betNum.splice(0);
      this.betNum = cache[cur] || [];
      init();
    },
    removeItem(cur) {
      const { betNum } = this;
      if (cur == null) {
        // 清空
        this.cache = {};
        betNum.splice(0);
      } else {
        const { mode, nums, ratio } = cur;
        // 删除某一项
        if (mode) {
          const curCache = this.cache[mode];
          const value = `${nums}-${ratio}`;
          let idx;
          // 删除缓存
          if (curCache) {
            idx = curCache.findIndex(n => n === value);
            idx > -1 && curCache.splice(idx, 1); // fix: 未查找到，删除了末尾数据
          }
          if (this.isMulti) return; // 多个号码的
          // 删除当前号码
          if (this.mode === mode) {
            idx = betNum.findIndex(n => n === value);
            idx > -1 && betNum.splice(idx, 1); // fix: 未查找到，删除了末尾数据
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 模版2：参考互娱
.template-v2 .bet-bar {
  visibility: hidden;
  &.hack-ball {
    width: 740px;
    .hack-bet-util {
      margin-right: 6px;
    }
    .betnum-ratio {
      width: 38px;
    }
  }
  &.hack-tmblm {
    width: 415px;
  }
  &.hack-ssbb {
    width: 264px;
  }
  &.hack-sbbbb {
    width: 328px;
  }
  &.hack-txsx {
    width: 396px;
    .hack-bet-util {
      margin-right: -337px;
    }
  }
  &.hack-lxlw2lw .hack-bet-util {
    margin-right: -73px;
  }
  &.visible {
    visibility: visible;
  }
  .hack-bet-util {
    margin-bottom: 16px;
  }
  .ivu-checkbox-wrapper {
    margin-right: 0;
  }
  .ivu-checkbox-wrapper + span,
  .ivu-checkbox + span {
    margin-right: 0;
  }
  .ivu-checkbox-group > .ball-3d,
  .ivu-checkbox-group > .rect-3d {
    display: inline-block;
    margin-bottom: 16px;
    text-align: center;
  }
  .num {
    display: inline-block;
    height: 30px;
    line-height: 28px;
    border: 1px solid #dcdcdc;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
  }
  // ball-3d
  .ball-3d {
    margin-right: 30px;
    padding: 0 3px;
    width: 44px;
  }
  .ball-3d .num {
    min-width: 30px;
    border-radius: 50%;
    &.ball-red {
      color: $ball-red;
    }
    &.ball-green {
      color: $ball-green;
    }
    &.ball-blue {
      color: $ball-blue;
    }
  }
  // rect-3d
  .rect-3d {
    margin-right: 16px;
  }
  .rect-3d .num {
    padding: 0 8px;
    min-width: 50px;
    border-radius: 15px;
  }
  .ivu-checkbox-checked + .num {
    background: linear-gradient(180deg, #fc1805 0, #da3110);
    box-shadow: 1px 1px 3px rgba(229, 41, 12, 0.5);
    color: #fff !important;
    border-color: #da3110;
  }

  .betnum-ratio {
    display: block;
    padding-top: 5px;
    font-size: 12px;
    line-height: 20px;
    color: #999;
  }
}

.template-v2 {
  .padding5 .ivu-checkbox-group > .num {
    padding-left: 5px;
    padding-right: 5px;
  }
  .padding10 .ivu-checkbox-group > .num {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
