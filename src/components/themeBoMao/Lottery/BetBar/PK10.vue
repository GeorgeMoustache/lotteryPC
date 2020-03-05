<template lang="pug">
.bet-bar
  .cell-label(v-text="digit")
  .cell-number
    CheckboxGroup.check-group(v-model="betNum")
      template(v-for="n in betInfo.nums")
        Checkbox.none-checkbox(:label="n")
          span.num-ball(v-text="n")
    span.num-ball.fn-vishide
  RadioGroup.cell-filter(v-model="filter")
    template(v-for="(value, index) in '全大小奇偶质合'")
      Radio.none-radio(:label="index+1")
        span.num-ball.ball-sm(v-text="value")
    Button.clear-ball(@click="clear") 清
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'BetBar_PK10',
  props: {
    category: String, // 彩种别名
    mode: String, // 玩法别名
    betInfo: Object,
    length: Number,
    index: Number
  },
  data() {
    return {
      digits: ['冠军', '亚军', '季军', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'],
      betNum: [],
      filter: 0
    };
  },
  computed: {
    ...mapGetters(['quickBet_list']),
    digit() {
      let { digits, length, index } = this;
      return digits[index];
    }
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(['quickBet_remove']),
    init() {
      let { quickBet_list, category, mode, betInfo, index, length } = this; // store
      if (quickBet_list) {
        let ss = quickBet_list[category];
        if (ss && mode == ss.mode) {
          // Q3ZX !!!
          let value = ss.selectedList[index][0];
          let i = betInfo.nums.findIndex(el => value == el);
          if (i > -1) {
            this.betNum = [value];
            index === length - 1 && this.quickBet_remove({ category: category });
          }
        }
      }
    },
    //清除所有選中的球
    clear() {
      this.betNum = [];
      this.filter = 0;
    }
  },
  watch: {
    filter(value, oldVal) {
      let result = [],
        nums = this.betInfo.nums,
        half = nums.length / 2;
      switch (value) {
        // 全
        case 1:
          result = nums;
          break;
        // 大
        case 2:
          result = nums.filter(n => +n > half);
          break;
        // 小
        case 3:
          result = nums.filter(n => +n <= half);
          break;
        // 奇
        case 4:
          result = nums.filter(n => +n % 2 != 0);
          break;
        // 偶
        case 5:
          result = nums.filter(n => +n % 2 == 0);
          break;
        // 质 ["01", "02", "03", "05", "07", "11"]
        case 6:
          result = nums.filter(n => /(1|2|3|5|7)$/.test(n));
          break;
        // 合 ["04", "06", "08", "09", "10"]
        case 7:
          result = nums.filter(n => /(0|4|6|8|9)$/.test(n));
          break;
        // 清
        case 8:
          result = [];
          break;
        default:
          return;
          break;
      }
      this.betNum = result;
    },
    betNum(value, oldVal) {
      let digit = this.digit,
        ary = [];
      if (value.length) {
        ary = Object.assign([], value).sort((a, b) => a - b);
      } else {
        digit = '';
      }
      this.$emit('changeSelected', {
        value: ary,
        index: this.index,
        digit: digit
      });

      if (value.length == 10) {
        return (this.filter = 1);
      }
      if (value.length == 5) {
        if (value.filter(n => +n > 5).length == 5) {
          return (this.filter = 2);
        }
        if (value.filter(n => +n < 6).length == 5) {
          return (this.filter = 3);
        }
        if (value.filter(n => +n % 2 != 0).length == 5) {
          return (this.filter = 4);
        }
        if (value.filter(n => +n % 2 == 0).length == 5) {
          return (this.filter = 5);
        }
        if (value.filter(n => /(1|2|3|5|7)$/.test(n)).length == 5) {
          return (this.filter = 6);
        }
        if (value.filter(n => /(0|4|6|8|9)$/.test(n)).length == 5) {
          return (this.filter = 7);
        }
      }
      return (this.filter = 0);
    },
    'betInfo.empty'(value, oldVal) {
      if (value) this.betNum = [];
    }
  }
};
</script>
