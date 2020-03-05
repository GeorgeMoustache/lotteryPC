<template lang="pug">
.bet-util.fn-clear
  .fn-right
    span 您选择了
    span.label-num.text-primary-type2(v-text="count")
    span 注, 共
    span.label-num.text-primary-type2(v-text="cost")
    span 元, 单注金额：
    Input.price(
      pattern="[0-9]*"
      :maxlength="priceMaxLength"
      v-bind:number="true"
      ref="input"
      v-model="price"
      @on-blur="formatPrice"
      :disabled="isMultipleMode"
      )
    //- RadioGroup.radio-unit(v-model="unit" type="button" @on-change="unitChange")
      Radio(v-for="n in units" :label="n" :key="n")
        span(v-text="unitLabel[n]")
    //- 非倍数模式
    ul.radio-unit(v-if="!isMultipleMode")
      li.radio-item(
        v-for="n in units"
        :key="n"
        :class="{active: n == unit}"
        @click="unit = n"
        ) {{unitLabel[n]}}
    //- 倍数模式
    ul.radio-unit.fn-disabled(v-else)
      li.radio-item(
        v-for="n in units"
        :key="n"
        :class="{active: n == unit}"
        ) {{unitLabel[n]}}
    //- 倍数模式-倍数
    .price-multiple(v-if="isMultipleMode")
      Input(v-model="priceMultiple" number @on-blur="formatPriceMultiple" :maxlength="5")
        span.input-number-handler(slot="prepend" @click="handleStep(-1)" :class="{'fn-disabled': downDisabled}")
          Icon(type="minus")
        span.input-number-handler(slot="append"  @click="handleStep(1)")
          Icon(type="plus")
    Button.ivu-btn-middle(type="warning" @click="submit") 添加注单
</template>

<script>
import { mapGetters } from 'vuex';
import mixins from "utils/mixins/bet";

function addNum(value, step) {
  value += step;
  return value;
}

export default {
	name: 'BetUtil',
	props: ['count', 'category', 'mode', 'parentPrice'],
  mixins: [mixins],
	data () {
		return {
			price: 0, // 单注金额
      unit: '1', // 单位（元、角、分
			unitLabel: {
				'1': '元',
				'0.1': '角',
				'0.01': '分'
      },

      priceMultiple: 1, // 金额初始倍数
      upDisabled: false,
      downDisabled: false,
		}
  },
	computed: {
		...mapGetters(['quickBet_list', 'appConfig']),
		units () {
			let str = this.appConfig.units
			return str ? str.split(',') : ['1']
		},
		cost () {
			let {count, price, unit, priceMultiple} = this
      if (isNaN(price)) price = 0
      let formatVal = (priceMultiple + '').replace(/[^\d]/g, '');
      formatVal = Math.max(Number(formatVal), 1);
			return (count * price * unit * formatVal).toFixed(2)
    },

    // 是否倍数模式
    isMultipleMode() {
      const cfg = this.appConfig;
      const { category } = this.$parent;
      if (category && !/(PK10|FT|SSC)$/.test(category)) {
        return false;
      }
      return !!(cfg ? cfg.multiple_raise == 1 : 0);
    },
    upClasses () {
      return 'fn-disabled';
    },
	},
	methods: {
		init () {
      let {defaultCost = 0} = this.appConfig
			let { quickBet_list, category } = this // store
      let multiple = 1
			if (quickBet_list) {
				let ss = quickBet_list[category]
        if (ss) multiple = ss.multiple
			}
      this.price = multiple * defaultCost
      this.unit = '1'
    },
		formatPrice () {
      this.validatePrice();
			this.$emit('update:parentPrice', this.price);
    },
    unitChange() {
      this.validatePrice();
    },
    validatePrice() {
      const { price, unit, priceMultiple } = this;
      const value = (price * 1000 * unit * priceMultiple) / 1000;
      const result = this.checkPrice(value);
      return result;
    },
		submit () {
      if (!this.validatePrice()) return;
      let { cost, price, unit, priceMultiple } = this;
      price *= priceMultiple;
			this.$emit('addBet', {
				cost,
				price,
				unit,
			});
    },

    // 倍数模式
    handleStep(num) {
      let val = this.priceMultiple;
      if (typeof num === 'number') {
        if (num === -1) {
          // 最低为1
          if (addNum(val, num) < 1) return false;
        }
        this.priceMultiple = addNum(val, num);
      }
    },
    // 格式化
    formatPriceMultiple() {
      let value = this.priceMultiple;
      let formatVal = (value + '').replace(/[^\d]/g, '');
      formatVal = Math.max(Number(formatVal), 1);
      this.priceMultiple = formatVal;
    }
	},
	watch: {
    'mode': 'init',
    'appConfig': 'init', // TODO: 异步数据的操作
    priceMultiple(value) {
      this.downDisabled = value == 1;
    },
	}
}
</script>

<style lang="scss" scoped>
.bet-util {
  margin-bottom: 16px;
  padding-right: 87px;
  .fn-left {
    margin-top: 11px;
  }
  .label-num {
    padding: 0 3px;
  }
  .price {
    margin: 0 1px;
    width: 40px;
  }
  .radio-unit {
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
    @include clearfix();
    .radio-item {
      float: left;
      margin-left: 2px;
      width: 18px;
      height: 16px;
      line-height: 14px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      background: #fbfbfb;
      color: #000;
      text-align: center;
      cursor: pointer;
      &.active {
        background: $primary-type2;
        color: #fff;
      }
    }
  }
  .radio-unit.fn-disabled .radio-item {
    cursor: not-allowed;
  }

  // 倍数模式
  .price-multiple /deep/ {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
    padding-right: 20px;
    .ivu-input-group .ivu-input {
      width: 50px;
      height: 24px;
      line-height: 24px;
      text-align: center;
    }
    .input-number-handler {
      width: 24px;
      height: 24px;
      background: #f2f2f2;
      cursor: pointer;
      &.fn-disabled {
        cursor: not-allowed;
      }
    }
  }
  .price-multiple:after {
    content: "倍";
    position: absolute;
    top: 0;
    right: 0;
    line-height: 24px;
  }
}
</style>
