<template lang="pug">
.bet-bar(:class="{'hack-background': /^HZHZ$/.test(mode)}")
  //- 和值
  template(v-if="/^HZHZ$/.test(mode)")
    //- .cell-label 和值
    .cell-number.k3hz
      CheckboxGroup(v-model="betNum")
        template(v-for="(n, i) in betInfo.nums" v-if="i < 4")
          Checkbox(:label="`${n}-${betInfo.ratios[i]}`")
            span.num-ball(v-text="n")
      .ratio-group
        span.num-ratio(v-for="(n, i) in betInfo.ratios" v-if="i < 4" v-text="n")
      CheckboxGroup(v-model="betNum")
        template(v-for="(n, i) in betInfo.nums" v-if="i >= 4 && i <= 11")
          Checkbox(:label="`${n}-${betInfo.ratios[i]}`")
            span.num-ball(v-text="n")
      .ratio-group
        span.num-ratio(v-for="(n, i) in betInfo.ratios" v-if="i >= 4 && i <= 11" v-text="n")
      CheckboxGroup(v-model="betNum")
        template(v-for="(n, i) in betInfo.nums" v-if="i > 11")
          Checkbox(:label="`${n}-${betInfo.ratios[i]}`")
            span.num-ball(v-text="n")
      .ratio-group
        span.num-ratio(v-for="(n, i) in betInfo.ratios" v-if="i > 11" v-text="n")
  //- 三同号-通选,单选
  template(v-else-if="/(TH3[DT]X|LH3TX)/.test(mode)")
    .cell-label(v-text="digit")
    .cell-number(:class="{'ball3': /(TH3DX)/.test(mode)}")
      CheckboxGroup(v-model="betNum")
        template(v-for="(n, i) in betInfo.nums")
          Checkbox(:label="n")
            span.num-ball(v-text="n" :class="{'single-ball': betInfo.nums.length == 1}")
  //- 胆拖|二同号-单选
  template(v-else-if="/(DT$|TH2DX)/.test(mode)")
    .cell-label(v-text="digit")
    .cell-number(:class="/(DT)/.test(mode)? 'ball1': 'ball2'")
      CheckboxGroup(v-model="betNum_DT" @on-change="changeSelected_DT")
        template(v-for="(n, i) in betInfo.nums")
          Checkbox(:label="n")
            span.num-ball(v-text="n" :class="[{'single-ball': betInfo.nums.length == 1}, {'one-dice': digit == '不同号'}]") 
  //- BTH3BZ：三不同号-标准
  //- TH2FX：二同号-复选
  template(v-else)
    .cell-label(v-text="digit")
    .cell-number(:class="/(BTH3BZ)/.test(mode)? 'ball1': 'ball2'")
      CheckboxGroup(v-model="betNum")
        template(v-for="(n, i) in betInfo.nums")
          Checkbox(:label="n")
            span.num-ball(v-text="n" :class="[{'single-ball': betInfo.nums.length == 1}, {'one-dice': digit == '标准'}]")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

const checkType = value => (/[^\d]+/.test(value) ? '大小单双'.indexOf(value) - 1 : value);

export default {
  name: 'BetBar_K3',
  props: {
    category: String,
    mode: String, // 玩法
    betInfo: Object,
    length: Number,
    index: Number
  },
  data() {
    return {
      betNum: [],
      betNum_DT: [],
      filter: 0
    };
  },
  computed: {
    ...mapGetters(['quickBet_list']),
    digit() {
      let { index, mode } = this;
      if (/BZ$/.test(mode)) return '标准';
      if (/DT$/.test(mode)) return `${'胆拖'.charAt(index)}码`;
      if (/TH2DX/.test(mode)) return ['同号', '不同号'][index];
      return '号码';
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations(['quickBet_remove']),
    init() {
      let { quickBet_list, category, mode, betInfo, index, length } = this; // store
      if (quickBet_list) {
        let ss = quickBet_list[category];
        if (ss && mode == ss.mode) {
          // HZHZ !!!
          let value = ss.selectedList[index][0];
          let i = betInfo.nums.findIndex(el => value == el);
          if (i > -1) {
            // 快3的数据格式不同
            let ratio = betInfo.ratios[i];
            this.betNum = [value + '-' + ratio];
            index === length - 1 && this.quickBet_remove({ category: category });
          }
        }
      }
    },
    // 胆拖
    changeSelected_DT(value) {
      this.$emit('changeSelected_DT', {
        value: value,
        index: this.index,
        digit: this.digit
      });
    }
  },
  watch: {
    betNum(value) {
      let digit = this.digit,
        ary = Object.assign([], value);
      if (value.length) {
        let mode = this.mode;
        // 和值-和值
        if (/^HZHZ$/.test(mode)) {
          ary = Object.assign([], value)
            .map(el => {
              let a = el.split('-');
              return {
                value: a[0],
                ratio: a[1]
              };
            })
            .sort((a, b) => {
              let av = checkType(a.value),
                bv = checkType(b.value);
              return bv - av;
            });
        }
      } else {
        digit = '';
      }
      // 胆拖
      this.$emit('changeSelected', {
        value: ary,
        index: this.index,
        digit: digit
      });
    },
    'betInfo.empty'(value, oldVal) {
      if (value) {
        this.betNum = [];
        this.betNum_DT = [];
      }
    }
  }
};
</script>
