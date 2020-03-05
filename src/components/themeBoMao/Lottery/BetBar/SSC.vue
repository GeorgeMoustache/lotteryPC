<template lang="pug">
.bet-bar
  //- 后二大小单双
  template(v-if="/DXDS$/.test(mode)")
    .cell-label(v-text="digit")
    .cell-number
      CheckboxGroup.check-group(v-model="betNum")
        template(v-for="n in betInfo.nums")
          Checkbox.none-checkbox(:label="n")
            span.num-ball(v-text="n")
    Button.clear-ball(@click="clear") 清
  //- 特殊号
  template(v-else-if="/TSH$/.test(mode)")
    .cell-label(v-text="digit")
    .cell-number.special
      CheckboxGroup.check-group.num-rectangle(v-model="betNum")
        template(v-for="(n, i) in betInfo.nums")
          Checkbox.none-checkbox(:label="n[0]")
            span.num-ball(v-text="n[1]")
  //- 任选 直选和值、组选和值、组选复式
  .betbar-wrap(v-else-if="/^RX[0-9][A-Z0-9]{4,}/.test(mode)")
    .bet-select(v-if="index == 0")
      CheckboxGroup.checkbox-group(v-model="filterDigits_" @on-change="filterDigitsChange")
        Checkbox(v-for="(n, i) in reverseDigits", :key="i", :label="n")
          span(v-text="`${n}位`")
      span.tip 温馨提示：你选择了
        em.text-primary(v-text="filterDigits_.length")
        | 个位置，系统自动根据位置组合成
        em.text-primary(v-text="combine(filterDigits_.length)")
        | 个方案。
    .bet-number
      //- 和值
      template(v-if="/HZ$/.test(mode)")
        .cell-label(v-text="digit")
        .cell-number.full
          CheckboxGroup.check-group(v-model="betNum")
            template(v-for="(n, i) in betInfo.nums")
              Checkbox.none-checkbox(:label="n")
                span.num-ball(v-text="n")
          span.num-ball(v-if="isOdd" style="float: none;")
      //- 组选包胆
      template(v-else-if="/ZXBD$/.test(mode)")
        .cell-label(v-text="digit")
        .cell-number
          RadioGroup.check-group(v-model="betNum")
            template(v-for="n in betInfo.nums")
              Radio.none-radio(:label="n + ''")
                span.num-ball(v-text="n")
      template(v-else)
        .cell-label(v-text="digit")
        .cell-number
          CheckboxGroup.check-group(v-model="betNum")
            template(v-for="(n, i) in betInfo.nums")
              Checkbox.none-checkbox(:label="n")
                span.num-ball(v-text="n")
          span.num-ball(style="float: none;")
        RadioGroup.cell-filter(v-model="filter" @on-change="filterChange")
          template(v-for="(value, index) in '全大小奇偶质合'")
            Radio.none-radio(:label="index+1")
              span.num-ball(v-text="value")
          Button.clear-ball(@click="clear") 清
  //- 定位胆、五星直选
  template(v-else)
    //- 和值
    template(v-if="/Z[A-Z]XHZ$/.test(mode)")
      .cell-label(v-text="digit")
      .cell-number.full
        CheckboxGroup.check-group(v-model="betNum")
          template(v-for="(n, i) in betInfo.nums")
            Checkbox.none-checkbox(:label="n")
              span.num-ball(v-text="n")
        span.num-ball(v-if="isOdd")
    template(v-else)
      .cell-label(v-text="digit")
      .cell-number
        template(v-if="/ZXBD$/.test(mode)")
          RadioGroup.check-group(v-model="betNum")
            template(v-for="n in betInfo.nums")
              Radio.none-radio(:label="n")
                span.num-ball(v-text="n")
        template(v-else)
          CheckboxGroup.check-group(v-model="betNum")
            template(v-for="n in betInfo.nums")
              Checkbox.none-checkbox(:label="n")
                span.num-ball(v-text="n")
          span.num-ball.fn-vishide(style="float: none;")
    RadioGroup.cell-filter(v-if="!(/(Z[A-Z]XHZ|ZXBD)$/.test(mode))" v-model="filter" @on-change="filterChange")
      template(v-for="(value, index) in '全大小奇偶质合'")
        Radio.none-radio(:label="index+1")
          span.num-ball(v-text="value")
      Button.clear-ball(@click="clear") 清
</template>

<script>
import { Combination } from 'utils/lottery/helper';
import { mapGetters, mapMutations } from 'vuex';

const rxqh_reg = /^(RX|Q|Z|H)(\d)Z[HU][A-Z0-9]{2,}$/; // (任选、前、中、后) 直选和值、组选和值、组选复式【增加中三】
const rxds_reg = /^RX(\d)\w+_M?DS$/; // (任选单式)
const rxBdKd_reg = /^RX([0-9])ZX[BK]D$/; //（任选）组选包胆、直选跨度
const reverseDigitsAry = ['万', '千', '百', '十', '个'];

export default {
  name: 'BetBar_SSC',
  props: {
    category: String, // 彩种别名
    mode: String, // 玩法别名
    betInfo: [Object, Array],
    length: Number,
    index: Number,
    filterDigits: Array,
  },
  data() {
    return {
      digits: '个十百千万',
      betNum: [],
      filter: 0,
      minDigitLen: 2,
      reverseDigits: '万千百十个',
      filterDigits_: this.filterDigits,
      // rxqh_reg: rxqh_reg,
      // rxBdKd_reg: rxBdKd_reg,
      isRXreg: /^RX(\d)Z[HU][A-Z0-9]{2,}$/,
      infoLenHalf: 0, // 长度的1/2
      isOdd: false, // 长度是否为奇数
    };
  },
  computed: {
    ...mapGetters(['quickBet_list']),
    digit() {
      let { mode, digits, length, index } = this;
      // 大小单双
      if (/DXDS$/.test(mode)) {
        // 前
        if (/^Q[A-Z0-9]+/.test(mode)) return `${digits[digits.length - index - 1]}位`;
        return `${digits[length - index - 1]}位`;
      }
      if (/^(Q\dZX|Q3Q3ZH|Q2ZXFS)$/.test(mode)) return `${digits[digits.length - index - 1]}位`;
      // 特殊号
      if (/TSH$/.test(mode)) return '特殊号';
      // (任选前后) 直选和值、组选和值、组选复式
      if (rxqh_reg.test(mode)) {
        if (/HZ$/.test(mode)) return '和值';
        if (/X(12|6)$/.test(mode)) return ['二重号', '单号'][index];
        if (/X4$/.test(mode)) return ['三重号', '单号'][index];
        if (/X24$/.test(mode)) return '组选24';
        return '组选';
      }
      if (/^[QZH]2ZX$/.test(mode)) return '组二';
      if (/^[QZH]3Z3$/.test(mode)) return '组三';
      if (/^[QZH]3Z6$/.test(mode)) return '组六';
      if (/Z[A-Z]XHZ$/.test(mode)) return '和值'; //  直选和值、组选和值
      if (/ZXKD$/.test(mode)) return '跨度';
      if (/ZXBD$/.test(mode)) return '包胆';
      if (/HZWS$/.test(mode)) return '和值尾数';
      if (/^BDW/.test(mode)) return '不定位';

      // 中三
      if (/^Z3/.test(mode)) return `${'千百十'.charAt(index)}位`;

      return `${digits.charAt(length - index - 1)}位`; // 后（SXZX
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(['quickBet_remove']),
    init() {
      let { quickBet_list, category, mode, betInfo, index, length } = this; // store
      let ss = quickBet_list[category];
      if (ss && mode == ss.mode) {
        // WXZX !!!
        let value = ss.selectedList[index][0];
        let i = betInfo.nums.findIndex(el => value == el);
        if (i > -1) {
          this.betNum = [value];
          index === length - 1 && this.quickBet_remove({ category: category });
        }
      } else {
        // Radio
        this.betNum = /ZXBD$/.test(mode) ? '' : [];
      }

      // (任选前后)直选和值、组选和值、组选复式
      // ["Q4ZUX24", "Q", "4", index: 0, input: "Q4ZUX24", groups: undefined]
      // ["H4ZUX24", "H", "4", index: 0, input: "H4ZUX24", groups: undefined]
      // ["RX4ZUX24", "RX", "4", index: 0, input: "RX4ZUX24", groups: undefined]
      let rex_qh = mode.match(rxqh_reg);
      // (任选)单式
      // ["RX3ZX_MDS", "3", index: 0, input: "RX3ZX_MDS", groups: undefined]
      let rex_ds = mode.match(rxds_reg);
      // (任选)组选包胆,直选跨度
      // ["RX3ZXBD", "3", index: 0, input: "RX3ZXBD", groups: undefined]
      // ["RX3ZXKD", "3", index: 0, input: "RX3ZXKD", groups: undefined]
      let rex_BdKd = mode.match(rxBdKd_reg);

      let ary = [];
      if (rex_qh) {
        let [origin, direction, num] = rex_qh; // [匹配内容，前后朝向，几星]
        num = parseInt(num, 10);
        ary = direction === 'Q' ? reverseDigitsAry.slice(0, num) : reverseDigitsAry.slice(5 - num); // 前 : 后，任选
      } else if (rex_ds) {
        ary = reverseDigitsAry.slice(5 - rex_ds[1]);
      } else if (rex_BdKd) {
        ary = reverseDigitsAry.slice(5 - rex_BdKd[1]);
      }
      this.filterDigits_ = ary;
      this.$emit('update:filterDigits', ary);
      this.minDigitLen = this.minDigits();

      let nums = this.betInfo.nums;
      if (nums) {
        this.isOdd = nums.length % 2;
        this.infoLenHalf = Math.max(nums.length / 2 - 1, 0);
      }
      this.filter = 0;
    },
    minDigits() {
      const { mode } = this;
      // ["RX3ZU3FS", "RX", "3", index: 0, input: "RX3ZU3FS", groups: undefined]
      let rxqh_match = mode.match(rxqh_reg);
      let rxds_match = mode.match(rxds_reg);
      let rxkd_match = mode.match(/^RX(\d)ZX[BK]D$/);
      let result = 0;
      if (rxqh_match) {
        result = parseInt(rxqh_match[2], 10);
      } else if (rxds_match) {
        result = parseInt(rxds_match[1], 10);
      } else if (rxkd_match) {
        result = parseInt(rxkd_match[1], 10);
      }
      return result;
    },
    combine(c) {
      return c ? Combination(c, this.minDigitLen) : 0;
    },
    filterDigitsChange(value) {
      this.$emit('update:filterDigits', value);
    },
    filterChange(value) {
      let result = [];
      const { nums } = this.betInfo;
      const half = nums.length / 2;

      switch (value) {
        case 1:
          result = nums;
          break;
        case 2:
          result = nums.filter(n => +n >= half);
          break;
        case 3:
          result = nums.filter(n => +n < half);
          break;
        case 4:
          result = nums.filter(n => +n % 2 != 0);
          break;
        case 5:
          result = nums.filter(n => +n % 2 == 0);
          break;
        case 6:
          result = nums.filter(n => /^(1|2|3|5|7)$/.test(n));
          break;
        case 7:
          result = nums.filter(n => /^(0|4|6|8|9)$/.test(n));
          break;
        default:
          break;
      }

      this.betNum = result;
    },
    //清除所有選中的球
    clear() {
      this.betNum = /ZXBD$/.test(this.mode) ? '' : [];
      this.filter = 0;
    },
  },
  watch: {
    betNum(value, oldVal) {
      let { digit, mode } = this,
        ary = [];
      if (('' + value).length) {
        ary = Array.isArray(value) ? Object.assign([], value).sort((a, b) => a - b) : [value];
      } else {
        digit = '';
      }
      this.$emit('changeSelected', {
        value: ary,
        index: this.index,
        digit: digit,
      });

      if (value.length == 10) {
        return (this.filter = 1);
      }
      if (value.length == 5) {
        if (value.filter(n => +n > 4).length == 5) {
          return (this.filter = 2);
        }
        if (value.filter(n => +n < 5).length == 5) {
          return (this.filter = 3);
        }
        if (value.filter(n => +n % 2 != 0).length == 5) {
          return (this.filter = 4);
        }
        if (value.filter(n => +n % 2 == 0).length == 5) {
          return (this.filter = 5);
        }
        if (value.filter(n => /^(1|2|3|5|7)$/.test(n)).length == 5) {
          return (this.filter = 6);
        }
        if (value.filter(n => /^(0|4|6|8|9)$/.test(n)).length == 5) {
          return (this.filter = 7);
        }
      }
    },
    'betInfo.empty'(value, oldVal) {
      if (value) this.betNum = /ZXBD$/.test(this.mode) ? '' : [];
    },
    mode: 'init',
  },
};
</script>
