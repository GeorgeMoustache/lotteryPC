<template lang="pug">
.bet-bar
  .cell-side(v-text="digit")
  .cell-main
    template(v-if="!(/DT/.test(mode))")
      CheckboxGroup.check-group(v-model="betNum")
        template(v-for="n in betInfo.nums")
          Checkbox.none-checkbox(:label="n")
            span.num-ball(v-text="n")
    template(v-else)
      CheckboxGroup.check-group(v-model="betNum_DT" @on-change="changeSelected_DT")
        template(v-for="n in betInfo.nums")
          Checkbox.none-checkbox(:label="n")
            span.num-ball(v-text="n")
  RadioGroup.cell-filter(v-model="filter" v-if="!(/DT/.test(mode))")
    template(v-for="(value, index) in '全大小奇偶质合'")
      Radio.none-radio(:label="index+1")
        span.num-ball.ball-sm(v-text="value")
    Button.clear-ball(@click="clear") 清  
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	name: 'BetBar_11X5',
	props: {
		category: String,
		mode: String, // 玩法
		betInfo: Object,
		length: Number,
		index: Number
	},
	data () {
		return {
			betNum: [],
			betNum_DT: [],
			filter: 0
		}
	},
	computed: {
    ...mapGetters(['quickBet_list']),
		digit () {
			let { mode, digits, length, index } = this

			if (/ZUX$/.test(mode)) return '组选'
			// 前三、定位胆
			if (/[A-Z]{2}Q[0-9]Z[HU]X$/.test(mode) || /^DWD$/.test(mode)) return `第${'一二三四五'.charAt(index)}位`
			// 中三
			if (/[A-Z]{2}Z[0-9]Z[HU]X$/.test(mode)) return `第${'二三四'.charAt(index)}位`
			// 后三
			if (/[A-Z]{2}H[0-9]Z[HU]X$/.test(mode)) return `第${'五四三二一'.charAt(length - index - 1)}位`
			// 胆拖
			if (/DT/.test(mode)) return `${'胆拖'.charAt(index)}码`
			// 不定位
			let bdwRex = mode.match(/BDW([A-Z])3W/)
			if (bdwRex) {
				var obj = {
					'Q': '前',
					'Z': '中',
					'H': '后'
				}
				return `${obj[bdwRex[1]]}三位`
			}
			// 任选复式
			let rxRex = mode.match(/RX(\d)Z(\d)/)
			if (rxRex) {
				var str = '零一二三四五六七八'
				return `${str[rxRex[1]]}中${str[rxRex[2]]}`
			}
			return `第${'一二三四五'.charAt(index)}位`
		}
	},
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(['quickBet_remove']),
    init () {
      let { quickBet_list, category, mode, betInfo, index, length } = this; // store
      if (quickBet_list) {
        let ss = quickBet_list[category];
        if (ss && mode == ss.mode) {
          // SMQ3ZHX !!!
          let value = ss.selectedList[index][0];
          let i = betInfo.nums.findIndex(el => value == el);
          if (i > -1) {
            this.betNum = [value];
            index === length - 1 && this.quickBet_remove({ category: category });
          }
        }
      }
    },
		onBetNum ({value, funName}) {
      let { digit } = this;
      let ary = [];
			if (value.length) {
				ary = Object.assign([], value).sort((a, b) => a - b)
			} else {
				digit = ''
			}
			this.$emit(funName, {
				value: ary,
				index: this.index,
				digit: digit
			})

      if (value.length == 11) {
        return this.filter = 1
      }
      if (value.length == 5) {
        if (value.filter(n => +n < 6).length == 5) {
          return this.filter = 3
        }
        if (value.filter(n => +n % 2 == 0).length == 5) {
          return this.filter = 5
        }
        if (value.filter(n => /(0|4|6|8|9)$/.test(n)).length == 5) {
          return this.filter = 7
        }
      }
      if (value.length == 6) {
        if (value.filter(n => +n > 5).length == 6) {
          return this.filter = 2
        }
        if (value.filter(n => +n % 2 != 0).length == 6) {
          return this.filter = 4
        }
        if (value.filter(n => /(1|2|3|5|7)$/.test(n)).length == 6) {
          return this.filter = 6
        }
      }
      return this.filter = 0
    },
    // 胆拖
    changeSelected_DT (value) {
      this.$emit('changeSelected_DT', {
        value: value,
        index: this.index,
        digit: this.digit
      })
    },
    //清除所有選中的球
    clear() {
      this.betNum = [];
      this.filter = 0;
    }
  },
  watch: {
    filter (value, oldVal) {
      let result = [];
      const { nums } = this.betInfo;
      const half = nums.length / 2;

      switch (value) {
        // 全
        case 1:
          result = nums
          break;
        // 大
        case 2:
          result = nums.filter(n => +n >= half)
          break;
        // 小
        case 3:
          result = nums.filter(n => +n < half)
          break;
        // 奇
        case 4:
          result = nums.filter(n => +n % 2 != 0)
          break;
        // 偶
        case 5:
          result = nums.filter(n => +n % 2 == 0)
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
      this.betNum = result
      this.betNum_DT = result
    },
    betNum (value, oldVal) {
      this.onBetNum({
        value: value,
        funName: 'changeSelected'
      })
    },
    // betNum_DT (value, oldVal) {
    // 	this.onBetNum({
    // 		value: value,
    // 		funName: 'changeSelected_DT'
    // 	})
    // },
    'betInfo.empty' (value, oldVal) {
      if (value) {
        this.betNum = []
        this.betNum_DT = []
      }
    }
  }
}
</script>
